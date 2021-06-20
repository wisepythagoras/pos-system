import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { ProductT } from '../../types';

export interface IProductProps {
    product: ProductT;
}

/**
 * Renders the product card.
 * @param props The card props.
 */
export const ProductCard = (props: IProductProps) => {
    const { product } = props;

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {product.name}
                </Typography>
                <Typography color="textSecondary" component="h3" gutterBottom>
                    ${product.price}
                </Typography>
            </CardContent>
        </Card>
    )
};
