import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { 
    extendTheme,
    Button,
    Center,
    ChakraProvider,
    Heading,
    Modal,
    ModalBody,
    ModalContent,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
} from '@chakra-ui/react';
import { ProductT, ProductAggregateT } from './types';
import { useGetProducts, useCreateOrder, PrinterT } from './hooks';
import { ProductList } from './components/ProductList';
import { SmallProductCard } from './components/SmallProductCard';
import { useLocalStorage } from 'react-use';

const DisplayGrid = styled.div`
    display: grid;
    grid-template-columns: auto 400px;
    height: 100vh;
    background: var(--chakra-colors-gray-800);

    & > .product-list {
        padding: 10px;
        border-right: 1px solid #111;
        overflow: auto;
    }

    & > .total-column {
        display: grid;
        overflow: none;
        /* grid-template-rows: calc(80vh - 100px) 50px calc(20vh - 50px) 100px; */
        grid-template-rows: calc(80vh - 50px) calc(20vh - 50px) 100px;

        @media screen and (max-height: 768px) {
            grid-template-rows: calc(80vh - 100px) 20vh 100px;
        }

        & > div:first-child {
            padding: 10px;
            overflow: auto;
            background-color: var(--chakra-colors-gray-800);
        }

        & > div:nth-child(2) {
            text-align: center;
            border-top: 1px solid #11111160;
            background-color: #1a1a1a60;
            color: #fff;
            display: flex;
            -moz-box-align: center;
            align-items: center;
            -moz-box-pack: center;
            justify-content: center;
            user-select: none;

            & > h2 {
                margin-bottom: 0;
            }

            @media screen and (max-width: 1024px) {
                padding-top: 1vh;
            }

            @media screen and (max-width: 1280px) {
                & > h2 {
                    font-size: 75px;
                }
            }
        }

        & > div:last-child {
            display: flex;
            width: 100%;

            & > button.MuiButton-containedPrimary:not(:disabled)  {
                background-color: #287425;
            }

            & > button.MuiButton-containedPrimary:disabled {
                background-color: #6d6d6d;
            }

            & > button.MuiButton-containedSecondary:not(:disabled) {
                color: #fff;
                background-color: #821e1e;
            }

            & > button {
                width: 50%;
                border-radius: 0;
            }
        }
    }
`;

const TotalProductList = styled.div`
    & > div:not(.hint) {
        cursor: pointer;
        margin-bottom: 5px;
        user-select: none;
    }

    & > .hint{
        text-align: center;
        padding-top: 10px;
        user-select: none;
    }
`;

export interface IHomeState {
    selectedProducts: ProductT[];
    orderCreated: number;
    processing: boolean;
    cashPayment: string;
    cashPaymentError: string | null;
};

/**
 * Renders the home route. There should only be one route.
 */
export const Home = () => {
    const [state, setState] = useState<IHomeState>({
        selectedProducts: [],
        orderCreated: 0,
        processing: false,
        cashPayment: '',
        cashPaymentError: null,
    });
    const { loading, products } = useGetProducts();
    const { createOrder, loading: loadingCreation } = useCreateOrder();
    const lastSelectedProduct = useRef<HTMLDivElement>(null);
    const [selectedPrinter] = useLocalStorage<PrinterT>('printer');
    const printerId = selectedPrinter ? selectedPrinter.id : 1;

    useEffect(() => {
        lastSelectedProduct.current?.scrollIntoView();
    }, [state.selectedProducts]);

    // Compute the total price of all products that were selected.
    const total = state.selectedProducts.map((p) => p.price).reduce((a, b) => a + b, 0);
    const aggregates: ProductAggregateT[] = [];

    for (let i in state.selectedProducts) {
        const product = state.selectedProducts[i];
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

    const customTheme = extendTheme({
        config: {
            initialColorMode: 'dark',
            useSystemColorMode: false,
        },
    });

    return (
        <ChakraProvider theme={customTheme}>
            <DisplayGrid>
                <div className="product-list">
                    {loading ? (
                        <Center height="100vh">
                            <Spinner size="xl" color='white' />
                        </Center>
                    ) : null}
                    <ProductList
                        products={products}
                        onClick={(product) => {
                            setState({
                                ...state,
                                selectedProducts: [ ...state.selectedProducts, product ],
                            });
                        }}
                    />
                </div>
                <div className="total-column">
                    <TotalProductList>
                        {/* Show this label only when no products are selected. */}
                        {aggregates.length === 0 ? (
                            <div className="hint">
                                <Heading size="md" as="h3" color="gray.700">
                                    To create a new order select products from the left.
                                </Heading>
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
                                        const selected = [...state.selectedProducts];
                                        const index = selected.findIndex((product) => {
                                            return aggregate.product.id == product.id;
                                        });
                                        selected.splice(index, 1);
                                        setState({
                                            ...state,
                                            selectedProducts: selected,
                                        });
                                    }}
                                >
                                    <SmallProductCard product={product} amount={amount} />
                                </div>
                            );
                        })}
                    </TotalProductList>
                    <div>
                        <Heading as="h2" size="2xl" marginBottom={10}>
                            ${total.toFixed(2)}
                        </Heading>
                    </div>
                    <div>
                        <Button
                            variant="solid"
                            backgroundColor="#246a24"
                            color="#fafafa"
                            size="large"
                            isDisabled={state.selectedProducts.length === 0 || loadingCreation || state.processing}
                            onClick={async () => {
                                const productIds = state.selectedProducts.map((p) => p.id);
                                const order = await createOrder(productIds);
                                setState({
                                    ...state,
                                    processing: true,
                                });

                                if (!order) {
                                    alert('Unable to create order');
                                    return;
                                }

                                // Now print the order's receipt.
                                await fetch(`/api/order/${order.id}/receipt/${printerId}`);

                                // Since the order was created, empty the list of selected products, open up the
                                // receipt dialog, and set processing to false.
                                setState({
                                    ...state,
                                    processing: false,
                                    orderCreated: order.id,
                                    selectedProducts: [],
                                    cashPayment: '',
                                });
                            }}
                            isLoading={state.processing}
                            spinner={<Spinner size="lg" color='white' />}
                        >
                            Checkout
                        </Button>
                        <Button
                            variant="solid"
                            backgroundColor="#771919"
                            color="#fafafa"
                            size="large"
                            isDisabled={state.selectedProducts.length === 0 || loadingCreation || state.processing}
                            onClick={() => {
                                setState({
                                    ...state,
                                    selectedProducts: [],
                                });
                            }}
                        >
                            Clear
                        </Button>
                    </div>

                    <Modal
                        isOpen={!!state.orderCreated}
                        onClose={() => setState({ ...state, orderCreated: 0 })}
                        isCentered
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>
                                Order Created
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <div>
                                    Order {state.orderCreated} was created.
                                </div>
                                <div>
                                    <b>Remember to extract the receipt.</b>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    colorScheme="ghost"
                                    onClick={() => fetch(`/api/order/${state.orderCreated}/receipt/${printerId}`)}
                                >
                                    Retry Receipt
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    mr={3}
                                    onClick={() => setState({ ...state, orderCreated: 0 })}
                                >
                                    Ok
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </div>
            </DisplayGrid>
        </ChakraProvider>
    );
};
