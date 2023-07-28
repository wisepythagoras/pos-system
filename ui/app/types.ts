export type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string;
};

export type ProductTypeOldT = 'food' | 'drink' | 'pastry';

export type ProductT = {
    id: number;
    name: string;
    price: number;
    type: ProductTypeOldT;
    product_type_id: number;
    discontinued: boolean;
    sold_out: boolean;
    fulfilled: boolean;
    product_type: ProductTypeT;
};

export type ProductAggregateT = {
    product: ProductT;
    amount: number;
};

export type ProductMapT = {
    [key: string]: ProductAggregateT;
};

export type OrderT = {
    id: number;
    cancelled: boolean;
    created_at: string;
    products: ProductT[];
};

export type RichOrderT = {
    order_id: number;
    total: number;
    order: OrderT;
};

export type StationT = {
    id: number;
    name: string;
    products: ProductT[];
    created_at: Date;
    updated_at: Date;
};

export type UserT = {
    id: number;
    username: string;
    created_at: Date;
    updated_at: Date;
    station_id: number | null;
    station?: StationT;
};

export type PrinterT = {
    id: number;
    name: string;
};

export type ProductTypeT = {
    id: number;
    name: string;
    title: string;
    created_at: Date;
};
