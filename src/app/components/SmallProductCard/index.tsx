import React from 'react';
import styled from 'styled-components';
import { Box, Center, CloseButton, Heading, IconButton } from '@chakra-ui/react';
import { ProductT } from '../../types';
import { CountPill } from './CountPill';
import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from '@chakra-ui/icons';

const GridContents = styled.div`
    display: grid;
    grid-template-columns: auto 75px 25px;

    & > div:first-child {
        & > .count-control {
            display: flex;
            flex-direction: row;
            align-items: center;

            & > .count-actions {
                & > button {
                    height: var(--chakra-sizes-7);
                    min-width: var(--chakra-sizes-7);
                }
            }
        }
    }

    & > div:last-child {
        text-align: right;
    }
`;

type PropsT = {
    product: ProductT;
    amount: number;
    onAddProduct: (product: ProductT) => void;
    onDecrease: () => void;
    onRemove: () => void;
};

/**
 * Renders an inline small product card.
 * @param props The props.
 */
export const SmallProductCard = (props: PropsT) => {
    const {
        product,
        amount,
        onAddProduct,
        onDecrease,
        onRemove,
    } = props;

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
                    <Box display="flex" alignItems="center">
                        <Box
                            className="count-control"
                            display="inline-block"
                            marginRight="10px"
                        >
                            <Box
                                className="count-actions"
                                display="flex"
                                flexDirection="column"
                            >
                                <IconButton
                                    variant='ghost'
                                    aria-label='Add item'
                                    isRound={true}
                                    icon={<ChevronUpIcon />}
                                    onClick={() => onAddProduct(product)}
                                />
                                <IconButton
                                    variant='ghost'
                                    aria-label='Remove item'
                                    isRound={true}
                                    icon={<ChevronDownIcon />}
                                    onClick={onDecrease}
                                />
                            </Box>
                            <CountPill count={amount} />
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
                    <Box display="flex" alignItems="center">
                        <CloseButton
                            size='md'
                            rounded="full"
                            onClick={onRemove}
                        />
                    </Box>
                </GridContents>
            </Box>
        </Box>
    );
};
