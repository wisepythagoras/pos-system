import React from 'react';
import { css } from 'styled-components';
import { HStack, Tag } from '@chakra-ui/react';
import { ProductT } from '../../../app/types';

export type PropsT = {
    products: ProductT[];
    onRemove: (productId: number) => void;
};

/**
 * Renders the stations's products as pills/badges.
 * @param props The props.
 */
export const StationProducts = (props: PropsT) => {
    const { products, onRemove } = props;
    const productPills: JSX.Element[] = [];
    const specialStyles = css`
        & > span {
            margin-inline-start: 0 !important;
            margin-inline-end: 0.5rem !important;
            margin-bottom: 5px !important;
        }
    `;

    products.forEach((product, i) => {
        let colorSheme;

        switch (product.type) {
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
                    {product.name}
                </Tag.Label>
                <Tag.EndElement>
                    <Tag.CloseTrigger onClick={() => onRemove(product.id)} />
                </Tag.EndElement>
            </Tag.Root>
        );
    });

    return (
        <HStack wrap="wrap" css={specialStyles}>
            {productPills}
        </HStack>
    );
};
