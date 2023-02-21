import { useEffect, useState } from 'react';
import { ApiResponse, ProductTypeT } from '../../app/types';

export const useProductTypes = () => {
    const [productTypes, setProductTypes] = useState<ProductTypeT[]>([]);

    const getProductTypes = async () => {
        const resp = await fetch('/api/product/types');
        const json = await resp.json() as ApiResponse<ProductTypeT[]>;

        if (json.success) {
            setProductTypes(json.data);
        }
    };

    useEffect(() => {
        getProductTypes();
    }, []);

    return {
        productTypes,
        getProductTypes,
    };
};
