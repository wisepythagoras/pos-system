import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProductT, ProductTypeT } from '../../../app/types';
import {
    Button,
    Field,
    Input,
    InputGroup,
    NativeSelect,
    Table,
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
        <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell>
                <Field.Root variant="outlined">
                    <Input
                        {...register('name', { required: true })}
                        placeholder="Product Name"
                    />
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <Field.Root variant="outlined" size="small">
                    <NativeSelect.Root
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
                    </NativeSelect.Root>
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <Field.Root variant="outlined">
                    <InputGroup startElement="$" endElement="USD">
                        <Input
                            {...register('price', { required: true })}
                            placeholder="0.00"
                        />
                    </InputGroup>
                </Field.Root>
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell>
                <Button
                    colorScheme="blue"
                    // @ts-ignore
                    onClick={handleSubmit(onSubmit)}
                >
                    <AddIcon /> Save
                </Button>
            </Table.Cell>
        </Table.Row>
    );
};
