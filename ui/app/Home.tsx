import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ProductT } from './types';
import { ProductList } from './components/ProductList';

/**
 * A hook that gets and returns the list of available products.
 * @returns The list of available products.
 */
const useGetProducts = () => {
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

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto 300px;
`;

/**
 * Renders the home route. There should only be one route.
 */
export const Home = () => {
    const [selectedProducts, setSelectedProducts] = useState<ProductT[]>([]);
    const products = useGetProducts();

    const total = selectedProducts.map((p) => p.price).reduce((a, b) => a + b, 0);

    return (
        <Grid>
            <div>
                <ProductList
                    products={products}
                    onClick={(product) => {
                        setSelectedProducts([ ...selectedProducts, product ]);
                    }}
                />
            </div>
            <div>
                {selectedProducts.map((product, i) => {
                    return (
                        <div key={i}>
                            {product.name}
                        </div>
                    )
                })}
                <div>${total.toFixed(2)}</div>
            </div>
        </Grid>
    );
};
