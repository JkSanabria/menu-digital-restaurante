import { MenuData, Product } from '../types/menu';
import { CatalogData, CatalogProduct, ModifierOption } from '../types/catalog';

const normalizeId = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const parsePriceDelta = (label: string): number | undefined => {
  const match = label.match(/\(\+\s*\$?([\d.,]+)\s*\)/);
  if (!match?.[1]) return undefined;
  const cleaned = match[1].replace(/\./g, '').replace(/,/g, '.');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const buildModifierOption = (label: string): ModifierOption => ({
  id: normalizeId(label),
  name: label,
  priceDelta: parsePriceDelta(label),
});

const splitAttributes = (attributes: string[]) => {
  const features: string[] = [];
  const tags: string[] = [];

  attributes.forEach((attr) => {
    if (!attr) return;
    if (attr === attr.toLowerCase()) {
      tags.push(attr);
    } else {
      features.push(attr);
    }
  });

  return { features, tags };
};

const mapProduct = (product: Product): CatalogProduct => {
  const { features, tags } = splitAttributes(product.attributes || []);
  const variants = product.sizePrices
    ? Object.entries(product.sizePrices).map(([name, price]) => ({
        id: normalizeId(name),
        name,
        price,
      }))
    : undefined;

  const modifiers = product.options?.length
    ? [
        {
          id: 'options',
          name: 'Opciones',
          required: Boolean(product.maxOptions),
          min: product.maxOptions,
          max: product.maxOptions,
          options: product.options.map(buildModifierOption),
        },
      ]
    : undefined;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image,
    basePrice: variants ? undefined : product.price,
    variants,
    modifiers,
    features: features.length ? features : undefined,
    tags: tags.length ? tags : undefined,
  };
};

export const adaptMenuData = (menu: MenuData): CatalogData =>
  menu.map((section) => ({
    id: section.id,
    name: section.name,
    image: section.image,
    subcategories: section.subcategories.flatMap((subcategory) =>
      subcategory.categories.map((category) => ({
        id: `${subcategory.id}-${category.id}`,
        name: `${subcategory.name} - ${category.name}`,
        products: category.products.map(mapProduct),
      }))
    ),
  }));
