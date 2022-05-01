import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
    Button,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@material-ui/core';
import {
    Tab,
    TabList,
    Tabs,
    TabPanel,
    TabPanels,
} from '@chakra-ui/react';
import Pagination from '@material-ui/lab/Pagination';
import debounce from 'lodash/debounce';
import { RichOrder } from '../RichOrder';
import { RichProduct } from '../RichProduct';
import { CreateRichProduct } from '../RichProduct/Create';
import { EarningsCard } from '../EarningsCard';
import {
    useGetOrdersList,
    useGetEarningsPerDay,
    useGetTotalEarnings,
    useGetProductsList,
} from '../../hooks';

const GridRowBox = styled.div`
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    margin-bottom: 15px;

    & > div:not(:last-child) {
        margin-right: 5px;
    }
`;

const PaginationContainer = styled.div`
    padding: 10px;
    display: flex;
    justify-content: center;
`;

const ControlContainer = styled.div`
    margin-bottom: 15px;
    flex: 1;
    display: flex;

    & > button {
        margin-right: 5px;
    }

    & > .divider {
        width: 1px;
        margin: 0 10px;
    }
`;

const CustomAppBar = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;

    & > .app-bar-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;

        & > button {
            flex: 1;
            flex-grow: 1;

            &:not(:last-child) {
                margin-right: 5px;
            }
        }
    }
`;

export interface IMainProps {};

interface IMainState {
    page: number;
    tab: number;
}

/**
 * Renders the main page.
 * @param props The props.
 * @returns The Main page component.
 */
export const Main = (props: IMainProps) => {
    const [state, setState] = useState<IMainState>({
        page: 1,
        tab: 0,
    });
    const { loading, error, orders, fetchOrders } = useGetOrdersList(state.page);
    const {
        loading: loadingProducts,
        error: loadingProductsError,
        products,
        fetchProducts,
    } = useGetProductsList();
    const earningsPerDay = useGetEarningsPerDay();
    const earnings = useGetTotalEarnings();
    const lastOrderRef = useRef(0);

    if (state.page === 1 && !loading && orders.length > 0) {
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

    const setTab = (tab: number) => {
        setState({ ...state, tab });
    };

    const ordersTab = (
        <Container>
            <Typography variant="h3" component="h3" gutterBottom>
                Total Earnings: ${earnings.toFixed(2)}
            </Typography>
            <GridRowBox>
                <EarningsCard day={0} amount={earningsPerDay[0]} />
                <EarningsCard day={1} amount={earningsPerDay[1]} />
                <EarningsCard day={2} amount={earningsPerDay[2]} />
                <EarningsCard day={3} amount={earningsPerDay[3]} />
            </GridRowBox>
            <ControlContainer>
                <TextField
                    label="Search order id"
                    onChange={onSearchChange}
                    size="small"
                    style={{
                        width: '300px',
                        backgroundColor: '#fff',
                    }}
                    variant="outlined"
                />
                <Divider className="divider" orientation="vertical" flexItem />
                <Button onClick={() => exportTotals()} variant="contained" color="primary">
                    Export Sales YTD
                </Button>
                <Button onClick={() => exportTotals(true)} variant="contained" color="primary">
                    Export Sales Past Day
                </Button>
            </ControlContainer>
            <div>
                {!!error ? (
                    <Typography variant="h4" component="h4">
                        {error}
                    </Typography>
                ) : null}

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
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Purchased Items</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>Date Placed</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order, i) => <RichOrder key={i} order={order} />)}
                            </TableBody>
                        </Table>
                        <PaginationContainer>
                            <Pagination
                                defaultPage={1}
                                count={Math.round(lastOrderRef.current / 50)}
                                page={state.page}
                                onChange={(_, page) => {
                                    setState({
                                        ...state,
                                        page,
                                    });
                                }}
                                hideNextButton={orders.length < 50}
                                size="large"
                                showFirstButton
                                showLastButton
                            />
                        </PaginationContainer>
                    </TableContainer>
                )}
            </div>
            <br />
        </Container>
    );

    const productsTab = (
        <Container>
            <div>
                {!!loadingProductsError ? (
                    <Typography variant="h4" component="h4">
                        {loadingProductsError}
                    </Typography>
                ) : null}

                {/* This is where the create field will go. */}
                {/* <Card>
                    <TextField label="Name" />
                </Card> */}

                {loadingProducts && products.length === 0 ? (
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
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Sold Out</TableCell>
                                    <TableCell>Dicontinued</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <CreateRichProduct onSave={(_) => fetchProducts()} />
                                {products.map((product, i) => {
                                    return (
                                        <RichProduct
                                            key={i}
                                            product={product}
                                            onSave={(_) => fetchProducts()}
                                        />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
            <br />
        </Container>
    );

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
                    <TabPanel>{ordersTab}</TabPanel>
                    <TabPanel>{productsTab}</TabPanel>
                    <TabPanel>{usersTab}</TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
};
