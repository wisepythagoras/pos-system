import React from 'react';
import {
    Badge,
    Box,
    Heading,
} from '@chakra-ui/react';
import { ProductT, ProductTypeT } from '../../types';

export interface IProductProps {
    product: ProductT;
    type: ProductTypeT;
    isSoldOut?: boolean;
}

/**
 * Renders the product card.
 * @param props The card props.
 */
export const ProductCard = (props: IProductProps) => {
    const { product, type } = props;
    let badgeScheme: 'green' | 'blue' | 'red';

    if (type === 'drink') {
        badgeScheme = 'red';
    } else if (type === 'food') {
        badgeScheme = 'blue';
    } else {
        badgeScheme = 'green';
    }

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            height="calc(100% - 40px)"
            flexDirection="column"
            borderWidth="1px"
            borderRadius="md"
            borderColor="rgba(0, 0, 0, 0.15)"
            overflow="hidden"
            padding="15px"
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
                    colorScheme={badgeScheme}
                >
                    ${product.price.toFixed(2)}
                </Badge>
           </Box>
        </Box>
    )
};
