import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { 
    Button,
    Center,
    Heading,
    Spinner,
    Box,
    Dialog,
    Portal,
} from '@chakra-ui/react';
import { ProductT, ProductAggregateT, PrinterT } from '../../types';
import { useGetProducts, useCreateOrder } from '../../hooks';
import { ProductList } from '../ProductList';
import { SmallProductCard } from '../SmallProductCard';
import { useLocalStorage, useWindowSize } from 'react-use';
import { DisplayGrid, TotalProductList } from './styled';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { useProductTypes } from '../../../admin/hooks';

type StateT = {
    selectedProducts: ProductT[];
    orderCreated: number;
    processing: boolean;
    cashPayment: string;
    cashPaymentError: string | null;
};

/**
 * Renders the home route. There should only be one route.
 */
export const POSHome = () => {
    const [state, setState] = useState<StateT>({
        selectedProducts: [],
        orderCreated: 0,
        processing: false,
        cashPayment: '',
        cashPaymentError: null,
    });
    const { loading, products } = useGetProducts();
    const { productTypes } = useProductTypes();
    const { createOrder, loading: loadingCreation } = useCreateOrder();
    const lastSelectedProduct = useRef<HTMLDivElement>(null);
    const [printer] = useLocalStorage<PrinterT>('printer');
    const printerRef = useRef<PrinterT | undefined>(printer);
    const stateRef = useRef<StateT>(state);
    stateRef.current = state;
    const lockRef = useRef(false);
    const printerId = printerRef.current ? printerRef.current.id : 1;

    // TODO: Consider moving to a dedicated hook.
    const size = useWindowSize();

    useEffect(() => {
        if (lockRef.current) {
            lockRef.current = false;
            return;
        }

        lastSelectedProduct.current?.scrollIntoView();
    }, [state.selectedProducts]);

    const addProduct = useCallback((product: ProductT) => {
        const selectedProducts = [...stateRef.current.selectedProducts];
        const selectedPositions: number[] = [];
        const selectedMap: Record<number, number> = {};
        let i = 0;

        selectedProducts.forEach((product) => {
            if (product.id in selectedMap) {
                const j = selectedMap[product.id];
                selectedPositions.splice(j + 1, 0, product.id);
                return;
            }

            selectedMap[product.id] = i;
            selectedPositions.push(product.id);
            i++;
        });

        const idx = selectedPositions
            .findIndex((pId) => pId === product.id);

        if (
            selectedProducts.length > 0 &&
            idx < selectedProducts.length - 1 &&
            idx >= 0
        ) {
            lockRef.current = true;
        }

        if (idx >= 0) {
            selectedProducts.splice(idx + 1, 0, product);
        } else {
            selectedProducts.push(product);
        }

        setState({
            ...stateRef.current,
            selectedProducts,
        });
    }, []);

    // Compute the total price of all products that were selected.
    const total = state.selectedProducts.map((p) => p.price).reduce((a, b) => a + b, 0);
    
    const aggregates = useMemo(() => {
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

        return aggregates;
    }, [state]);

    return (
        <DisplayGrid>
            <div className="product-list">
                {loading ? (
                    <Center height="100vh">
                        <Spinner size="xl" color='white' />
                    </Center>
                ) : null}
                <ProductList
                    products={products}
                    productTypes={productTypes}
                    onClick={addProduct}
                    onPrinterChange={(p: PrinterT | undefined) => {
                        printerRef.current = p;
                    }}
                />
            </div>
            <div className="total-column">
                <Box className="top-actions">
                    {aggregates.length > 0 ? (
                        <>
                            {size.width > 800 ? (
                                <Box fontWeight={700} color="gray.600">
                                    New Order
                                </Box>
                            ) : undefined}
                            <Button
                                colorScheme="grey.200"
                                variant="ghost"
                                onClick={() => {
                                    setState({
                                        ...state,
                                        selectedProducts: [],
                                    });
                                }}
                            >
                                Clear <SmallCloseIcon />
                            </Button>
                        </>
                    ) : undefined}
                </Box>
                <TotalProductList>
                    {/* Show this label only when no products are selected. */}
                    {aggregates.length === 0 ? (
                        <div className="hint">
                            <Heading size="md" as="h3" color="gray.700">
                                To create a new order select products from the {size.width > 800 ? 'left' : 'top'}.
                            </Heading>
                        </div>
                    ) : null}

                    {/* Show the list of selected products. */}
                    {aggregates.map((aggregate, i) => {
                        const isLast = aggregates.length - 1 == i;
                        const { amount, product } = aggregate;

                        return (
                            <div
                                key={aggregate.product.id}
                                ref={isLast ? lastSelectedProduct : undefined}
                            >
                                <SmallProductCard
                                    product={product}
                                    amount={amount}
                                    onAddProduct={addProduct}
                                    onDecrease={() => {
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
                                    onRemove={() => {
                                        const selected: ProductT[] = [];

                                        state.selectedProducts.forEach((p) => {
                                            if (aggregate.product.id !== p.id) {
                                                selected.push(p);
                                            }
                                        });

                                        setState({
                                            ...state,
                                            selectedProducts: selected,
                                        });
                                    }}
                                />
                            </div>
                        );
                    })}
                </TotalProductList>
                <div className="action-info">
                    <div>
                        <Heading as="h2">
                            <Box color="gray.600" display="inline-block">$</Box>{total.toFixed(2)}
                        </Heading>
                    </div>
                    <div>
                        <Button
                            variant="solid"
                            backgroundColor={
                                aggregates.length === 0 ?
                                    '#222a39' :
                                    '#6a2424'
                            }
                            color="#fafafa"
                            size="2xl"
                            disabled={state.selectedProducts.length === 0 || loadingCreation || state.processing}
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
                            loading={state.processing}
                            spinner={<Spinner size="lg" color='white' />}
                        >
                            Checkout
                        </Button>
                    </div>
                </div>

                <Dialog.Root
                    open={!!state.orderCreated}
                    onEscapeKeyDown={() => setState({ ...state, orderCreated: 0 })}
                    onInteractOutside={() => setState({ ...state, orderCreated: 0 })}
                    onExitComplete={() => setState({ ...state, orderCreated: 0 })}
                    closeOnInteractOutside
                    closeOnEscape
                >
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Order Created</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <div>
                                    Order {state.orderCreated} was created.
                                </div>
                                <div>
                                    <b>Remember to extract the receipt.</b>
                                </div>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Button
                                    colorPalette="ghost"
                                    onClick={() => fetch(`/api/order/${state.orderCreated}/receipt/${printerId}`)}
                                >
                                    Retry Receipt
                                </Button>
                                <Button
                                    colorPalette="blue"
                                    onClick={() => setState({ ...state, orderCreated: 0 })}
                                >
                                    Ok
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            </div>
        </DisplayGrid>
    );
};
