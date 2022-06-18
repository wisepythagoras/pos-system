import { useCallback, useEffect, useRef, useState } from 'react';
import { OrderT, RichOrderT, UserT } from '../types';

/**
 * A custom hook that handles the event stream for the orders.
 * @param user The user that's logged in right now.
 * @returns The connection status and the orders.
 */
export const useOrdersEventSource = (user: UserT | null | undefined) => {
    const [connected, setConnected] = useState(false);
    const [orders, setOrders] = useState<OrderT[]>([]);
    const [retries, setRetries] = useState(0);
    const ordersRef = useRef(orders);
    ordersRef.current = orders;

    const messageHandler = (e: MessageEvent<any>) => {
        const orders = ordersRef.current;
        const newOrder = JSON.parse(e.data) as OrderT;
        const newOrders = [...orders];
        const existingIdx = orders.findIndex((o) => o.id === newOrder.id);
        const existingOrder = existingIdx >= 0 ? orders[existingIdx] : undefined;

        if (!!existingOrder && existingOrder.cancelled !== newOrder.cancelled) {
            // An order can't be added twice and it can't be different. Unless it was canceled.
            return;
        } else if (!!existingOrder) {
            newOrders[existingIdx] = newOrder;
        } else {
            newOrders.push(newOrder);
        }

        setOrders(newOrders);
    };

    const connectToEventStream = () => {
        const ordersStream = new EventSource('/api/orders/stream');

        ordersStream.addEventListener('message', messageHandler);

        ordersStream.onopen = () => setConnected(true);

        setTimeout(() => {
            setConnected(true);
        }, 5);

        return ordersStream;
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        let isClosing = false;
        const ordersStream = connectToEventStream();

        console.log(`Connecting - try ${retries}`);

        ordersStream.onerror = () => {
            if (ordersStream.readyState === ordersStream.CLOSED && !isClosing) {
                setConnected(false);

                // Wait a second before rertrying.
                setTimeout(() => {
                    setRetries(retries + 1);
                }, 1000);
            }
        };

        return () => {
            isClosing = true;
            ordersStream.close();
        };
    }, [user, retries]);

    return { connected, orders };
};
