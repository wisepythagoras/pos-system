import React, { useState } from 'react';
import { Box, Button, Center, Td, Tr } from '@chakra-ui/react';
import { CheckCircleIcon, DeleteIcon } from '@chakra-ui/icons';
import dayjs from 'dayjs';
import { OrderProducts } from './OrderProducts';
import { RichOrderT } from '../../../app/types';

export interface IRichOrderProps {
    order: RichOrderT;
};

/**
 * Render the RichOrder card.
 * @param props The props.
 */
export const RichOrder = (props: IRichOrderProps) => {
    const [order, setOrder] = useState<RichOrderT>(props.order);

    const onToggle = async () => {
        await fetch(`/api/order/${order.order_id}`, { method: 'DELETE' });
        const newOrder = { ...order };
        newOrder.order.cancelled = !newOrder.order.cancelled;
        setOrder(newOrder);
    };

    return (
        <Tr>
            <Td>{order.order_id}</Td>
            <Td>
                <OrderProducts products={order.order.products} />
            </Td>
            <Td>
                <Center>
                    {order.order.cancelled ? (
                        <Button
                            colorScheme="gray"
                            onClick={onToggle}
                            variant="solid"
                            size="sm"
                        >
                            <CheckCircleIcon /> <Box paddingTop="4px">Reactivate</Box>
                        </Button>
                    ) : (
                        <Button
                            colorScheme="red"
                            onClick={onToggle}
                            variant="solid"
                            size="sm"
                        >
                            <DeleteIcon /> <Box paddingTop="4px">Cancel</Box>
                        </Button>
                    )}
                </Center>
            </Td>
            <Td>
                <Box color="green.600" fontWeight={700}>
                    ${order.total.toFixed(2)}
                </Box>
            </Td>
            <Td>
                <span title={dayjs(order.order.created_at).format('HH:mm MM-DD-YYYY')}>
                    {dayjs(order.order.created_at).format('HH:mm dd, M D YYYY')}
                </span>
            </Td>
        </Tr>
    );
};
