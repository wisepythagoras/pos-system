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
            className={!product.product_type.color ? 'no-color' : undefined}
        >
            <Heading
                as="h3"
                size="md"
                color="white"
            >
                {product.name}
            </Heading>
            <Box>
                <Badge
                    ml="1"
                    fontSize="1.0em"
                    borderRadius="md"
                    colorScheme="gray"
                >
                    ${product.price.toFixed(2)}
                </Badge>
           </Box>
        </Box>
    )
};
