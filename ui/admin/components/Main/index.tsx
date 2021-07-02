import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core';
import { RichOrder } from '../RichOrder';
import { RichOrderT } from '../../../app/types';

interface IGetOrdersListState {
    loading: boolean;
    error: string | null;
    orders: RichOrderT[];
    page: number;
};

/**
 * Gets the list of orders.
 * @param page The page to get.
 * @returns The details.
 */
const useGetOrdersList = (page: number) => {
    const [state, setState] = useState<IGetOrdersListState>({
        loading: false,
        error: null,
        orders: [],
        page,
    });

    /**
     * Fetches the list of orders.
     */
    const fetchOrders = async () => {
        setState({
            ...state,
            loading: true,
            orders: [],
        });

        const req = await fetch(`/api/orders?p=${page}`);
        const resp = await req.json();

        if (resp.success === true) {
            setState({
                ...state,
                loading: false,
                orders: resp.data,
            });

            return resp.data as RichOrderT[];
        } else {
            setState({
                ...state,
                loading: false,
                error: resp.error || 'Unable to fetch orders',
            });

            return null;
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);

    return { ...state, fetchOrders };
};

/**
 * A hook that gets the total earnings year-to-date.
 * @returns The total earnings.
 */
const useGetTotalEarnings = () => {
    const [earnings, setEarnings] = useState(0);

    useEffect(() => {
        const getEarnings = async () => {
            const req = await fetch('/api/orders/earnings');
            const resp = await req.json();

            setEarnings(resp.data);
        };

        getEarnings();
    });

    return earnings;
}

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
    const earnings = useGetTotalEarnings();

    const exportTotals = () => {
        const link = document.createElement('a');
        link.download = '';
        link.href = '/api/orders/totals/export';
        link.click();
    };

    return (
        <div>
            <AppBar>
                <Tabs value={state.tab} onChange={(_, tab) => setState({ ...state, tab })}>
                    <Tab label="Orders" />
                    <Tab label="Users" />
                </Tabs>
            </AppBar>
            <br />
            <br />
            {state.tab === 0 ? (
                <Container>
                    <br />
                    <Typography variant="h3" component="h3" gutterBottom>
                        Total Earnings: ${earnings.toFixed(2)}
                    </Typography>
                    <div style={{ marginBottom: '15px' }}>
                        <Button onClick={exportTotals} variant="contained" color="primary">
                            Export
                        </Button>
                    </div>
                    <div>
                        {error ? (
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
                        ) : null}

                        {orders.map((order) => <RichOrder order={order} />)}
                    </div>
                    <br />
                </Container>
            ) : null}

            {state.tab === 1 ? (
                <div>Hello</div>
            ) : null}
        </div>
    );
};
