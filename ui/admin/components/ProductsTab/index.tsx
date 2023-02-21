import React from 'react';
import {
    Box,
    Center,
    Container,
    Heading,
    Spinner,
    Table,
    TableContainer,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { RichProduct } from '../RichProduct';
import { CreateRichProduct } from '../RichProduct/Create';
import { ProductT, ProductTypeT } from '../../../app/types';
import { useIsCompactView } from '../../hooks';

type PropsT = {
    fetchProducts: () => Promise<ProductT[] | null>;
    products: ProductT[];
    loadingProducts: boolean;
    loadingProductsError: string | null;
    productTypes: ProductTypeT[];
};

/**
 * This is the component that handles the product create page.
 * @example
 * const {
 *      loading: loadingProducts,
 *      error: loadingProductsError,
 *      products,
 *      fetchProducts,
 *  } = useGetProductsList();
 *
 * <ProductsTab
 *      loadingProducts={loadingProducts}
 *      loadingProductsError={loadingProductsError}
 *      products={products}
 *      fetchProducts={fetchProducts}
 *  />
 * @param props
 * @returns
 */
export const ProductsTab = (props: PropsT) => {
    const {
        loadingProducts,
        loadingProductsError,
        products,
        productTypes,
        fetchProducts,
    } = props;
    const isCompactView = useIsCompactView();

    return (
        <Tabs isManual variant='enclosed'>
            <TabList>
                <Tab>Products</Tab>
                <Tab>Product Types</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Container
                        maxWidth="170ch"
                        overflowX="auto"
                        paddingInlineStart={isCompactView ? 0 : undefined}
                        paddingInlineEnd={isCompactView ? 0 : undefined}
                    >
                        <div>
                            {!!loadingProductsError ? (
                                <Heading variant="h4" as="h4">
                                    {loadingProductsError}
                                </Heading>
                            ) : null}

                            {loadingProducts && products.length === 0 ? (
                                <Center>
                                    <Spinner size="lg" color='#1a90ff' />
                                </Center>
                            ) : (
                                <Box>
                                    <TableContainer>
                                        <Table>
                                            <Thead>
                                                <Tr>
                                                    <Th>#</Th>
                                                    <Th>Name</Th>
                                                    <Th>Type</Th>
                                                    <Th>Price</Th>
                                                    <Th>Sold Out</Th>
                                                    <Th>Dicontinued</Th>
                                                    <Th></Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                <CreateRichProduct
                                                    onSave={(_) => fetchProducts()}
                                                    productTypes={productTypes}
                                                />
                                                {products.map((product, i) => {
                                                    return (
                                                        <RichProduct
                                                            key={i}
                                                            product={product}
                                                            productTypes={productTypes}
                                                            onSave={(_) => fetchProducts()}
                                                        />
                                                    );
                                                })}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}
                        </div>
                        <br />
                    </Container>
                </TabPanel>
                <TabPanel>
                    <p>two!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
