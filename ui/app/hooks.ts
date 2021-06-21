import { useEffect, useState } from "react";
import { ProductT } from './types';

type GetProductsStateT = {
    products: ProductT[];
    loading: boolean;
}

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
