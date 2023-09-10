import React from 'react';
import { Button, FormControl, Input, Td, Tr } from '@chakra-ui/react';
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
        <Tr>
            <Td></Td>
            <Td>
                <FormControl variant="outlined">
                    <Input
                        {...register('name', { required: true })}
                        placeholder="Product Type Name"
                    />
                </FormControl>
            </Td>
            <Td>
                <FormControl variant="outlined">
                    <Input
                        {...register('title', { required: true })}
                        placeholder="Product Type Title"
                    />
                </FormControl>
            </Td>
            <Td>
                <FormControl position="relative" variant="outlined">
                    <Input
                        {...register('color', { required: true })}
                        type="color"
                        padding="5px"
                    />
                </FormControl>
            </Td>
            <Td>
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    // @ts-ignore
                    onClick={handleSubmit(onSubmit)}
                >
                    Save
                </Button>
            </Td>
        </Tr>
    );
};
