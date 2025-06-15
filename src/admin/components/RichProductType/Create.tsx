import React from 'react';
import { Button, Field, Input, Table } from '@chakra-ui/react';
import { ProductTypeT } from '../../../app/types';
import { useForm } from 'react-hook-form';
import { useProductTypes } from '../../hooks';
import { AddIcon } from '@chakra-ui/icons';

type ShortProductTypeT = Omit<ProductTypeT, 'id' | 'created_at'>;

type PropsT = {
    onSave: (resp: ProductTypeT) => void;
    onFail: () => void;
};

export const RichProductTypeCreate = (props: PropsT) => {
    const { onSave, onFail } = props;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const { createProductType } = useProductTypes(false);

    /**
     * Handle the creation of a new product on submit.
     * @param data The form data.
     */
    const onSubmit = async (data: ShortProductTypeT) => {
        if (!data.name || !data.title) {
            return;
        }

        const body = new FormData();

        for (let field in data) {
            body.append(field, data[field as keyof ShortProductTypeT] as string);
        }

        const resp = await createProductType(data.name, data.title, data.color);

        if (!!resp) {
            onSave(resp);
            reset();
        } else {
            onFail();
        }
    };

    return (
        <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell>
                <Field.Root>
                    <Input
                        {...register('name', { required: true })}
                        placeholder="Product Type Name"
                    />
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <Field.Root>
                    <Input
                        {...register('title', { required: true })}
                        placeholder="Product Type Title"
                    />
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <Field.Root position="relative">
                    <Input
                        {...register('color', { required: true })}
                        type="color"
                        padding="5px"
                    />
                </Field.Root>
            </Table.Cell>
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
