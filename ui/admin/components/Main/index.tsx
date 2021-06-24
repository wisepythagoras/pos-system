import React, { useEffect, useState } from 'react';
import {
    Button,
    CircularProgress,
    Container,
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

export interface IMainProps {};

/**
 * Renders the main page.
 * @param props The props.
 * @returns The Main page component.
 */
export const Main = (props: IMainProps) => {
    const [page, setPage] = useState(1);
    const { loading, error, orders, fetchOrders } = useGetOrdersList(page);

    return (
        <Container>
            <Typography variant="h3" component="h3" gutterBottom>
                Admin 
            </Typography>
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
    );
};
