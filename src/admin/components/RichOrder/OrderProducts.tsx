import React from 'react';
import { Interpolation } from '@emotion/react';
import { css } from 'styled-components';
import { HStack, Tag } from '@chakra-ui/react';
import { ProductT, ProductAggregateT } from '../../../app/types';

export interface IOrderProductsProps {
    products: ProductT[];
};

/**
 * Renders the orders's products as pills/badges.
 * @param props The props.
 */
export const OrderProducts = (props: IOrderProductsProps) => {
    const { products } = props;
    const aggregateProducts = new Map<number, ProductAggregateT>();
    const productPills: JSX.Element[] = [];
    const specialStyles = css`
        & > span {
            margin-inline-start: 0 !important;
            margin-inline-end: 0.5rem !important;

            @media screen and (max-width: 768px) {
                margin-bottom: 5px !important;
            }
        }
    `;

    for (let i in products) {
        const product = products[i];
        const storedProduct = aggregateProducts.get(product.id);

        if (!storedProduct) {
            aggregateProducts.set(product.id, {
                product,
                amount: 1,
            });
        } else {
            storedProduct.amount += 1;
            aggregateProducts.set(product.id, storedProduct);
        }
    }

    aggregateProducts.forEach((pa, i) => {
        let colorSheme;

        switch (pa.product.type) {
            case 'drink':
                colorSheme = 'orange';
                break;
            case 'food':
                colorSheme = 'teal';
                break;
            case 'drink':
            default:
                colorSheme = 'green';
        }

        productPills.push(
            <Tag.Root
                key={i}
                size="md"
                variant="solid"
                colorScheme={colorSheme}
            >
                <Tag.Label>
                    <b>{pa.amount}</b>&nbsp;{pa.product.name}
                </Tag.Label>
            </Tag.Root>
        );
    });

    return (
        <HStack wrap="wrap" css={specialStyles}>
            {productPills}
        </HStack>
    );
};
