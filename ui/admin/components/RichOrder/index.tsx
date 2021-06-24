import React from 'react';
import styled from 'styled-components';
import { Card, CardContent } from '@material-ui/core';
import { OrderProducts } from './OrderProducts';
import { RichOrderT } from '../../../app/types';

const GridContents = styled.div`
    display: grid;
    grid-template-columns: 75px auto 75px;

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
                </GridContents>
            </CardContent>
        </Card>
    );
};
