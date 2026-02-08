export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    attributes: string[];
    prepTime?: string;
    spiceLevel?: number;
    size?: string;
    sizes?: string[];
}

export interface Category {
    id: string;
    name: string;
    products: Product[];
}

export interface SubCategory {
    id: string;
    name: string;
    categories: Category[];
}

export interface Section {
    id: string;
    name: string;
    image: string;
    subcategories: SubCategory[];
}

export type MenuData = Section[];
