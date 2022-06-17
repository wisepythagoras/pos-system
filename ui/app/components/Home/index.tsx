import React, { useEffect } from 'react';
import {
    Alert,
    Center,
    useColorMode,
} from '@chakra-ui/react';
import { POSHome } from './pos_home';
import { useGetUser } from '../../hooks';

export const Home = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { user, loading } = useGetUser();

    useEffect(() => {
        // This ugly solution is needed because Chakra's `LightMode` HOC or `extendTheme` method for setting
        // the theme to light mode doesn't work, for some reason.
        if (!!user && !user.station && colorMode !== 'dark') {
            toggleColorMode?.();
        }
    }, [user, colorMode]);

    if (!user && loading) {
        return (
            <Center>
                <Alert status="error">
                    There was an error loading the user. Please{' '}
                    <a href="/login">login</a> again.
                </Alert>
            </Center>
        );
    } else if (!user) {
        return (
            <Center>
                Loading...
            </Center>
        );
    }

    if (user.station) {
        return (
            <Center>
                <Alert status="info">
                    You are assigned to {user.station.name}.
                </Alert>
            </Center>
        )
    }

    return <POSHome />;
};
