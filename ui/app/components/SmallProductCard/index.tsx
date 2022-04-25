import React from 'react';
import styled from 'styled-components';
import { Box, Heading } from '@chakra-ui/react';
import { ProductT } from '../../types';

const GridContents = styled.div`
    display: grid;
    grid-template-columns: auto 75px;

    & > div:last-child {
        text-align: right;
    }
`;

export interface ISmallProductCardProps {
    product: ProductT;
    amount: number;
};

/**
 * Renders an inline small product card.
 * @param props The props.
 */
export const SmallProductCard = (props: ISmallProductCardProps) => {
    const { product, amount } = props;

    return (
        <Box
            borderWidth="1px"
            overflow="hidden"
            padding={5}
            borderRadius={5}
            backgroundColor="rgba(255, 255, 255, 0.1)"
        >
            <Box>
                <GridContents>
                    <div>
                        <Heading as="h6" size="md">
                            <Heading color="gray.200" as="span" size="md">
                                {amount}&times;
                            </Heading>
                            {product.name}
                        </Heading>
                    </div>
                    <div>
                        <Heading color="gray.200" as="h6" size="md">
                            ${product.price.toFixed(2)}
                        </Heading>
                    </div>
                </GridContents>
            </Box>
        </Box>
    );
};
