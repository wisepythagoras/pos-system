import { useEffect, useState } from "react";
import { OrderT, ProductT } from './types';

type GetProductsStateT = {
    products: ProductT[];
    loading: boolean;
};

/**
 * A hook that gets and returns the list of available products.
 * @returns The list of available products.
 */
export const useGetProducts = () => {
    const [state, setState] = useState<GetProductsStateT>({
        products: [],
        loading: false,
    })

    useEffect(() => {
        const getProducts = async () => {
            const req = await fetch('/api/products');
            const resp = await req.json();

            if (resp.success) {
                setState({
                    products: resp.data,
                    loading: false,
                });
            }
        }

        getProducts();
        setState({
            ...state,
            loading: true,
        });
    }, []);

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
