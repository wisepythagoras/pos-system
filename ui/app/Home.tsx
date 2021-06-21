import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Typography, Button } from '@material-ui/core';
import { ProductT } from './types';
import { useGetProducts } from './hooks';
import { ProductList } from './components/ProductList';
import { SmallProductCard } from './components/SmallProductCard';

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
        grid-template-rows: calc(80vh - 50px) calc(20vh - 50px) 100px;

        & > div:first-child {
            padding: 10px;
            overflow: auto;
            min-height: 500px;
            background-color: #f0f0f0;
        }

        & > div:nth-child(2) {
            padding: 20px;
            padding-top: 3vh;
            text-align: center;
            border-top: 1px solid #b3b3b3;
            background-color: #fff;
        }

        & > div:last-child {
            display: flex;
            width: 100%;

            & > button.MuiButton-containedPrimary {
                background-color: #31952e;
            }

            & > button {
                width: 50%;
                border-radius: 0;
            }
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
                            <div
                                key={i}
                                ref={isLast ? lastSelectedProduct : undefined}
                                onClick={() => {
                                    const selected = [...selectedProducts];
                                    selected.splice(i, 1);
                                    setSelectedProducts(selected);
                                }}
                            >
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
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={selectedProducts.length === 0}
                        onClick={() => alert('Place order!')}
                    >
                        Place
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={selectedProducts.length === 0}
                        onClick={() => setSelectedProducts([])}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </DisplayGrid>
    );
};
