import React from 'react';
import styled from 'styled-components';
import { ProductT } from '../../types';
import { ProductCard } from '../ProductCard';

const ProductCardList = styled.div`
    display: flex;

    & > div {
        width: 200px;
        height: 101px;
        margin: 6px;
        cursor: pointer;
        user-select: none;
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
                    <div onClick={() => onClick(product)}>
                        <ProductCard key={i} product={product} />
                    </div>
                );
            })}
        </ProductCardList>
    );
}
