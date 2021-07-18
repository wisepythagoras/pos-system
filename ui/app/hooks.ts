import { useEffect, useState } from "react";
import { OrderT, ProductT } from './types';

type GetProductsStateT = {
    products: ProductT[];
    loading: boolean;
    canConnect: boolean;
    disconnected: boolean;
};

/**
 * A hook that gets and returns the list of available products.
 * @returns The list of available products.
 */
export const useGetProducts = () => {
    const [state, setState] = useState<GetProductsStateT>({
        products: [],
        loading: false,
        canConnect: false,
        disconnected: true,
    });

    const onSocketMessage = async (event: MessageEvent<any>) => {
        const data = JSON.parse(await event.data.text()) as ProductT;

        if (state.products.length > 0) {
            const products = [...state.products];
            const index = products.findIndex((p) => p.id === data.id);

            if (index < 0) {
                products.push(data);
            } else {
                products[index] = data;
            }

            setState({
                ...state,
                products: products,
            });
        }
    };
    const onSocketOpen = () => {
        if (state.disconnected) {
            setState({
                ...state,
                disconnected: false,
            });
        }
    };
    const onSocketClose = () => {
        if (!state.disconnected) {
            setState({
                ...state,
                disconnected: true,
            });
        }
    };

    useEffect(() => {
        const getProducts = async () => {
            const req = await fetch('/api/products');
            const resp = await req.json();

            if (resp.success) {
                setState({
                    ...state,
                    products: resp.data,
                    loading: false,
                    canConnect: true,
                });
            }
        };

        getProducts();
        setState({
            ...state,
            loading: true,
        });
    }, []);

    useEffect(() => {
        if (!state.canConnect && state.disconnected) {
            return;
        }

        const host = window.location.host;
        const socket = new WebSocket(`ws://${host}/api/products/ws`);

        socket.onmessage = onSocketMessage;
        socket.onopen = onSocketOpen;
        socket.onerror = (e) => console.log('SOCKET_ERROR', e);
        socket.onclose = onSocketClose;
    }, [state.canConnect]);

    return state;
};

type CreateOrderStateT = {
    order: OrderT | null;
    loading: boolean;
};

/**
 * Hook that handles the creation of an order.
 */
export const useCreateOrder = () => {
    const [ state, setState ] = useState<CreateOrderStateT>({
        order: null,
        loading: false,
    });

    /**
     * Creates the order.
     * @param productIds The ids to attach to the new order.
     * @returns The order
     */
    const createOrder = async (productIds: number[]): Promise<OrderT | null> => {
        setState({ ...state, loading: true });

        const body = new FormData();
        body.append('products', JSON.stringify(productIds));

        const req = await fetch('/api/order', {
            method: 'POST',
            body,
        });
        const resp = await req.json();

        if (!resp.success) {
            setState({ ...state, loading: false });
            return null;
        }

        setState({ order: resp.data, loading: false });

        return resp.data;
    };

    return { ...state, createOrder };
};
