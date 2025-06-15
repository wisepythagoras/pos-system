import React from 'react';
import { css } from 'styled-components';
import { HStack, Tag } from '@chakra-ui/react';
import { ProductT, ProductTypeT } from '../../../app/types';

export type PropsT = {
    products: ProductT[];
    productTypes: ProductTypeT[];
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
        const productType = props.productTypes.find((pt) => pt.name === product.type);

        productPills.push(
            <Tag.Root
                key={i}
                size="md"
                variant="solid"
                // colorPalette={colorPalette}
                backgroundColor={productType?.color ?? '#222'}
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
