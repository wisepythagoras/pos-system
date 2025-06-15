import React from 'react';
import { Box, Center, Heading, VStack } from '@chakra-ui/react';
import { ApiResponse, OrderT, ProductT, RichOrderT, StationT } from '../../types';
import { DEEP_BLUE, LIGHTER_BLUE, WHITE } from '../Home/stationTheme';
import { ProductRow } from './ProductRow';
import { DoneCard } from './styled';

type PropsT = {
    order: OrderT;
    station: StationT;
    toggleFulfilled: (orderId: number, productId: number, val: boolean) => Promise<ApiResponse<null> | undefined>;
};

export const StationOrderBox = (props: PropsT) => {
    const { order, station, toggleFulfilled } = props;
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

    // Nothing to show if there are no products. This means that it's probably an order
    // for a different station.
    if (products.length === 0) {
        return <></>;
    }

    return (
        <Box
            bgColor={LIGHTER_BLUE}
            padding="15px"
            borderRadius="10px"
            width="100%"
            position="relative"
        >
            <Heading size="md" textTransform="uppercase" color={DEEP_BLUE}>
                Order number #{order.id}
            </Heading>
            <Box marginTop="10px">
                <VStack spaceX="10px">
                    {products.map((p) => {
                        return (
                            <ProductRow
                                key={`${order.id}_p_${p.id}`}
                                product={p}
                                amount={amountsPerProduct[p.id]}
                                onToggle={async (val) => {
                                    // This will toggle the value and then the hook should automatically
                                    // fetch the orders again.
                                    await toggleFulfilled(order.id, p.id, val);
                                }}
                            />
                        );
                    })}
                </VStack>
                <Heading size="sm" color={DEEP_BLUE} paddingTop="10px">
                    Showing {products.length} of {order.products.length} products.
                </Heading>
            </Box>
            {products.length && products.every((p) => p.fulfilled) ? (
                <DoneCard>
                    <Center>
                        <h2 className="notice">
                            Done!
                        </h2>
                    </Center>
                </DoneCard>
            ) : undefined}
        </Box>
    );
};
