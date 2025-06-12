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
    Td,
    useToast,
} from '@chakra-ui/react';
import { RichProduct } from '../RichProduct';
import { CreateRichProduct } from '../RichProduct/Create';
import { ProductT, ProductTypeT } from '../../../app/types';
import { useIsCompactView } from '../../hooks';
import { RichProductType } from '../RichProductType';
import { RichProductTypeCreate } from '../RichProductType/Create';

type PropsT = {
    fetchProducts: () => Promise<ProductT[] | null>;
    products: ProductT[];
    loadingProducts: boolean;
    loadingProductsError: string | null;
    productTypes: ProductTypeT[];
    createProductType: (n: string, t: string, c: string) => Promise<ProductTypeT | undefined>;
    getProductTypes: () => Promise<ProductTypeT[]>;
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
        getProductTypes,
    } = props;
    const isCompactView = useIsCompactView();
    const toast = useToast();

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
                    <Container
                        maxWidth="170ch"
                        overflowX="auto"
                        paddingInlineStart={isCompactView ? 0 : undefined}
                        paddingInlineEnd={isCompactView ? 0 : undefined}
                    >
                        <Box>
                            <TableContainer>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>#</Th>
                                            <Th>Name</Th>
                                            <Th>Title</Th>
                                            <Th>Color</Th>
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <RichProductTypeCreate
                                            onSave={(_) => {
                                                getProductTypes();
                                            }}
                                            onFail={() => {
                                                toast({
                                                    title: 'Error',
                                                    description: `Error: Unable to create product type`,
                                                    status: 'error',
                                                    duration: 5000,
                                                    isClosable: true,
                                                });
                                            }}
                                        />
                                        {productTypes.map((pt, i) => {
                                            return (
                                                <RichProductType
                                                    key={`pt-${i}`}
                                                    productType={pt}
                                                />
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Container>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};
