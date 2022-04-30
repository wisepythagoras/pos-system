import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
    Box,
    Button,
    CloseButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from '@chakra-ui/react';
import { Search2Icon, SettingsIcon } from '@chakra-ui/icons';
import { ProductT } from '../../types';
import { ProductCard } from '../ProductCard';

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

        &.food > div {
            background-color: #296a6c;
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
};

/**
 * Renders a list of products.
 * @param props The props.
 */
export const ProductList = (props: IProductListProps) => {
    const [search, setSearch] = useState<string | null>(null);
    const searchInputRef = useRef<HTMLInputElement>();
    const { products, onClick } = props;
    const filteredProducts = !!search && search.length > 0 ?
        products.filter((p) => p.name.toLowerCase().indexOf(search.toLowerCase()) >= 0) :
        products;

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
                                <Button size="sm" leftIcon={<SettingsIcon />}>
                                    Printer
                                </Button>
                            </InputRightElement>
                    </InputGroup>
                </Box>
            </SearchField>
            <ProductCardList>
                {filteredProducts.map((product, i) => {
                    const classNames: string[] = [product.type];

                    if (product.sold_out) {
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
        </div>
    );
};
