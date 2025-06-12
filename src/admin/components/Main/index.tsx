import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Tabs,
    Center,
    Drawer,
    useDisclosure,
    HStack,
    Heading,
    Theme,
} from '@chakra-ui/react';
import { HamburgerIcon, LockIcon } from '@chakra-ui/icons';
import debounce from 'lodash/debounce';
import { AdminWrapper } from './styled';
import {
    useGetOrdersList,
    useGetEarningsPerDay,
    useGetTotalEarnings,
    useGetProductsList,
    useIsCompactView,
    useProductTypes,
} from '../../hooks';
import { ProductsTab } from '../ProductsTab';
import { OrdersTab } from '../OrdersTab';
import { StationsTab } from '../StationsTab';
import { UsersTab } from '../UsersTab';
import { HomeTab } from '../HomeTab';

export interface IMainProps {};

/**
 * Renders the main page.
 * @param props The props.
 * @returns The Main page component.
 */
export const Main = (props: IMainProps) => {
    const [page, setPage] = useState(1);
    const { loading, error, orders, fetchOrders } = useGetOrdersList(page);
    const { open: isOpen, onOpen, onClose } = useDisclosure();
    const {
        loading: loadingProducts,
        error: loadingProductsError,
        products,
        fetchProducts,
    } = useGetProductsList();
    const { productTypes, getProductTypes, createProductType } = useProductTypes();
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
        
        if (isNaN(id)) {
            return;
        }

        if (id <= 0) {
            fetchOrders();
            return;
        }

        fetchOrders(id);
    }, 500);

    const TabWrapper = isCompactView ? Button : Box;

    const tabList = (
        // @ts-ignore - Chakra is breaking Typescript
        <Tabs.List
            mb="1em"
            style={isCompactView ? {
                display: 'flex',
                flexDirection: 'column',
            } : undefined}
        >
            {/* @ts-ignore - Chakra is breaking Typescript */}
            <Tabs.Trigger
                marginTop={isCompactView ? undefined : '-2px'}
                onClick={onClose}
                value="home"
            >
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Home
                </TabWrapper>
            </Tabs.Trigger>
            {/* @ts-ignore - Chakra is breaking Typescript */}
            <Tabs.Trigger onClick={onClose} value="orders">
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Orders
                </TabWrapper>
            </Tabs.Trigger>
            {/* @ts-ignore - Chakra is breaking Typescript */}
            <Tabs.Trigger onClick={onClose} value="products">
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Products
                </TabWrapper>
            </Tabs.Trigger>
            {/* @ts-ignore - Chakra is breaking Typescript */}
            <Tabs.Trigger
                marginRight={isCompactView ? undefined : '-1px'}
                onClick={onClose}
                value="stations"
            >
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Stations
                </TabWrapper>
            </Tabs.Trigger>
            {/* @ts-ignore - Chakra is breaking Typescript */}
            <Tabs.Trigger
                marginRight={isCompactView ? undefined : '-1px'}
                onClick={onClose}
                value="users"
            >
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Users
                </TabWrapper>
            </Tabs.Trigger>
        </Tabs.List>
    );

    const logoutButton = (
        <Button
            colorScheme="red"
            variant="solid"
            width="100%"
            onClick={() => window.location.href = '/logout'}
        >
            <LockIcon /> Logout
        </Button>
    );

    return (
        <Theme appearance="light">
            <AdminWrapper>
                {isCompactView ? (
                    <HStack spaceX="5px">
                        <Button
                            colorScheme="gray"
                            variant="ghost"
                            onClick={onOpen}
                            className="hamburger-menu-btn"
                        >
                            <HamburgerIcon />
                        </Button>
                        <Heading as="h1" size="md" paddingTop="5px">
                            POS Admin
                        </Heading>
                    </HStack>
                ) : undefined}
                <Tabs.Root
                    variant="enclosed"
                    display="flex"
                    flexDirection={isCompactView ? 'column' : 'row'}
                    orientation="vertical"
                >
                    {!isCompactView ? (
                        <Box
                            height="100vh"
                            marginBottom={0}
                            backgroundColor="gray.100"
                            border="1px solid rgb(226, 232, 240)"
                            width="160px"
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                        >
                            <Box>
                                <Box padding="10px">
                                    <Heading size="md" as="h1" userSelect="none">
                                        POS Admin
                                    </Heading>
                                </Box>
                                {tabList}
                            </Box>
                            <Box padding="10px">
                                <Center>
                                    {logoutButton}
                                </Center>
                            </Box>
                        </Box>
                    ) : (
                        <Drawer.Root placement="start" isOpen={isOpen} onClose={onClose}>
                            <Drawer.Backdrop />
                            <Drawer.Trigger />
                            <Drawer.Positioner>
                                <Drawer.Content>
                                <Drawer.CloseTrigger />
                                <Drawer.Header>
                                    <Drawer.Title>POS Admin</Drawer.Title>
                                </Drawer.Header>
                                <Drawer.Body>
                                    {tabList}
                                </Drawer.Body>
                                <Drawer.Footer>
                                    {logoutButton}
                                </Drawer.Footer>
                                </Drawer.Content>
                            </Drawer.Positioner>
                        </Drawer.Root>
                    )}
                    {/* <TabPanels
                        height={isCompactView ? 'auto' : '100vh'}
                        paddingTop={isCompactView ? 'initial' : '40px'}
                        overflowY="auto"
                    > */}
                    <Tabs.Content value="home">
                        <HomeTab
                            earnings={earnings}
                            earningsPerDay={earningsPerDay}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="orders">
                        <OrdersTab
                            error={error}
                            exportTotals={exportTotals}
                            lastOrder={lastOrderRef.current}
                            loading={loading}
                            onPageChange={(page) => setPage(page)}
                            onSearchChange={onSearchChange}
                            orders={orders}
                            page={page}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="products">
                        <ProductsTab
                            loadingProducts={loadingProducts}
                            loadingProductsError={loadingProductsError}
                            products={products}
                            fetchProducts={fetchProducts}
                            productTypes={productTypes}
                            getProductTypes={getProductTypes}
                            createProductType={createProductType}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="stations">
                        <StationsTab />
                    </Tabs.Content>
                    <Tabs.Content value="users">
                        <UsersTab />
                    </Tabs.Content>
                    {/* </TabPanels> */}
                </Tabs.Root>
            </AdminWrapper>
        </Theme>
    );
};
