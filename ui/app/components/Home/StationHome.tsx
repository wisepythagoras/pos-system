import React from 'react';
import {
    Alert,
    Box,
    Center,
    Container,
    Heading,
    VStack,
} from '@chakra-ui/react';
import { UserT } from '../../types';
import { StationNavbar } from '../StationNavbar';
import { DEEP_BLUE, LIGHTER_BLUE, WHITE } from './stationTheme';
import { useOrdersEventSource } from '../../hooks';
import { StationOrderBox } from '../StationOrderBox';

type PropsT = {
    user: UserT;
};

export const StationHome = (props: PropsT) => {
    const { user } = props;
    const {
        connected,
        orders,
        toggleFulfilled,
    } = useOrdersEventSource(user);

    // Add a spinner state for when the user is disconnected.

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
            <Container
                maxW="8xl"
                overflowY="auto"
                maxH="calc(100vh - 58px)"
                paddingTop="16px"
                paddingBottom="36px"
            >
                <Center>
                    <Box>
                        {!connected ? (
                            <Alert status="error">
                                You have been disconnected.
                            </Alert>
                        ) : undefined}
                    </Box>
                </Center>
                <Box>
                    <VStack spacing="16px" width="100%">
                        {orders.map((o) => {
                            return (
                                <StationOrderBox
                                    order={o}
                                    key={`station-order-${o.id}`}
                                    // @ts-ignore - The station will exist at this point.
                                    station={user.station}
                                    toggleFulfilled={toggleFulfilled}
                                />
                            );
                        })}
                    </VStack>
                </Box>
            </Container>
        </Box>
    );
};
