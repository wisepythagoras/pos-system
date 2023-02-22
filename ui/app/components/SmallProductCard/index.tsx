import React from 'react';
import styled from 'styled-components';
import { Avatar, Box, Center, Heading } from '@chakra-ui/react';
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
            borderWidth="0"
            overflow="hidden"
            padding={5}
            borderRadius={5}
            backgroundColor="#222836"
        >
            <Box>
                <GridContents>
                    <div>
                        <Heading as="h6" size="md" color="gray.200">
                            <Box display="inline-block" marginRight="10px">
                                <Avatar
                                    size='sm'
                                    name={amount.toString()}
                                    backgroundColor="#2b3141"
                                />
                            </Box>
                            <Box verticalAlign="sub" display="inline-block">
                                {product.name}
                            </Box>
                        </Heading>
                    </div>
                    <div>
                        <Center height="100%">
                            <Heading color="rgb(60, 70, 96)" as="h6" size="md" fontWeight="100">
                                ${(product.price * amount).toFixed(2)}
                            </Heading>
                        </Center>
                    </div>
                </GridContents>
            </Box>
        </Box>
    );
};
