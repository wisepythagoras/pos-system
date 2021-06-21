export type ProductTypeT = 'food' | 'drink' | 'pastry';

export type ProductT = {
    id: number;
    name: string;
    price: number;
    type: ProductTypeT;
};

export type ProductAggregateT = {
    product: ProductT;
    amount: number;
}

export type ProductMapT = {
    [key: string]: ProductAggregateT;
};
