import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Divider, IconButton, InputBase, Paper } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { ProductT } from '../../types';
import { ProductCard } from '../ProductCard';

const SearchField = styled.div`
    width: calc(100% - 10px);
    margin: 0 5px 5px 5px;
    position: sticky;
    top: 0;

    & > div {
        width: 100%;
    }
`;

const ProductCardList = styled.div`
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    display: grid;

    @media screen and (max-width: 1024px) {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

            & > div > h2 {
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
                <Paper style={{
                    display: 'flex',
                    height: '48px',
                }}>
                    <div style={{ padding: '12px', paddingRight: 0 }}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search"
                        style={{
                            paddingLeft: '15px',
                            flex: 1,
                        }}
                        inputRef={searchInputRef}
                        value={search || ''}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                    {!!search && !!search.length ? (
                        <>
                            <Divider
                                orientation="vertical"
                                style={{
                                    marginTop: '10px',
                                    height: '28px',
                                }}
                            />
                            <IconButton
                                onClick={() => {
                                    setSearch(null);

                                    if (!!searchInputRef && !!searchInputRef.current) {
                                        searchInputRef.current.value = '';
                                    }
                                }} 
                            >
                                <ClearIcon />
                            </IconButton>
                        </>
                    ) : null}
                </Paper>
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
                            <ProductCard product={product} />
                        </div>
                    );
                })}
            </ProductCardList>
        </div>
    );
};
