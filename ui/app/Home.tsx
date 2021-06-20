import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { ProductT } from './types';
import { ProductList } from './components/ProductList';
import { SmallProductCard } from './components/SmallProductCard';

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

const DisplayGrid = styled.div`
    display: grid;
    grid-template-columns: auto 400px;
    height: 100vh;

    & > .product-list {
        padding: 10px;
        border-right: 1px solid #b3b3b3;
        overflow: auto;
    }

    & > .total-column {
        display: grid;
        overflow: none;
        grid-template-rows: 80vh 20vh;

        & > div:first-child {
            padding: 10px;
            overflow: auto;
            min-height: 500px;
            background-color: #f0f0f0;
        }

        & > div:last-child {
            padding: 20px;
            padding-top: 4vh;
            text-align: center;
            border-top: 1px solid #b3b3b3;
            background-color: #fff;
        }
    }
`;

const TotalProductList = styled.div`
    & > div {
        cursor: pointer;
        margin-bottom: 5px;
    }
`;

/**
 * Renders the home route. There should only be one route.
 */
export const Home = () => {
    const [selectedProducts, setSelectedProducts] = useState<ProductT[]>([]);
    const products = useGetProducts();
    const lastSelectedProduct = useRef<HTMLDivElement>(null);

    useEffect(() => {
        lastSelectedProduct.current?.scrollIntoView();
    }, [selectedProducts]);

    // Compute the total price of all products that were selected.
    const total = selectedProducts.map((p) => p.price).reduce((a, b) => a + b, 0);

    return (
        <DisplayGrid>
            <div className="product-list">
                <ProductList
                    products={products}
                    onClick={(product) => {
                        setSelectedProducts([ ...selectedProducts, product ]);
                    }}
                />
            </div>
            <div className="total-column">
                <TotalProductList>
                    {selectedProducts.map((product, i) => {
                        const isLast = selectedProducts.length - 1 == i;

                        return (
                            <div key={i} ref={isLast ? lastSelectedProduct : undefined}>
                                <SmallProductCard product={product} />
                            </div>
                        );
                    })}
                </TotalProductList>
                <div>
                    <Typography variant="h1" component="h2" gutterBottom>
                        ${total.toFixed(2)}
                    </Typography>
                </div>
            </div>
        </DisplayGrid>
    );
};
