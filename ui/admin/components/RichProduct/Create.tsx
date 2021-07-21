import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Chip,
    FormControl,
    Input,
    InputAdornment,
    MenuItem,
    Select,
    TableCell,
    TableRow,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { ProductT } from '../../../app/types';

type ShortProductT = Omit<ProductT, 'id' | 'sold_out' | 'discontinued'>;

export interface ICreateRichProductProps {
    onSave: (response: any) => void;
};

export const CreateRichProduct = (props: ICreateRichProductProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    /**
     * Handle the creation of a new product on submit.
     * @param data The form data.
     */
    const onSubmit = async (data: ShortProductT) => {
        if (!data.name || !data.price || !data.type) {
            return;
        }

        console.log(data);
        
        const body = new FormData();

        for (let field in data) {
            body.append(field, data[field as keyof ShortProductT] as string);
        }

        const req = await fetch('/api/product', {
            method: 'POST',
            body,
        });
        const resp = await req.json();

        props.onSave(resp);

        console.log(resp);

        // reset({
        //     deepNest: {
        //         name: "",
        //         price: 0,
        //         type: "food",
        //     },
        // });
        reset();
    };

    return (
        <TableRow>
            <TableCell></TableCell>
            <TableCell>
                <FormControl variant="outlined">
                    <Input
                        {...register('name', { required: true })}
                        placeholder="Product Name"
                    />
                </FormControl>
            </TableCell>
            <TableCell>
                <FormControl variant="outlined">
                    <Select
                        {...register('type', { required: true })}
                        defaultValue="food"
                    >
                        <MenuItem value="food">Food</MenuItem>
                        <MenuItem value="drink">Drink</MenuItem>
                        <MenuItem value="pastry">Pastry</MenuItem>
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell>
                <FormControl variant="outlined">
                    <Input
                        {...register('price', { required: true })}
                        placeholder="0.00"
                        startAdornment={(
                            <InputAdornment position="start">$</InputAdornment>
                        )}
                    />
                </FormControl>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
                <Chip
                    icon={<AddIcon />}
                    label="Create"
                    onClick={handleSubmit(onSubmit)}
                />
            </TableCell>
        </TableRow>
    );
};
