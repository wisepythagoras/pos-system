import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProductT, ProductTypeT } from '../../../app/types';
import {
    Button,
    FormControl,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Td,
    Tr,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

type ShortProductT = Omit<ProductT, 'id' | 'sold_out' | 'discontinued'>;

export type PropsT = {
    productTypes: ProductTypeT[];
    onSave: (response: any) => void;
};

export const CreateRichProduct = (props: PropsT) => {
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

        reset();
    };

    return (
        <Tr>
            <Td></Td>
            <Td>
                <FormControl variant="outlined">
                    <Input
                        {...register('name', { required: true })}
                        placeholder="Product Name"
                    />
                </FormControl>
            </Td>
            <Td>
                <FormControl variant="outlined" size="small">
                    <Select
                        {...register('type', { required: true })}
                        defaultValue="food"
                    >
                        {props.productTypes.map((pt) => {
                            return (
                                <option value={pt.id} key={pt.id}>
                                    {pt.title}
                                </option>
                            );
                        })}
                    </Select>
                </FormControl>
            </Td>
            <Td>
                <FormControl variant="outlined">
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            color="gray.200"
                            fontSize="1.2em"
                            children="$"
                        />
                        <Input
                            {...register('price', { required: true })}
                            placeholder="0.00"
                        />
                    </InputGroup>
                </FormControl>
            </Td>
            <Td></Td>
            <Td></Td>
            <Td>
                <Button
                    colorScheme="blue"
                    // @ts-ignore
                    onClick={handleSubmit(onSubmit)}
                >
                    <AddIcon /> Save
                </Button>
            </Td>
        </Tr>
    );
};
