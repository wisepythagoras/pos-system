import { useState, useEffect } from "react";
import { useMedia } from "react-use";
import { ProductT, RichOrderT, StationT } from '../app/types';

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
     * @param orderId Optional parameter when searching for a specific order.
     * @returns The order(s) found.
     */
    const fetchOrders = async (orderId?: number) => {
        setState({
            ...state,
            loading: true,
            orders: [],
        });

        if (!orderId) {
            const req = await fetch(`/api/orders?p=${page}`);
            const resp = await req.json();

            if (resp.success === true) {
                setState({
                    ...state,
                    loading: false,
                    orders: resp.data || [],
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
        } else {
            const req = await fetch(`/api/order/${orderId}`);
            const resp = await req.json();

            if (resp.success === true && !!resp.data.order.id) {
                setState({
                    ...state,
                    loading: false,
                    orders: [resp.data] || [],
                });

                return [resp.data] as RichOrderT[];
            } else {
                setState({
                    ...state,
                    loading: false,
                    error: resp.error,
                    orders: [],
                });

                return null;
            }
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
    const [earnings, setEarnings] = useState<number[]>([0, 0, 0, 0, 0]);

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
            getEarnings(4),
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

interface IGetProductListState {
    loading: boolean;
    error: string | null;
    products: ProductT[];
};

/**
 * Gets the list of all products.
 * @returns The details.
 */
 export const useGetProductsList = () => {
    const [state, setState] = useState<IGetProductListState>({
        loading: false,
        error: null,
        products: [],
    });

    /**
     * Fetches the list of products.
     */
    const fetchProducts = async () => {
        setState({
            ...state,
            loading: true,
            products: [],
        });

        const req = await fetch(`/api/products?all=1`);
        const resp = await req.json();

        if (resp.success === true) {
            setState({
                ...state,
                loading: false,
                products: resp.data,
            });

            return resp.data as ProductT[];
        } else {
            setState({
                ...state,
                loading: false,
                error: resp.error || 'Unable to fetch products',
            });

            return null;
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { ...state, fetchProducts };
};

/**
 * Returns whether we're in a compact (mobile) view.
 */
export const useIsCompactView = (): boolean => {
    return useMedia('(max-width: 500px)');
};

type UseCreateStationReturnT =  {
    station: StationT | undefined;
    createStation: (name: string) => Promise<{ success: boolean, data: StationT | null }>;
};

export const useCreateStation = (): UseCreateStationReturnT => {
    const [station, setStation] = useState<StationT>();

    const createStation = async (name: string) => {
        const body = new FormData();
        body.append('name', name);

        const req = await fetch('/api/station', {
            method: 'POST',
            body,
        });
        const resp = await req.json();

        if (resp.success) {
            setStation(resp.data);
        }

        return resp;
    };

    return {
        station,
        createStation,
    };
};
