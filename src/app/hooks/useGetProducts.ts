import { useEffect, useRef, useState } from 'react';
import { ProductT } from '../types';

type GetProductsStateT = {
    products: ProductT[];
    loading: boolean;
    socketIsOpen: boolean;
    waitingToReconnect: boolean;
};

/**
 * A hook that gets and returns the list of available products.
 * @returns The list of available products.
 */
export const useGetProducts = () => {
    const [state, setState] = useState<GetProductsStateT>({
        products: [],
        loading: false,
        socketIsOpen: false,
        waitingToReconnect: false,
    });
    const stateRef = useRef(state);
    const wsRef = useRef<WebSocket | null>(null);
    const waitRef = useRef<NodeJS.Timer | null>(null);

    const onSocketMessage = async (event: MessageEvent<any>) => {
        const data = JSON.parse(await event.data.text()) as ProductT;

        if (stateRef.current.products.length > 0) {
            const products = [...stateRef.current.products];
            const index = products.findIndex((p) => p.id === data.id);

            if (index < 0) {
                products.push(data);
            } else if (!data.discontinued) {
                products[index] = data;
            } else if (data.discontinued) {
                products.splice(index, 1);
            }

            setState({
                ...stateRef.current,
                products: products,
            });
        }
    };
    const onSocketOpen = () => {
        setState({
            ...stateRef.current,
            socketIsOpen: true,
        });
        console.log('SOCKET_CONNECTED', new Date());
    };
    const onSocketClose = () => {
        if (stateRef.current.waitingToReconnect || !wsRef.current) {
            return;
        }

        wsRef.current = null;
        setState({
            ...stateRef.current,
            socketIsOpen: false,
            waitingToReconnect: true,
        });

        if (!!waitRef.current) {
            return;
        }

        // Try to reconnect every second.
        waitRef.current = setInterval(() => {
            if (stateRef.current.socketIsOpen) {
                // @ts-ignore
                clearInterval(waitRef.current);
                return;
            }

            // Remove the waitingToReconnect flag so that the client can reconnect.
            if (stateRef.current.waitingToReconnect) {
                setState({
                    ...stateRef.current,
                    waitingToReconnect: false,
                });
            }
        }, 1000);
    };

    useEffect(() => {
        // This is what submits the actual request to get the list of products.
        const getProducts = async () => {
            const req = await fetch('/api/products');
            const resp = await req.json();

            if (resp.success) {
                setState({
                    ...stateRef.current,
                    products: resp.data,
                    loading: false,
                });
            }
        };

        getProducts();
        setState({
            ...stateRef.current,
            loading: true,
        });
    }, []);

    useEffect(() => {
        if (state.waitingToReconnect || !!wsRef.current) {
            return;
        }

        const host = window.location.host;
        const socket = new WebSocket(`ws://${host}/api/products/ws`);
        wsRef.current = socket;

        socket.onmessage = onSocketMessage;
        socket.onopen = onSocketOpen;
        socket.onerror = (e) => console.log('SOCKET_ERROR', e);
        socket.onclose = onSocketClose;

        return () => {
            wsRef.current?.close();
            wsRef.current = null;
        };
    }, [state.waitingToReconnect]);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    return state;
};