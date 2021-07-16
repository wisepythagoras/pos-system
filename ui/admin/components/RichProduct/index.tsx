import React, { useState } from 'react';
import {
    Chip,
    FormControl,
    Input,
    InputAdornment,
    MenuItem,
    Select,
    Switch,
    TableCell,
    TableRow,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { ProductT, ProductTypeT } from '../../../app/types';

export interface IRichProductProps {
    product: ProductT;
    onSave: (newProduct: ProductT) => void;
};

/**
 * Render the RichProduct card.
 * @param props The props.
 */
export const RichProduct = (props: IRichProductProps) => {
    const [product, setProduct] = useState<ProductT>(props.product);

    const onSave = async () => {
        // This could probably be in the same endpoint, but meh.
        if (product.discontinued !== props.product.discontinued) {
            await fetch(`/api/product/${product.id}`, { method: 'DELETE' });
        }

        // Call the save endpoint.
        await fetch(`/api/product/${product.id}`, {
            method: 'PUT',
            body: new URLSearchParams(product as unknown as Record<string, string>),
        });

        props.onSave(product);
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
                <Switch
                    checked={product.sold_out}
                    onChange={() => {
                        setProduct({
                            ...product,
                            sold_out: !product.sold_out,
                        });
                    }}
                />
            </TableCell>
            <TableCell>
                <Switch
                    checked={product.discontinued}
                    onChange={() => {
                        setProduct({
                            ...product,
                            discontinued: !product.discontinued,
                        });
                    }}
                />
            </TableCell>
            <TableCell>
                <Chip
                    icon={<SaveIcon />}
                    label="Save"
                    disabled={(() => {
                        return (
                            product.type === props.product.type &&
                            product.sold_out === props.product.sold_out &&
                            product.discontinued === props.product.discontinued
                        )
                    })()}
                    onClick={onSave}
                />
            </TableCell>
        </TableRow>
    );
};
