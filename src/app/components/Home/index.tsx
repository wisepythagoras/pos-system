import React from 'react';
import { Alert, Center } from '@chakra-ui/react';
import { POSHome } from './POSHome';
import { StationHome } from './StationHome';
import { useGetUser } from '../../hooks';

export const Home = () => {
    // const { colorMode, toggleColorMode } = useColorMode();
    const { user, loading } = useGetUser();

    // useEffect(() => {
    //     // This ugly solution is needed because Chakra's `LightMode` HOC or `extendTheme` method for setting
    //     // the theme to light mode doesn't work, for some reason.
    //     if (!!user && !user.station && colorMode !== 'dark') {
    //         toggleColorMode?.();
    //     }
    // }, [user, colorMode]);

    if (!user && !loading) {
        return (
            <Center>
                <Alert.Root status="error">
                    <Alert.Content>
                        <Alert.Description>
                            There was an error loading the user. Please&nbsp;
                            <a href="/login">login</a>&nbsp;again.
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
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
        return <StationHome user={user} />;
    }

    return <POSHome />;
};
