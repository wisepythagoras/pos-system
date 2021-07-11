import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Divider, IconButton, InputBase, Paper } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { ProductT } from '../../types';
import { ProductCard } from '../ProductCard';

const ProductCardList = styled.div`
    display: flex;
    flex-flow: wrap;

    & > div:not(.search) {
        width: 300px;
        height: 101px;
        margin: 6px;
        cursor: pointer;
        user-select: none;

        @media screen and (max-width: 1024px) {
            width: 280px;
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
    }

    & > .search {
        width: 100%;
        margin: 0 5px 5px 5px;

        & > div {
            width: 100%;
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
        <ProductCardList>
            <div className="search">
                <Paper style={{ display: 'flex' }}>
                    <InputBase
                        placeholder="Search"
                        style={{
                            paddingLeft: '15px',
                            flex: 1,
                        }}
                        inputRef={searchInputRef}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                    <Divider
                        orientation="vertical"
                        style={{
                            marginTop: '10px',
                            height: '28px',
                        }}
                    />
                    <IconButton
                        disabled={!search || !search.length}
                        onClick={() => {
                            setSearch(null);

                            if (!!searchInputRef && !!searchInputRef.current) {
                                searchInputRef.current.value = '';
                            }
                        }} 
                    >
                        <ClearIcon />
                    </IconButton>
                </Paper>
            </div>

            {filteredProducts.map((product, i) => {
                return (
                    <div key={i} onClick={() => onClick(product)} className={product.type}>
                        <ProductCard product={product} />
                    </div>
                );
            })}
        </ProductCardList>
    );
};
