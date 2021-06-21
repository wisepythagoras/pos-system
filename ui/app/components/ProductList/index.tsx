import React from 'react';
import styled from 'styled-components';
import { ProductT } from '../../types';
import { ProductCard } from '../ProductCard';

const ProductCardList = styled.div`
    display: flex;
    flex-flow: wrap;

    & > div {
        width: 300px;
        height: 101px;
        margin: 6px;
        cursor: pointer;
        user-select: none;

        &.food > div {
            background-color: #65a6a8;
        }

        &.drink > div {
            background-color: #db896e;
        }

        &.pastry > div {
            background-color: #81b381;
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
    const { products, onClick } = props;

    return (
        <ProductCardList>
            {products.map((product, i) => {
                return (
                    <div onClick={() => onClick(product)} className={product.type}>
                        <ProductCard key={i} product={product} />
                    </div>
                );
            })}
        </ProductCardList>
    );
};
