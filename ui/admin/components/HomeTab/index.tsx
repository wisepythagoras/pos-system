import React, { useEffect, useRef } from 'react';
import {
    Box,
    Center,
    Container,
    Grid,
    GridItem,
    Heading,
    Stack,
} from '@chakra-ui/react';
import { EarningsCard } from '../EarningsCard';
import { useGetOrdersPastYear, useIsCompactView } from '../../hooks';

type PropsT = {
    earnings: number;
    earningsPerDay: number[];
};

export const HomeTab = (props: PropsT) => {
    const {
        earnings,
        earningsPerDay,
    } = props;
    const isCompactView = useIsCompactView();
    const { loading, getHexGraph, getBoxOpaqueGraph } = useGetOrdersPastYear();
    const hexRef = useRef<HTMLDivElement | null>(null);
    const heatRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (loading || !hexRef.current || !heatRef.current) {
            return;
        }

        hexRef.current.innerHTML = '';
        heatRef.current.innerHTML = '';
        hexRef.current.appendChild(getHexGraph());
        heatRef.current.appendChild(getBoxOpaqueGraph());
    }, [loading]);

    return (
        <Container
            maxWidth="170ch"
            overflowX="auto"
            paddingInlineStart={isCompactView ? 0 : undefined}
            paddingInlineEnd={isCompactView ? 0 : undefined}
        >
            <Heading variant="h3" as="h3" marginBottom="10px">
                Total Earnings: ${earnings.toFixed(2)}
            </Heading>
            <Grid
                paddingTop="10px"
                paddingBottom="10px"
                templateColumns="repeat(4, 1fr)"
                gap={5}
                overflowX="auto"
            >
                <GridItem>
                    <EarningsCard
                        day={0}
                        amount={earningsPerDay[0]}
                        prevAmount={earningsPerDay[1]}
                    />
               </GridItem>
                <GridItem>
                    <EarningsCard
                        day={1}
                        amount={earningsPerDay[1]}
                        prevAmount={earningsPerDay[2]}
                    />
                </GridItem>
                <GridItem>
                    <EarningsCard
                        day={2}
                        amount={earningsPerDay[2]}
                        prevAmount={earningsPerDay[3]}
                    />
                </GridItem>
                <GridItem>
                    <EarningsCard
                        day={3}
                        amount={earningsPerDay[3]}
                        prevAmount={earningsPerDay[4]}
                    />
                </GridItem>
            </Grid>
            <Box marginTop="10px">
               <Stack direction={isCompactView ? 'column' : 'row'} spacing={5}>
                    <Box
                        w={isCompactView ? '100%' : '50%'}
                        borderRadius="lg"
                        borderWidth="1px"
                        p="6"
                    >
                        <div ref={hexRef} />
                        <Box>
                            <Center>Sales per hour</Center>
                        </Box>
                    </Box>
                    <Box
                        w={isCompactView ? '100%' : '50%'}
                        borderRadius="lg"
                        borderWidth="1px"
                        p="6"
                    >
                        <div ref={heatRef} />
                        <Box>
                            <Center>Orders per hour</Center>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Container>
    );
};
