import React from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { ProductT } from '../../types';
import { DEEP_BLUE, WHITE } from '../Home/stationTheme';

type PropsT = {
    amount: number;
    product: ProductT;
};

export const ProductRow = (props: PropsT) => {
    const { amount, product } = props;

    return (
        <Box
            border="1px"
            borderColor={DEEP_BLUE}
            bgColor={WHITE}
            padding="8px 10px"
            width="100%"
            borderRadius="10px"
        >
            <HStack>
                <Box>&times;{amount}</Box>
                <Box>{product.name}</Box>
                <Box></Box>
            </HStack>
        </Box>
    );
};
