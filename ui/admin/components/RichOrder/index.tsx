import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardContent, Chip } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import dayjs from 'dayjs';
import { OrderProducts } from './OrderProducts';
import { RichOrderT } from '../../../app/types';

const GridContents = styled.div`
    display: grid;
    grid-template-columns: 75px auto 125px 75px 150px;

    & > div:first-child,
    & > div:nth-child(4),
    & > div:last-child {
        text-align: center;
    }

    & > div:nth-child(4) {
        text-decoration: underline;
        font-weight: 900;
    }
`;

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
        <Card>
            <CardContent>
                <GridContents>
                    <div>{order.order_id}</div>
                    <div>
                        <OrderProducts products={order.order.products} />
                    </div>
                    <div>
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
                    </div>
                    <div>${order.total.toFixed(2)}</div>
                    <div>
                        {dayjs(order.order.created_at).format('HH:mm MM-DD-YYYY')}
                    </div>
                </GridContents>
            </CardContent>
        </Card>
    );
};
