import React, { useState } from 'react';
import { Box, Button, Center, Table } from '@chakra-ui/react';
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
        <Table.Row>
            <Table.Cell>{order.order_id}</Table.Cell>
            <Table.Cell>
                <OrderProducts products={order.order.products} />
            </Table.Cell>
            <Table.Cell>
                <Center>
                    {order.order.cancelled ? (
                        <Button
                            colorPalette="gray"
                            onClick={onToggle}
                            variant="solid"
                            size="sm"
                        >
                            <CheckCircleIcon /> <Box paddingTop="4px">Reactivate</Box>
                        </Button>
                    ) : (
                        <Button
                            colorPalette="red"
                            onClick={onToggle}
                            variant="solid"
                            size="sm"
                        >
                            <DeleteIcon /> <Box paddingTop="4px">Cancel</Box>
                        </Button>
                    )}
                </Center>
            </Table.Cell>
            <Table.Cell>
                <Box color="green.600" fontWeight={700}>
                    ${order.total.toFixed(2)}
                </Box>
            </Table.Cell>
            <Table.Cell>
                <span title={dayjs(order.order.created_at).format('HH:mm MM-DD-YYYY')}>
                    {dayjs(order.order.created_at).format('HH:mm dd, M D YYYY')}
                </span>
            </Table.Cell>
        </Table.Row>
    );
};
