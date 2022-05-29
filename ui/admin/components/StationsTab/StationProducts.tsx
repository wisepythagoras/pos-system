import React from 'react';
import { Interpolation } from '@emotion/react';
import { css } from 'styled-components';
import { HStack, Tag } from '@chakra-ui/react';
import { ProductT, ProductAggregateT } from '../../../app/types';

export type PropsT = {
    products: ProductT[];
};

/**
 * Renders the stations's products as pills/badges.
 * @param props The props.
 */
export const StationProducts = (props: PropsT) => {
    const { products } = props;
    const productPills: JSX.Element[] = [];
    const specialStyles = css`
        & > span {
            margin-inline-start: 0 !important;
            margin-inline-end: 0.5rem !important;

            @media screen and (max-width: 768px) {
                margin-bottom: 5px !important;
            }
        }
    ` as Interpolation<{}>;

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
            <Tag
                key={i}
                size="md"
                variant="solid"
                colorScheme={colorSheme}
            >
                {product.name}
            </Tag>
        );
    });

    return (
        <HStack wrap="wrap" css={specialStyles}>
            {productPills}
        </HStack>
    );
};
