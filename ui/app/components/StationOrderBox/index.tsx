import { Box, Heading } from '@chakra-ui/react';
import React from 'react';
import { OrderT } from '../../types';
import { DEEP_BLUE, LIGHTER_BLUE, WHITE } from '../Home/stationTheme';

type PropsT = {
    order: OrderT;
};

export const StationOrderBox = (props: PropsT) => {
    const { order } = props;

    return (
        <Box
            border="1px"
            bgColor={LIGHTER_BLUE}
            padding="8px 10px"
            borderRadius="10px"
            width="100%"
        >
            <Heading size="md" textTransform="uppercase" color={DEEP_BLUE}>
                Order number #{order.id}
            </Heading>
            <Box>
                {order.products.length} products
            </Box>
        </Box>
    );
};
