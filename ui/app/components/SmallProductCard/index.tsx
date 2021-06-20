import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography } from '@material-ui/core';
import { ProductT } from '../../types';

const GridContents = styled.div`
    display: grid;
    grid-template-columns: auto 75px;

    & > div:last-child {
        text-align: right;
    }
`;

export interface ISmallProductCardProps {
    product: ProductT;
};

/**
 * Renders an inline small product card.
 * @param props The props.
 */
export const SmallProductCard = (props: ISmallProductCardProps) => {
    const { product } = props;

    return (
        <Card variant="outlined">
            <CardContent>
                <GridContents>
                    <div>
                        <Typography variant="h5" component="h2">
                            {product.name}
                        </Typography>
                    </div>
                    <div>
                        <Typography color="textSecondary" component="h3">
                            ${product.price.toFixed(2)}
                        </Typography>
                    </div>
                </GridContents>
            </CardContent>
        </Card>
    );
};
