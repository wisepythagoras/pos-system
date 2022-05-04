import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
    Tab,
    TabList,
    Tabs,
    TabPanel,
    TabPanels,
} from '@chakra-ui/react';
import debounce from 'lodash/debounce';
import {
    useGetOrdersList,
    useGetEarningsPerDay,
    useGetTotalEarnings,
    useGetProductsList,
} from '../../hooks';
import { ProductsTab } from '../ProductsTab';
import { OrdersTab } from '../OrdersTab';

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
        <div>
            <Tabs variant="enclosed-colored" isFitted>
                <TabList mb="1em">
                    <Tab>Orders</Tab>
                    <Tab>Products</Tab>
                    <Tab>Users</Tab>
                </TabList>
                <TabPanels>
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
        </div>
    );
};
