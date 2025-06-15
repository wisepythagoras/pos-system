import React from 'react';
import {
    Badge,
    Box,
    Heading,
} from '@chakra-ui/react';
import { ProductT, ProductTypeOldT } from '../../types';

export interface IProductProps {
    product: ProductT;
    type: ProductTypeOldT;
    isSoldOut?: boolean;
    className?: string | undefined;
    onClick?: () => void;
}

/**
 * Renders the product card.
 * @param props The card props.
 */
export const ProductCard = (props: IProductProps) => {
    const { product, type } = props;

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            height="calc(100% - 40px)"
            flexDirection="column"
            borderWidth="1px"
            borderRadius="md"
            borderColor="rgba(0, 0, 0, 0.15)"
            backgroundColor={product.product_type.color}
            overflow="hidden"
            padding="15px"
            onClick={props.onClick}
            className={`${!product.product_type.color ? 'no-color' : undefined} ${props.className}`}
        >
            <Box>
                <Heading
                    as="h3"
                    size="xl"
                    color="white"
                >
                    {product.name}
                </Heading>
            </Box>
            <Box flex={0} ml="auto">
                <Badge
                    ml="1"
                    borderRadius="md"
                    colorScheme="gray"
                    size="lg"
                    fontSize="1.1em"
                    height="35px"
                    pt="5px"
                >
                    ${product.price.toFixed(2)}
                </Badge>
           </Box>
        </Box>
    )
};
