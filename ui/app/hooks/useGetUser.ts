import { useCallback, useEffect, useState } from 'react';
import { ApiResponse, UserT } from '../types';

type UserStateT = {
    user: UserT | undefined;
    loading: boolean;
    error: string | undefined;
}

/**
 * A hook that returns the currently logged in user.
 * @returns The user and the function to manually get the user.
 */
export const useGetUser = () => {
    const [state, setState] = useState<UserStateT>({
        user: undefined,
        loading: true,
        error: undefined,
    });

    const getUser = useCallback(async () => {
        const req = await fetch('/api/user');
        const resp = await req.json() as ApiResponse<UserT | null>;

        setState({
            user: resp.data || undefined,
            loading: false,
            error: resp.error,
        });

        return resp.data;
    }, []);

    useEffect(() => {
        getUser();
    }, []);

    return { ...state, getUser };
};