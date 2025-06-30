import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
    Box,
    Button,
    CloseButton,
    Input,
    InputGroup,
    useDisclosure,
    List,
    Dialog,
    Heading,
    VStack,
} from '@chakra-ui/react';
import { LuSearch } from 'react-icons/lu';
import { CheckCircleIcon, MinusIcon, Search2Icon, SettingsIcon } from '@chakra-ui/icons';
import { ProductT, ProductTypeT } from '../../types';
import { ProductCard } from '../ProductCard';
import { useLocalStorage, useLockBodyScroll } from 'react-use';
import { useGetPrinters } from '../../hooks';
import { PrinterT } from '../../types';

const SearchField = styled.div`
    width: calc(100% - 10px);
    margin: 0 5px 5px 5px;
    position: sticky;
    top: 0;

    & > div {
        width: 100%;

        & .input-buttons {
            & > button:not(:last-child) {
                margin-right: 4px;
            }
        }
    }
`;

const ProductCardList = styled.div`
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    display: grid;

    @media screen and (max-width: 1200px) and (min-width: 1025px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    @media screen and (max-width: 1024px) {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    & > div {
        height: 160px;
        margin: 5px;
        cursor: pointer;
        user-select: none;

        @media screen and (max-width: 1024px) {
            height: 120px;
        }

        // { food: '#325657', drink: '#753f2d', pastry: '#1d441d' }

        & > div {
            height: 100%;

            & h2 {
                word-break: break-word;

                @media screen and (max-width: 1024px) {
                    font-size: 1.3rem;
                }
            }
        }

        & > .no-color {
            background-color: var(--chakra-colors-gray-600);
        }

        &.soldout {
            cursor: auto;
        }

        &.soldout > div {
            opacity: 0.8;

            & > h3 {
                text-decoration: line-through;
            }
        }
    }
`;

export interface IProductListProps {
    products: ProductT[];
    productTypes: ProductTypeT[];
    onClick: (product: ProductT) => void;
    onPrinterChange?: (p: PrinterT | undefined) => void;
};

/**
 * Renders a list of products.
 * @param props The props.
 */
export const ProductList = (props: IProductListProps) => {
    const { open: isOpen, onOpen, onClose } = useDisclosure();
    const { printers, getPrinters } = useGetPrinters();
    const [
        selectedPrinter,
        setSelectedPrinter,
        removeSelectedPrinter,
    ] = useLocalStorage<PrinterT>('printer');
    const [search, setSearch] = useState<string | null>(null);
    const searchInputRef = useRef<HTMLInputElement>();
    const { products, onClick } = props;
    const filteredProducts = (!!search && search.length > 0 ?
        products.filter((p) => p.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) :
        products) || [];
    const productListRef = useRef<HTMLDivElement | null>(null);
    const selectedPrinterRef = useRef<PrinterT>();

    // Don't scroll the background if the modal is open.
    useLockBodyScroll(isOpen, productListRef);

    const categoriesAndProducts = useMemo(() => {
        return props.productTypes.reduce((acc, pt) => {
            const products = props.products.filter((p) => {
                return p.product_type.id === pt.id && (!search || p.name.toLowerCase().indexOf(search.toLowerCase()) >= 0);
            });

            if (products.length > 0) {
                acc[pt.name] = products;
            }

            return acc;
        }, {} as Record<string, ProductT[]>);
    }, [search, props.products, props.productTypes]);

    useEffect(() => {
        selectedPrinterRef.current = selectedPrinter;
    }, [selectedPrinter]);

    const onPrinterModalClose = () => {
        if (selectedPrinter?.id !== selectedPrinterRef.current?.id) {
            setSelectedPrinter(selectedPrinterRef.current);
        }

        onClose();
    };

    return (
        <div>
            <SearchField>
                <Box>
                    <InputGroup
                        startElement={<LuSearch />}
                        endElement={(
                            <span
                                className="input-buttons"
                                style={{
                                    width: 'auto',
                                    marginRight: '-10px',
                                }}
                            >
                                {!!search && !!search.length ? (
                                    <CloseButton
                                        size="sm"
                                        onClick={() => {
                                            setSearch(null);

                                            if (!!searchInputRef && !!searchInputRef.current) {
                                                searchInputRef.current.value = '';
                                            }
                                        }} 
                                    />
                                ) : null}
                                <Button size="sm" onClick={onOpen}>
                                    <SettingsIcon /> Printer (<b>{!selectedPrinter ? '-' : selectedPrinter.id}</b>)
                                </Button>
                            </span>
                        )}
                    >
                        <Input
                            placeholder="Search"
                            // @ts-ignore
                            ref={searchInputRef}
                            value={search || ''}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                            bg="gray.700"
                        />
                    </InputGroup>
                </Box>
            </SearchField>
            <VStack spaceY="20px" mt="30px" alignItems="flex-start">
                {Object.entries(categoriesAndProducts).map(([title, products]) => {
                    return (
                        <Box width="100%">
                            <Box mb="10px">
                                <Heading ml="5px" size="xl">{title}</Heading>
                            </Box>
                            <Box>
                                <ProductCardList ref={productListRef}>
                                    {products.map((product, i) => {
                                        const classNames: string[] = [product.type];

                                        if (product.sold_out || product.discontinued) {
                                            classNames.push('soldout');
                                        }

                                        return (
                                            <ProductCard
                                                key={i}
                                                product={product}
                                                type={product.type}
                                                className={classNames.join(' ')}
                                                onClick={() => {
                                                    if (product.sold_out) {
                                                        return;
                                                    }

                                                    onClick(product);
                                                }}
                                            />
                                        );
                                    })}
                                </ProductCardList>
                            </Box>
                        </Box>
                    );
                })}
            </VStack>

            <Dialog.Root
                open={isOpen}
                onEscapeKeyDown={onPrinterModalClose}
                onInteractOutside={onPrinterModalClose}
                onExitComplete={onPrinterModalClose}
                closeOnInteractOutside
                closeOnEscape
            >
                <Dialog.Trigger />
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger />
                        <Dialog.Header>
                            <Dialog.Title>Select a printer</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger />
                        <Dialog.Body>
                            <Box>
                                {printers.map((p, i) => {
                                    return (
                                        <List.Root spaceX={3} spaceY={3} key={`printer-${i}`}>
                                            <List.Item
                                                onClick={() => setSelectedPrinter(p)}
                                                cursor="pointer"
                                                padding="5px"
                                                borderRadius="5px"
                                                _hover={{
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                }}
                                            >
                                                {p.id === selectedPrinter?.id ?
                                                    <List.Indicator color="green.500" verticalAlign="middle">
                                                        <CheckCircleIcon />
                                                    </List.Indicator> :
                                                    <List.Indicator color="gray.500" verticalAlign="middle">
                                                        <MinusIcon />
                                                    </List.Indicator>
                                                }
                                                {p.name}
                                            </List.Item>
                                        </List.Root>
                                    );
                                })}
                            </Box>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Button colorScheme="ghost" onClick={onPrinterModalClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="blue" mr={3} onClick={() => {
                                props.onPrinterChange?.(selectedPrinter);
                                onClose();
                            }}>
                                Ok
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </div>
    );
};
