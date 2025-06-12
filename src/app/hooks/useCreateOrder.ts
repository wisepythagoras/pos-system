import { useState } from 'react';
import { OrderT } from '../types';

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