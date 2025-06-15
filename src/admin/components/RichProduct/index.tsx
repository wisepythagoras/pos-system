import React, { useState } from 'react';
import {
    Button,
    Center,
    Checkbox,
    Field,
    Input,
    InputGroup,
    NativeSelect,
    Table,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { ProductT, ProductTypeOldT, ProductTypeT } from '../../../app/types';

type PropsT = {
    product: ProductT;
    productTypes: ProductTypeT[];
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

        const formData = new FormData();
        formData.set('name', product.name);
        formData.set('price', product.price.toString());
        formData.set('product_type_id', product.product_type.id.toString());
        formData.set('sold_out', product.sold_out.toString());

        // Call the save endpoint.
        await fetch(`/api/product/${product.id}`, {
            method: 'PUT',
            body: formData,
            // body: new URLSearchParams(product as unknown as Record<string, string>),
        });

        props.onSave(product);
    };

    return (
        <Table.Row backgroundColor={product.discontinued ? 'gray.100' : undefined}>
            <Table.Cell>{product.id}</Table.Cell>
            <Table.Cell>
                <Field.Root>
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
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <Field.Root>
                    {/* The lib select is so broken that I was forced to add more code to support what was possible with less code before */}
                    <NativeSelect.Root>
                        <NativeSelect.Field
                            placeholder="Select"
                            value={product.product_type.id}
                            onChange={(e) => {
                                const productTypeId = parseInt(e.target.value);
                                const productType = props.productTypes.find((pt) => pt.id === productTypeId) as ProductTypeT;

                                setProduct({
                                    ...product,
                                    product_type_id: productTypeId,
                                    product_type: productType,
                                });
                            }}
                        >
                            {props.productTypes.map((pt) => {
                                return (
                                    <option value={pt.id} key={pt.id}>
                                        {pt.title}
                                    </option>
                                );
                            })}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <Field.Root>
                    <InputGroup startElement="$" endElement="USD">
                        <Input
                            placeholder="0.00"
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
                </Field.Root>
            </Table.Cell>
            <Table.Cell>
                <Center>
                    <Checkbox.Root
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
            </Table.Cell>
            <Table.Cell>
                <Center>
                    <Checkbox.Root
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
            </Table.Cell>
            <Table.Cell>
                <Button
                    colorScheme="blue"
                    disabled={(() => {
                        return (
                            (product.type === props.product.type &&
                            product.sold_out === props.product.sold_out &&
                            product.discontinued === props.product.discontinued &&
                            product.price === props.product.price &&
                            product.name === props.product.name) ||
                            !product.type ||
                            !product.name ||
                            !product.price ||
                            product.price < 0
                        )
                    })()}
                    onClick={onSave}
                >
                    <CheckIcon /> Save
                </Button>
            </Table.Cell>
        </Table.Row>
    );
};
