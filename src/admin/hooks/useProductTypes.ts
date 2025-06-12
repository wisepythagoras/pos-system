import { useCallback, useEffect, useState } from 'react';
import { ApiResponse, ProductTypeT } from '../../app/types';

export const useProductTypes = (shouldGetProductTypes = true) => {
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

    const createProductType = useCallback(async (
        name: string,
        title: string,
        color: string
    ): Promise<ProductTypeT | undefined> => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('title', title);
        formData.append('color', color);

        const resp = await fetch('/api/product/type', {
            method: 'PUT',
            body: formData,
        });
        const json = await resp.json() as ApiResponse<ProductTypeT>;

        if (json.success) {
            return json.data;
        }

        return undefined;
    }, []);

    useEffect(() => {
        if (!shouldGetProductTypes) {
            return;
        }

        getProductTypes();
    }, []);

    return {
        productTypes,
        getProductTypes,
        createProductType,
    };
};
