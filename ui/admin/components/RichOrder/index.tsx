import React, { useState } from 'react';
import styled from 'styled-components';
import { Chip, TableCell, TableRow } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
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
        <TableRow>
            <TableCell>{order.order_id}</TableCell>
            <TableCell>
                <OrderProducts products={order.order.products} />
            </TableCell>
            <TableCell>
                {order.order.cancelled ? (
                    <Chip
                        icon={<CheckCircleIcon />}
                        label="Reactivate"
                        onClick={onToggle}
                    />
                ) : (
                    <Chip
                        icon={<CancelIcon />}
                        label="Cancel"
                        color="secondary"
                        onClick={onToggle}
                    />
                )}
            </TableCell>
            <TableCell>
                ${order.total.toFixed(2)}
            </TableCell>
            <TableCell>
                {dayjs(order.order.created_at).format('HH:mm MM-DD-YYYY')}
            </TableCell>
        </TableRow>
    );
};
