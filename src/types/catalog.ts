export type Availability = {
  active: boolean;
  reason?: string;
};

export type Variant = {
  id: string;
  name: string;
  price: number;
  attributes?: string[];
};

export type ModifierOption = {
  id: string;
  name: string;
  priceDelta?: number;
};

export type Modifier = {
  id: string;
  name: string;
  required: boolean;
  min?: number;
  max?: number;
  options: ModifierOption[];
};

export type ProductRules = {
  maxPerOrder?: number;
  conditionalFlags?: Record<string, boolean>;
};

export type CatalogProduct = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  basePrice?: number;
  variants?: Variant[];
  modifiers?: Modifier[];
  availability?: Availability;
  rules?: ProductRules;
  features?: string[];
  tags?: string[];
};

export type CatalogSubcategory = {
  id: string;
  name: string;
  products: CatalogProduct[];
};

export type CatalogCategory = {
  id: string;
  name: string | null;
  image?: string;
  subcategories: CatalogSubcategory[];
};

export type CatalogData = CatalogCategory[];
