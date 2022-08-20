import React, { useEffect, useRef } from 'react';
import {
    Alert,
    Box,
    Center,
    Container,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    ToastId,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { UserT } from '../../types';
import { StationNavbar } from '../StationNavbar';
import { useOrdersEventSource } from '../../hooks';
import { StationOrderBox } from '../StationOrderBox';
import { SearchIcon } from '@chakra-ui/icons';

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
    const toast = useToast();
    const disconnectedToastIdRef = useRef<ToastId>(0);

    useEffect(() => {
        if (!previouslyConnected) {
            return;
        }

        if (!connected && !toast.isActive(disconnectedToastIdRef.current)) {
            disconnectedToastIdRef.current = toast({
                title: 'You have been disconnected',
                description: 'Your station has lost connection to the server',
                status: 'error',
                isClosable: true,
                // duration: 10000,
            });
        }
    }, [previouslyConnected, connected]);

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
                <Box marginBottom="20px">
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<SearchIcon color="gray.300" />}
                        />
                        <Input placeholder="Order number" onChange={onSearchChange} />
                    </InputGroup>
                </Box>
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
