export interface  Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    
    category?: Category;
    supplier?: Supplier;
    categoryId?: string;
    supplierId?: string;
}

export interface Category {
    id?: string;
    name: string;

    products?: Product[];
}

export interface Supplier {
    id?: string;
    name: string;
    
    products?: Product[];
}

export interface ProductQueryParameters {
    pageSize?: number;
    page?: number;
    category?: string;
    searchTerm?: string;
}

export interface ProductQueryResult {
    products: Product[];
    totalCount: number;
    categories: Category[];
}
