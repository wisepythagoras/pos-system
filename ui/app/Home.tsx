import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Typography, CircularProgress } from '@material-ui/core';
import { ProductT, ProductAggregateT } from './types';
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

            @media screen and (max-width: 1024px) {
                padding-top: 1vh;
            }
        }

        & > div:last-child {
            display: flex;
            width: 100%;

            & > button.MuiButton-containedPrimary {
                background-color: #31952e;
            }

            & > button.MuiButton-containedPrimary:disabled {
                background-color: darkgray;
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
        user-select: none;
    }
`;

/**
 * Renders the home route. There should only be one route.
 */
export const Home = () => {
    const [selectedProducts, setSelectedProducts] = useState<ProductT[]>([]);
    const { loading, products } = useGetProducts();
    const lastSelectedProduct = useRef<HTMLDivElement>(null);

    useEffect(() => {
        lastSelectedProduct.current?.scrollIntoView();
    }, [selectedProducts]);

    // Compute the total price of all products that were selected.
    const total = selectedProducts.map((p) => p.price).reduce((a, b) => a + b, 0);
    const aggregates: ProductAggregateT[] = [];

    for (let i in selectedProducts) {
        const product = selectedProducts[i];
        const index = aggregates.findIndex((p) => p.product.id === product.id);

        if (index < 0) {
            aggregates.push({
                product,
                amount: 1,
            });
        } else {
            aggregates[index].amount += 1;
        }
    }

    return (
        <DisplayGrid>
            <div className="product-list">
                {loading ? (
                    <div style={{ textAlign: 'center' }}>
                        <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            style={{
                                strokeLinecap: 'round',
                                color: '#1a90ff',
                                animationDuration: '550ms',
                                marginTop: '20px',
                            }}
                            size={40}
                            thickness={4}
                        />
                    </div>
                ) : null}
                <ProductList
                    products={products}
                    onClick={(product) => {
                        setSelectedProducts([ ...selectedProducts, product ]);
                    }}
                />
            </div>
            <div className="total-column">
                <TotalProductList>
                    {aggregates.map((aggregate, i) => {
                        const isLast = aggregates.length - 1 == i;
                        const { amount, product } = aggregate;

                        return (
                            <div
                                key={i}
                                ref={isLast ? lastSelectedProduct : undefined}
                                onClick={() => {
                                    const selected = [...selectedProducts];
                                    const index = selected.findIndex((product) => {
                                        return aggregate.product.id == product.id;
                                    });
                                    selected.splice(index, 1);
                                    setSelectedProducts(selected);
                                }}
                            >
                                <SmallProductCard product={product} amount={amount} />
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
