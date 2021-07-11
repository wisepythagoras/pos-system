import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Divider, IconButton, InputBase, Paper } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
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
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    display: grid;

    @media screen and (max-width: 1024px) {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }

    & > div {
        height: 101px;
        margin: 5px;
        cursor: pointer;
        user-select: none;

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
                <Paper style={{ display: 'flex' }}>
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
            </SearchField>
            <ProductCardList>
                {filteredProducts.map((product, i) => {
                    return (
                        <div key={i} onClick={() => onClick(product)} className={product.type}>
                            <ProductCard product={product} />
                        </div>
                    );
                })}
            </ProductCardList>
        </div>
    );
};
