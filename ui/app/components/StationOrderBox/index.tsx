import React from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react';
import { OrderT, ProductT, StationT } from '../../types';
import { DEEP_BLUE, LIGHTER_BLUE, WHITE } from '../Home/stationTheme';
import { ProductRow } from './ProductRow';

type PropsT = {
    order: OrderT;
    station: StationT;
};

export const StationOrderBox = (props: PropsT) => {
    const { order, station } = props;
    const products: ProductT[] = [];
    const amountsPerProduct: Record<number, number> = {};

    order.products.forEach((p) => {
        if (!!station.products.find((sp) => sp.id === p.id)) {
            if (!amountsPerProduct[p.id]) {
                amountsPerProduct[p.id] = 0;
                products.push(p);
            }
    
            amountsPerProduct[p.id]++;
        }
    });

    return (
        <Box
            bgColor={LIGHTER_BLUE}
            padding="15px"
            borderRadius="10px"
            width="100%"
        >
            <Heading size="md" textTransform="uppercase" color={DEEP_BLUE}>
                Order number #{order.id}
            </Heading>
            <Box marginTop="10px">
                <VStack spacing="10px">
                    {products.map((p) => {
                        return (
                            <ProductRow
                                key={`${order.id}_p_${p.id}`}
                                product={p}
                                amount={amountsPerProduct[p.id]}
                            />
                        );
                    })}
                </VStack>
            </Box>
        </Box>
    );
};
