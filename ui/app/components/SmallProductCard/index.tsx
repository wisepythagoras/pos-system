import React, { useRef } from 'react';
import styled from 'styled-components';
import { Avatar, Box, Center, CloseButton, Heading } from '@chakra-ui/react';
import { ProductT } from '../../types';

const GridContents = styled.div`
    display: grid;
    grid-template-columns: auto 75px 25px;

    & > div:last-child {
        text-align: right;
    }
`;

export interface ISmallProductCardProps {
    product: ProductT;
    amount: number;
    onDecrease: () => void;
    onRemove: () => void;
};

/**
 * Renders an inline small product card.
 * @param props The props.
 */
export const SmallProductCard = (props: ISmallProductCardProps) => {
    const { product, amount, onDecrease, onRemove } = props;
    const lock = useRef(false);

    return (
        <Box
            borderWidth="0"
            overflow="hidden"
            padding={5}
            borderRadius={5}
            backgroundColor="#222836"
            onClick={() => {
                if (!lock.current) {
                    onDecrease();
                }

                lock.current = false;
            }}
        >
            <Box>
                <GridContents>
                    <Box display="flex" alignItems="center">
                        <Box display="inline-block" marginRight="10px">
                            <Avatar
                                size='sm'
                                name={amount.toString()}
                                backgroundColor="#2b3141"
                            />
                        </Box>
                        <Box display="inline-flex" height="100%" alignItems="center">
                            <Heading as="h6" size="sm" color="gray.200">
                                {product.name}
                            </Heading>
                        </Box>
                    </Box>
                    <Box>
                        <Center height="100%">
                            <Heading color="rgb(60, 70, 96)" as="h6" size="sm" fontWeight="100">
                                ${(product.price * amount).toFixed(2)}
                            </Heading>
                        </Center>
                    </Box>
                    <Box>
                        <CloseButton
                            size='md'
                            rounded="full"
                            onClick={() => {
                                lock.current = true;
                                onRemove();
                            }}
                        />
                    </Box>
                </GridContents>
            </Box>
        </Box>
    );
};
