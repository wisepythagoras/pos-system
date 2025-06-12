import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
    Box,
    Button,
    CloseButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Modal,
    ModalBody,
    ModalContent,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon, MinusIcon, Search2Icon, SettingsIcon } from '@chakra-ui/icons';
import { ProductT } from '../../types';
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

        /* Maybe move these into the DB table */
        &.food > div {
            background-color: var(--chakra-colors-blue-700);;
        }

        &.drink > div {
            background-color: #aa5438;
        }

        &.pastry > div {
            background-color: #366a36;
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
    onClick: (product: ProductT) => void;
    onPrinterChange?: (p: PrinterT | undefined) => void;
};

/**
 * Renders a list of products.
 * @param props The props.
 */
export const ProductList = (props: IProductListProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
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
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<Search2Icon color="gray.300" />}
                        />
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
                            <InputRightElement
                                width="auto"
                                className="input-buttons"
                                marginRight="4px"
                            >
                                {!!search && !!search.length ? (
                                    <CloseButton
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
                            </InputRightElement>
                    </InputGroup>
                </Box>
            </SearchField>
            <ProductCardList ref={productListRef}>
                {filteredProducts.map((product, i) => {
                    const classNames: string[] = [product.type];

                    if (product.sold_out || product.discontinued) {
                        classNames.push('soldout');
                    }

                    return (
                        <div
                            key={i}
                            onClick={() => {
                                if (product.sold_out) {
                                    return;
                                }

                                onClick(product);
                            }}
                            className={classNames.join(' ')}
                        >
                            <ProductCard product={product} type={product.type} />
                        </div>
                    );
                })}
            </ProductCardList>

            <Modal isOpen={isOpen} onClose={onPrinterModalClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Select a printer
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            {printers.map((p, i) => {
                                return (
                                    <List spacing={3} key={`printer-${i}`}>
                                        <ListItem
                                            onClick={() => setSelectedPrinter(p)}
                                            cursor="pointer"
                                            padding="5px"
                                            borderRadius="5px"
                                            _hover={{
                                                background: 'rgba(255, 255, 255, 0.1)',
                                            }}
                                        >
                                            {p.id === selectedPrinter?.id ?
                                                <ListIcon as={CheckCircleIcon} color="green.500" verticalAlign="middle" /> :
                                                <ListIcon as={MinusIcon} color="gray.500" verticalAlign="middle" />
                                            }
                                            {p.name}
                                        </ListItem>
                                    </List>
                                );
                            })}
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="ghost" onClick={onPrinterModalClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" mr={3} onClick={() => {
                            props.onPrinterChange?.(selectedPrinter);
                            onClose();
                        }}>
                            Ok
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};
