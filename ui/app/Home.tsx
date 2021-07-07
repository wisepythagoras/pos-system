import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@material-ui/core';
import { ProductT, ProductAggregateT } from './types';
import { useGetProducts, useCreateOrder } from './hooks';
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
    const { createOrder, loading: loadingCreation } = useCreateOrder();
    const lastSelectedProduct = useRef<HTMLDivElement>(null);
    const [orderCreated, setOrderCreated] = useState<number>(0);

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
                    {/* Show this label only when no products are selected. */}
                    {aggregates.length === 0 ? (
                        <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                            <Typography color="textSecondary" component="h3">
                                To create a new order select products from the left.
                            </Typography>
                        </div>
                    ) : null}

                    {/* Show the list of selected products. */}
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
                        disabled={selectedProducts.length === 0 || loadingCreation}
                        onClick={async () => {
                            const productIds = selectedProducts.map((p) => p.id);
                            const order = await createOrder(productIds);

                            if (!order) {
                                alert('Unable to create order');
                                return;
                            }

                            // Now print the order's receipt.
                            await fetch(`/api/order/${order.id}/receipt`);

                            // Open up the dialog.
                            setOrderCreated(order.id);

                            // Since the order was created, empty 
                            setSelectedProducts([]);
                        }}
                    >
                        Place
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={selectedProducts.length === 0 || loadingCreation}
                        onClick={() => setSelectedProducts([])}
                    >
                        Cancel
                    </Button>
                </div>

                <Dialog open={!!orderCreated}>
                    <DialogTitle>
                        Order Created
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <div>Order {orderCreated} was created.</div>
                            <div>
                                <b>Remember to extract the receipt.</b>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={() => fetch(`/api/order/${orderCreated}/receipt`)}>
                            Retry Receipt
                        </Button>
                        <Button color="primary" onClick={() => setOrderCreated(0)}>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </DisplayGrid>
    );
};
