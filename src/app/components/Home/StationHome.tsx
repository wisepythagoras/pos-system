import React, { useEffect, useRef } from 'react';
import {
    Alert,
    Box,
    Center,
    Container,
    Input,
    InputGroup,
    VStack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { UserT } from '../../types';
import { StationNavbar } from '../StationNavbar';
import { useOrdersEventSource } from '../../hooks';
import { StationOrderBox } from '../StationOrderBox';
import { toaster } from '../../../components/ui/toaster';

type PropsT = {
    user: UserT;
};

export const StationHome = (props: PropsT) => {
    const { user } = props;
    const {
        connected,
        previouslyConnected,
        orders,
        toggleFulfilled,
        onSearchChange,
    } = useOrdersEventSource(user);
    const disconnectedToastIdRef = useRef('');

    useEffect(() => {
        if (!previouslyConnected) {
            return;
        }

        if (!connected && !toaster.isVisible(disconnectedToastIdRef.current)) {
            disconnectedToastIdRef.current = toaster.create({
                title: 'You have been disconnected',
                description: 'Your station has lost connection to the server',
                type: 'error',
                closable: true,
                // duration: 10000,
            });
        }
    }, [previouslyConnected, connected]);

    // Add a spinner state for when the user is disconnected.

    if (!user.station) {
        return (
            <Center>
                <Alert.Root status="warning">
                    <Alert.Content>
                        You are not assigned to any station.
                    </Alert.Content>
                </Alert.Root>
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
                <Box marginBottom="20px">
                    <InputGroup startElement={<SearchIcon color="gray.300" />}>
                        <Input placeholder="Order number" onChange={onSearchChange} />
                    </InputGroup>
                </Box>
                <Box>
                    <VStack spaceY="16px" width="100%">
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
