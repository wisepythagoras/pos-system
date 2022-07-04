import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Button,
    Tab,
    TabList,
    Tabs,
    TabPanel,
    TabPanels,
    Center,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
    HStack,
    Heading,
    useColorMode,
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
    const { isOpen, onOpen, onClose } = useDisclosure();
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
    const { colorMode, toggleColorMode } = useColorMode();

    // @ts-ignore
    window._toggle = toggleColorMode;

    useEffect(() => {
        // This ugly solution is needed because Chakra's `LightMode` HOC or `extendTheme` method for setting
        // the theme to light mode doesn't work, for some reason.
        if (colorMode !== 'light') {
            toggleColorMode();
        }
    }, [colorMode]);

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
        <TabList
            mb="1em"
            style={isCompactView ? {
                display: 'flex',
                flexDirection: 'column',
            } : undefined}
        >
            <Tab
                marginTop={isCompactView ? undefined : '-2px'}
                onClick={onClose}
            >
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Home
                </TabWrapper>
            </Tab>
            <Tab onClick={onClose}>
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Orders
                </TabWrapper>
            </Tab>
            <Tab onClick={onClose}>
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Products
                </TabWrapper>
            </Tab>
            <Tab
                marginRight={isCompactView ? undefined : '-1px'}
                onClick={onClose}
            >
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Stations
                </TabWrapper>
            </Tab>
            <Tab
                marginRight={isCompactView ? undefined : '-1px'}
                onClick={onClose}
            >
                <TabWrapper colorScheme="teal" variant="ghost" width="100%">
                    Users
                </TabWrapper>
            </Tab>
        </TabList>
    );

    const logoutButton = (
        <Button
            leftIcon={<LockIcon />}
            colorScheme="red"
            variant="solid"
            width="100%"
            onClick={() => window.location.href = '/logout'}
        >
            <Box paddingTop="4px">
                Logout
            </Box>
        </Button>
    );

    return (
        <AdminWrapper>
            {isCompactView ? (
                <HStack spacing="5px">
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
            <Tabs
                variant="enclosed-colored"
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
                    <Drawer
                        isOpen={isOpen}
                        onClose={onClose}
                        placement="left"
                    >
                        <DrawerOverlay />
                        <DrawerContent>
                            <DrawerCloseButton />
                            <DrawerHeader>POS Admin</DrawerHeader>
                            <DrawerBody>
                                {tabList}
                            </DrawerBody>
                            <DrawerFooter>
                                {logoutButton}
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                )}
                <TabPanels
                    height={isCompactView ? 'auto' : '100vh'}
                    paddingTop={isCompactView ? 'initial' : '40px'}
                    overflowY="auto"
                >
                    <TabPanel>
                        <HomeTab
                            earnings={earnings}
                            earningsPerDay={earningsPerDay}
                        />
                    </TabPanel>
                    <TabPanel>
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
                    </TabPanel>
                    <TabPanel>
                        <ProductsTab
                            loadingProducts={loadingProducts}
                            loadingProductsError={loadingProductsError}
                            products={products}
                            fetchProducts={fetchProducts}
                        />
                    </TabPanel>
                    <TabPanel>
                        <StationsTab />
                    </TabPanel>
                    <TabPanel>
                        <UsersTab />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </AdminWrapper>
    );
};
