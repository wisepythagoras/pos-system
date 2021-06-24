import React from 'react';
import styled from 'styled-components';
import { Card, CardContent } from '@material-ui/core';
import dayjs from 'dayjs';
import { OrderProducts } from './OrderProducts';
import { RichOrderT } from '../../../app/types';

const GridContents = styled.div`
    display: grid;
    grid-template-columns: 75px auto 75px 150px;

    & > div:first-child,
    & > div:last-child {
        text-align: center;
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
    const { order } = props;

    return (
        <Card>
            <CardContent>
                <GridContents>
                    <div>{order.order_id}</div>
                    <div>
                        <OrderProducts products={order.order.products} />
                    </div>
                    <div>${order.total}</div>
                    <div>
                        {dayjs(order.order.created_at).format('HH:mm MM-DD-YYYY')}
                    </div>
                </GridContents>
            </CardContent>
        </Card>
    );
};
