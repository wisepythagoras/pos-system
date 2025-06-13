import React, { useState } from 'react';
import { Box, Checkbox, HStack, Spinner } from '@chakra-ui/react';
import { ProductT } from '../../types';
import { DEEP_BLUE, WHITE } from '../Home/stationTheme';

type PropsT = {
    amount: number;
    product: ProductT;
    onToggle: (val: boolean) => Promise<void>;
};

export const ProductRow = (props: PropsT) => {
    const { amount, product, onToggle } = props;
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Box
            border="1px"
            borderColor={DEEP_BLUE}
            bgColor={WHITE}
            padding="8px 10px"
            width="100%"
            borderRadius="10px"
        >
            <HStack>
                <Box>&times;{amount}</Box>
                <Box width="100%">{product.name}</Box>
                <Box>
                    <Checkbox.Root
                        colorScheme="green"
                        size="lg"
                        checked={product.fulfilled}
                        defaultChecked={product.fulfilled}
                        onChange={async (e) => {
                            setIsLoading(true);
                            await onToggle(!product.fulfilled);
                            setIsLoading(false);
                        }}
                        display={isLoading ? 'none' : 'visible'}
                    />
                    <Spinner size='sm' display={isLoading ? 'visible' : 'none'} />
                </Box>
            </HStack>
        </Box>
    );
};
