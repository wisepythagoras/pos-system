import React, { useState } from 'react';
import {
    Button,
    Center,
    Checkbox,
    FormControl,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Td,
    Tr,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { ProductT, ProductTypeT } from '../../../app/types';

type PropsT = {
    product: ProductT;
    onSave: (newProduct: ProductT) => void;
};

/**
 * Render the RichProduct card.
 * @param props The props.
 */
export const RichProduct = (props: PropsT) => {
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
        <Tr>
            <Td>{product.id}</Td>
            <Td>
                <FormControl variant="outlined">
                    <Input
                        value={product.name}
                        onChange={(e) => {
                            setProduct({
                                ...product,
                                name: e.target.value,
                            });
                        }}
                        borderColor="gray.300"
                        placeholder="Product name"
                    />
                </FormControl>
            </Td>
            <Td>
                <FormControl variant="outlined" size="small">
                    <Select
                        value={product.type}
                        onChange={(e) => {
                            setProduct({
                                ...product,
                                type: e.target.value as ProductTypeT,
                            });
                        }}
                        placeholder="-Select-"
                    >
                        <option value="food">Food</option>
                        <option value="drink">Drink</option>
                        <option value="pastry">Pastry</option>
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
                        />
                    </InputGroup>
                </FormControl>
            </Td>
            <Td>
                <Center>
                    <Checkbox
                        checked={product.sold_out}
                        onChange={() => {
                            setProduct({
                                ...product,
                                sold_out: !product.sold_out,
                            });
                        }}
                        size="lg"
                        defaultChecked={product.sold_out}
                    />
                </Center>
            </Td>
            <Td>
                <Center>
                    <Checkbox
                        checked={product.discontinued}
                        onChange={() => {
                            setProduct({
                                ...product,
                                discontinued: !product.discontinued,
                            });
                        }}
                        size="lg"
                        defaultChecked={product.discontinued}
                    />
                </Center>
            </Td>
            <Td>
                <Button
                    leftIcon={<CheckIcon />}
                    colorScheme="blue"
                    disabled={(() => {
                        return (
                            (product.type === props.product.type &&
                            product.sold_out === props.product.sold_out &&
                            product.discontinued === props.product.discontinued &&
                            product.name === props.product.name) ||
                            !product.type ||
                            !product.name ||
                            !product.price ||
                            product.price < 0
                        )
                    })()}
                    onClick={onSave}
                >
                    Save
                </Button>
            </Td>
        </Tr>
    );
};
