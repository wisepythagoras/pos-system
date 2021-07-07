import { useState, useEffect } from "react";
import { RichOrderT } from '../app/types';

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
export const useGetOrdersList = (page: number) => {
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
export const useGetTotalEarnings = () => {
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
};

/**
 * Gets the earnings for the past 4 days.
 * @returns The earnings for the past 4 days.
 */
export const useGetEarningsPerDay = () => {
    const [earnings, setEarnings] = useState<number[]>([0, 0, 0, 0]);

    useEffect(() => {
        const getEarnings = async (day: number): Promise<number[]> => {
            const req = await fetch(`/api/orders/earnings/${day}`);
            const resp = await req.json();

            return [day, resp.data];
        };

        Promise.all([
            getEarnings(0),
            getEarnings(1),
            getEarnings(2),
            getEarnings(3),
        ]).then((queue) => {
            if (queue.length > 0) {
                const newEarnings = [...earnings];
    
                for (let [day, amount] of queue) {
                    newEarnings[day] = amount;
                }
    
                setEarnings(newEarnings);
            }
        });
    }, []);

    return earnings;
};
