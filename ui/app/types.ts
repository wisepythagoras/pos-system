export type ProductTypeT = 'food' | 'drink' | 'pastry';

export type ProductT = {
    id: number;
    name: string;
    price: number;
    type: ProductTypeT;
};
