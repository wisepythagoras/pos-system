import React from 'react';
import { Box, Checkbox, HStack, useBoolean } from '@chakra-ui/react';
import { ProductT } from '../../types';
import { DEEP_BLUE, WHITE } from '../Home/stationTheme';

type PropsT = {
    amount: number;
    product: ProductT;
};

export const ProductRow = (props: PropsT) => {
    const { amount, product } = props;
    const [checked, setChecked] = useBoolean(product.fulfilled || false);

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
                <Box width="100%">{product.name}</Box>
                <Box>
                    <Checkbox
                        colorScheme="green"
                        size="lg"
                        checked={checked}
                        defaultChecked={product.fulfilled}
                        onChange={(e) => {
                            setChecked.toggle();
                        }}
                    />
                </Box>
            </HStack>
        </Box>
    );
};
