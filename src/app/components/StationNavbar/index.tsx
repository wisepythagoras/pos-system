import React from 'react';
import {
    Box,
    Center,
    Container,
    Heading,
    Stack,
} from '@chakra-ui/react';
import { DEEP_BLUE, LIGHT_BLUE, WHITE } from '../Home/stationTheme';

type PropsT = {};

/**
 * Shows the navbar for the station view.
 * @param props
 * @returns 
 */
export const StationNavbar = (props: PropsT) => {
    return (
        <Box
            paddingTop="10px"
            paddingBottom="10px"
            bgColor={DEEP_BLUE}
            color={WHITE}
        >
            <Container maxW="8xl">
                <Stack direction={['column', 'row']} spaceY='24px'>
                    <Box w="100%">
                        <Heading size="lg">
                            Tap on each order item to complete it.
                        </Heading>
                    </Box>
                    <Box>
                        {/* <Center>
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
                        </Center> */}
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};
