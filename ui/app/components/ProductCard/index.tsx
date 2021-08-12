import React from 'react';
import {
    Card,
    CardContent,
    Chip,
    Typography,
} from '@material-ui/core';
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
    const cartStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 'calc(100% - 40px)',
    };

    return (
        <Card>
            <CardContent style={cartStyles}>
                <Typography variant="h5" component="h2">
                    {product.name}
                </Typography>
                <Typography color="textSecondary" component="h3" gutterBottom>
                    <Chip
                        variant="outlined"
                        size="medium"
                        label={`$${product.price.toFixed(2)}`}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.15)',
                        }}
                    />
                </Typography>
            </CardContent>
        </Card>
    )
};
