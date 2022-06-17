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
                paddingTop="10px"
                paddingBottom="10px"
                bgColor={DEEP_BLUE}
                color={WHITE}
            >
                <Container maxW="8xl">
                    <Stack direction={['column', 'row']} spacing='24px'>
                        <Box w="100%">
                            <Heading size="lg">
                                Tap on each order item to complete it.
                            </Heading>
                        </Box>
                        <Box>
                            <Center>
                                <Box w="38px" h="38px" bgColor={WHITE} borderRadius="3px">
                                    <Center>
                                        <Heading
                                            size="sm"
                                            cursor="pointer"
                                            color={LIGHT_BLUE}
                                            textTransform="uppercase"
                                            overflowWrap="break-word"
                                            paddingLeft="2px"
                                            fontWeight="900"
                                        >
                                            See All
                                        </Heading>
                                    </Center>
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
