import React from 'react';
import { ProductT, ProductAggregateT } from '../../../app/types';

export interface IOrderProductsProps {
    products: ProductT[];
};

/**
 * Renders the orders's products as pills/badges.
 * @param props The props.
 */
export const OrderProducts = (props: IOrderProductsProps) => {
    const { products } = props;
    const aggregateProducts = new Map<number, ProductAggregateT>();
    const productPills: JSX.Element[] = [];

    for (let i in products) {
        const product = products[i];
        const storedProduct = aggregateProducts.get(product.id);

        if (!storedProduct) {
            aggregateProducts.set(product.id, {
                product,
                amount: 1,
            });
        } else {
            storedProduct.amount += 1;
            aggregateProducts.set(product.id, storedProduct);
        }
    }

    aggregateProducts.forEach((pa) => {
        productPills.push(<span>{pa.amount}&times;{pa.product.name}</span>);
    });

    return (
        <div>
            {productPills}
        </div>
    );
};
