import React from 'react';
import {
    Box,
    Center,
    Container,
    Heading,
    Spinner,
    Table,
    Tabs,
} from '@chakra-ui/react';
import { RichProduct } from '../RichProduct';
import { CreateRichProduct } from '../RichProduct/Create';
import { ProductT, ProductTypeT } from '../../../app/types';
import { useIsCompactView } from '../../hooks';
import { RichProductType } from '../RichProductType';
import { RichProductTypeCreate } from '../RichProductType/Create';
import { toaster } from '../../../components/ui/toaster';

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

    return (
        <Tabs.Root variant='enclosed' defaultValue="products">
            <Tabs.List width="100%">
                <Tabs.Trigger value="products">
                    Products
                </Tabs.Trigger>
                <Tabs.Trigger value="product-types">
                    Product Types
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="products" width="100%">
                <Container
                    maxWidth="170ch"
                    overflowX="auto"
                    paddingInlineStart={isCompactView ? 0 : undefined}
                    paddingInlineEnd={isCompactView ? 0 : undefined}
                >
                    <div>
                        {!!loadingProductsError ? (
                            <Heading size="xl" as="h4">
                                {loadingProductsError}
                            </Heading>
                        ) : null}

                        {loadingProducts && products.length === 0 ? (
                            <Center>
                                <Spinner size="lg" color='#1a90ff' />
                            </Center>
                        ) : (
                            <Box>
                                <Table.Root>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeader>#</Table.ColumnHeader>
                                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                                            <Table.ColumnHeader>Type</Table.ColumnHeader>
                                            <Table.ColumnHeader>Price</Table.ColumnHeader>
                                            <Table.ColumnHeader>Sold Out</Table.ColumnHeader>
                                            <Table.ColumnHeader>Dicontinued</Table.ColumnHeader>
                                            <Table.ColumnHeader></Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
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
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        )}
                    </div>
                    <br />
                </Container>
            </Tabs.Content>
            <Tabs.Content value="product-types" width="100%">
                <Container
                    maxWidth="170ch"
                    overflowX="auto"
                    paddingInlineStart={isCompactView ? 0 : undefined}
                    paddingInlineEnd={isCompactView ? 0 : undefined}
                >
                    <Box>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>#</Table.ColumnHeader>
                                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                                    <Table.ColumnHeader>Title</Table.ColumnHeader>
                                    <Table.ColumnHeader>Color</Table.ColumnHeader>
                                    <Table.ColumnHeader></Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <RichProductTypeCreate
                                    onSave={(_) => {
                                        getProductTypes();
                                    }}
                                    onFail={() => {
                                        toaster.create({
                                            title: 'Error',
                                            description: `Error: Unable to create product type`,
                                            type: 'error',
                                            duration: 5000,
                                            closable: true,
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
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Container>
            </Tabs.Content>
        </Tabs.Root>
    );
};
