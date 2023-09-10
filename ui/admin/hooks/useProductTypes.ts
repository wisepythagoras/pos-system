import { useCallback, useEffect, useState } from 'react';
import { ApiResponse, ProductTypeT } from '../../app/types';

export const useProductTypes = () => {
    const [productTypes, setProductTypes] = useState<ProductTypeT[]>([]);

    const getProductTypes = useCallback(async () => {
        const resp = await fetch('/api/product/types');
        const json = await resp.json() as ApiResponse<ProductTypeT[]>;

        if (json.success) {
            setProductTypes(json.data);
            return json.data;
        }

        return [];
    }, []);

    const createProductType = useCallback(async (name: string, title: string) => {
        //
    }, []);

    useEffect(() => {
        getProductTypes();
    }, []);

    return {
        productTypes,
        getProductTypes,
        createProductType,
    };
};
