import React, { useState } from 'react';
import {
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TableCell,
    TableRow,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import dayjs from 'dayjs';
import { ProductT, ProductTypeT } from '../../../app/types';

export interface IRichProductProps {
    product: ProductT;
};

/**
 * Render the RichProduct card.
 * @param props The props.
 */
export const RichProduct = (props: IRichProductProps) => {
    const [product, setProduct] = useState<ProductT>(props.product);

    const onToggle = async () => {
        // await fetch(`/api/order/${order.order_id}`, { method: 'DELETE' });
        // const newOrder = { ...order };
        // newOrder.order.cancelled = !newOrder.order.cancelled;
        // setOrder(newOrder);
    };

    return (
        <TableRow>
            <TableCell>{product.id}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>
                <FormControl variant="outlined">
                    <Select
                        value={product.type}
                        onChange={(e) => {
                            setProduct({
                                ...product,
                                type: e.target.value as ProductTypeT,
                            });
                        }}
                    >
                        <MenuItem>-Select-</MenuItem>
                        <MenuItem value="food">Food</MenuItem>
                        <MenuItem value="drink">Drink</MenuItem>
                        <MenuItem value="pastry">Pastry</MenuItem>
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell>
                <FormControl variant="outlined">
                    <Input
                        value={product.price.toFixed(2)}
                        onChange={(e) => {
                            const priceString = e.target.value.replace(/\.{2,}/, '.');
                            const price = parseFloat(priceString);

                            if (!price) {
                                return;
                            }

                            setProduct({
                                ...product,
                                price,
                            });
                        }}
                        startAdornment={(
                            <InputAdornment position="start">$</InputAdornment>
                        )}
                    />
                </FormControl>
            </TableCell>
            <TableCell>
                test
            </TableCell>
        </TableRow>
    );
};
