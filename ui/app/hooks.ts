import { useEffect, useState } from "react";
import { ProductT } from './types';

/**
 * A hook that gets and returns the list of available products.
 * @returns The list of available products.
 */
export const useGetProducts = () => {
    const [products, setProducts] = useState<ProductT[]>([]);

    useEffect(() => {
        const getProducts = async () => {
            const req = await fetch('/api/products');
            const resp = await req.json();

            if (resp.success) {
                setProducts(resp.data);
            }
        }

        getProducts();
    }, []);

    return products;
};
