import React from 'react';
import {
    Alert,
    Box,
    Center,
    Container,
} from '@chakra-ui/react';
import { UserT } from '../../types';
import { StationNavbar } from '../StationNavbar';
import { DEEP_BLUE, LIGHT_BLUE, WHITE } from './stationTheme';
import { useOrdersEventSource } from '../../hooks';

type PropsT = {
    user: UserT;
};

export const StationHome = (props: PropsT) => {
    const { user } = props;
    const {
        connected,
        orders,
    } = useOrdersEventSource(user);

    if (!user.station) {
        return (
            <Center>
                <Alert status="warning">
                    You are not assigned to any station.
                </Alert>
            </Center>
        );
    }

    return (
        <Box>
            <StationNavbar />
            <Container maxW="8xl">
                <Center background="aliceblue">
                    <Box>
                        <Alert status="info" maxW="400px">
                            You are assigned to the station "{user.station.name}".
                        </Alert>
                    </Box>
                </Center>
                <Center>
                    <Box>
                        {!connected ? (
                            <Alert status="error">
                                You have been disconnected.
                            </Alert>
                        ) : undefined}
                    </Box>
                </Center>
                <Center>
                    <Box>
                        {orders.map((o) => {
                            return (
                                <Box key={o.id}>
                                    {JSON.stringify(o)}
                                </Box>
                            );
                        })}
                    </Box>
                </Center>
            </Container>
        </Box>
    );
};
