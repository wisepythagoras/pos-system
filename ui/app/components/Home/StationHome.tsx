import { Alert, Box, Center, Container, Heading, Stack } from '@chakra-ui/react';
import React from 'react';
import { UserT } from '../../types';
import { DEEP_BLUE, LIGHT_BLUE, WHITE } from './stationTheme';

type PropsT = {
    user: UserT;
};

export const StationHome = (props: PropsT) => {
    const { user } = props;

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
            <Box
                paddingTop="30px"
                paddingBottom="30px"
                bgColor={DEEP_BLUE}
                color={WHITE}
            >
                <Container maxW="8xl">
                    <Stack direction={['column', 'row']} spacing='24px'>
                        <Box w="100%" paddingTop="20px">
                            <Heading size="lg">
                                Tap on each order item to complete it.
                            </Heading>
                        </Box>
                        <Box>
                            <Center>
                                <Box w="79px" h="79px" bgColor={WHITE} borderRadius="3px">
                                    <Heading
                                        size="lg"
                                        cursor="pointer"
                                        color={LIGHT_BLUE}
                                        textTransform="uppercase"
                                        overflowWrap="break-word"
                                        paddingLeft="6px"
                                        paddingTop="2px"
                                        fontWeight="900"
                                    >
                                        See All
                                    </Heading>
                                </Box>
                            </Center>
                        </Box>
                    </Stack>
                </Container>
            </Box>
            <Container maxW="8xl">
                <Center background="aliceblue">
                    <Alert status="info" maxW="400px">
                        You are assigned to the station "{user.station.name}".
                    </Alert>
                </Center>
            </Container>
        </Box>
    );
};
