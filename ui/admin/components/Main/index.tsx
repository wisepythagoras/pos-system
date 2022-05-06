import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Tab,
    TabList,
    Tabs,
    TabPanel,
    TabPanels,
    Center,
} from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import {
    useGetOrdersList,
    useGetEarningsPerDay,
    useGetTotalEarnings,
    useGetProductsList,
    useIsCompactView,
} from '../../hooks';
import { ProductsTab } from '../ProductsTab';
import { OrdersTab } from '../OrdersTab';
import { AdminWrapper } from './styled';
import { LockIcon } from '@chakra-ui/icons';

export interface IMainProps {};

/**
 * Renders the main page.
 * @param props The props.
 * @returns The Main page component.
 */
export const Main = (props: IMainProps) => {
    const [page, setPage] = useState(1);
    const { loading, error, orders, fetchOrders } = useGetOrdersList(page);
    const {
        loading: loadingProducts,
        error: loadingProductsError,
        products,
        fetchProducts,
    } = useGetProductsList();
    const earningsPerDay = useGetEarningsPerDay();
    const earnings = useGetTotalEarnings();
    const isCompactView = useIsCompactView();
    const lastOrderRef = useRef(0);

    if (page === 1 && !loading && orders.length > 0) {
        lastOrderRef.current = orders[0].order_id;
    }

    const exportTotals = (pastDay = false) => {
        const link = document.createElement('a');
        link.download = '';
        link.href = `/api/orders/totals/export${pastDay ? '?day=1' : ''}`;
        link.click();
    };

    const onSearchChange = debounce((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const idStr = e.target.value || '0';
        const id = parseInt(idStr);
        console.log(idStr);
        
        if (isNaN(id)) {
            return;
        }

        if (id <= 0) {
            fetchOrders();
            return;
        }

        fetchOrders(id);
    }, 500);

    const usersTab = (
        <div>Hello</div>
    );

    return (
        <AdminWrapper>
            <Tabs
                variant="enclosed-colored"
                display="flex"
                flexDirection={isCompactView ? 'column' : 'row'}
                orientation={isCompactView ? 'horizontal' : 'vertical'}
            >
                <Box
                    height={isCompactView ? 'auto' : '100vh'}
                    marginBottom={isCompactView ? 'initial' : '0'}
                    backgroundColor="gray.100"
                    border={isCompactView ? 'none' : '1px solid rgb(226, 232, 240)'}
                    width={isCompactView ? 'auto' : '160px'}
                    display="flex"
                    flexDirection={isCompactView ? 'row' : 'column'}
                    justifyContent="space-between"
                >
                    <TabList mb="1em">
                        <Tab marginTop={isCompactView ? undefined : '-2px'}>Orders</Tab>
                        <Tab>Products</Tab>
                        <Tab marginRight={isCompactView ? undefined : '-1px'}>
                            Users
                        </Tab>
                    </TabList>
                    {!isCompactView ? (
                        <Box padding="10px">
                            <Center>
                                <Button
                                    leftIcon={<LockIcon />}
                                    colorScheme="pink"
                                    variant="solid"
                                    width="100%"
                                    onClick={() => window.location.href = '/logout'}
                                >
                                    <Box paddingTop="4px">
                                        Logout
                                    </Box>
                                </Button>
                            </Center>
                        </Box>
                    ) : undefined}
                </Box>
                <TabPanels
                    height={isCompactView ? 'auto' : '100vh'}
                    paddingTop={isCompactView ? 'initial' : '40px'}
                    overflowY="auto"
                >
                    <TabPanel>
                        <OrdersTab
                            earnings={earnings}
                            earningsPerDay={earningsPerDay}
                            error={error}
                            exportTotals={exportTotals}
                            lastOrder={lastOrderRef.current}
                            loading={loading}
                            onPageChange={(page) => setPage(page)}
                            onSearchChange={onSearchChange}
                            orders={orders}
                            page={page}
                        />
                    </TabPanel>
                    <TabPanel>
                        <ProductsTab
                            loadingProducts={loadingProducts}
                            loadingProductsError={loadingProductsError}
                            products={products}
                            fetchProducts={fetchProducts}
                        />
                    </TabPanel>
                    <TabPanel>{usersTab}</TabPanel>
                </TabPanels>
            </Tabs>
        </AdminWrapper>
    );
};
