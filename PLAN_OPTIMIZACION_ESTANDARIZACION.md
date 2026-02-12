# Plan de optimizacion y estandarizacion

## Objetivo
Realizar la estandarizacion del modelo de producto hasta el Nivel 2 (variantes estructurales, modificadores obligatorios y opcionales, disponibilidad, reglas condicionales y limites basicos), unificando todos los productos bajo una misma estructura flexible que permita multiples tamanos, opciones y reglas, pero asegurando que, mientras no existan multiples variantes activas en un producto, el comportamiento visual y funcional se mantenga exactamente como actualmente. No alterar el diseno actual, solo preparar la arquitectura para soportar las nuevas capacidades de forma condicional.

## Alcance
- Normalizar estructura de secciones y productos en `src/data/menu.json`.
- Unificar modelo de producto con variantes y modificadores hasta Nivel 2.
- Centralizar utilidades (precio, busqueda, reglas de combinadas).
- Reducir logica duplicada en pantallas (Home, ProductList, PizzaCustomizer, CartPage).
- Definir contratos claros de datos y tipado estricto.

## Estado actual (resumen)
- Secciones top-level: comidas, bebidas, especialidades, pizzas, entradas, postres.
- `pizzas` usa estructura y reglas especiales (sizePrices, combinadas).
- Busqueda y formatPrice estan duplicados en varias pantallas.
- Persistencia local en `localStorage` y cookies de respaldo.

## Nombres mas intuitivos (propuesta)
- Secciones -> Categorias
- Subcategorias -> Subcategorias
- Productos -> Productos

Objetivo: mantener tres niveles incluyendo productos (Categoria -> Subcategoria -> Producto).

Ejemplo de estructura:
```json
{
  "categorias": [
    {
      "id": "comidas",
      "name": "Comidas",
      "subcategorias": [
        {
          "id": "desgranados",
          "name": "Desgranados",
          "productos": [
            {
              "id": "desgranado-supremo",
              "name": "Desgranado Supremo",
              "features": ["Costillitas", "Pollo", "Butifarra"],
              "tags": ["recomendado"]
            }
          ]
        }
      ]
    }
  ]
}
```

## Principios de estandarizacion
1. Un solo formato de producto base.
2. Reglas de variaciones declarativas en datos (no hardcode en UI).
3. UI sin cambios visuales hasta que existan multiples variantes activas.
4. Utilidades compartidas en `src/utils`.
5. Tipos TypeScript como fuente de verdad.
6. Etiquetas visibles/funcionales para clasificar y facilitar busqueda.

## Plan por fases

### Fase 1 - Diagnostico y contratos
- Definir contrato de datos unificado en `src/types/menu.ts`.
- Decidir campos obligatorios y opcionales (price, sizePrices, options, etc.).
- Incluir variantes estructurales y modificadores en el contrato.
- Documentar reglas de combinadas como metadata de seccion/subcategoria.

### Fase 2 - Datos (menu.json)
- Estandarizar nombres de secciones (singular/plural) y consistencia de IDs.
- Agregar metadata a secciones que lo requieran (ej: `combinationAllowedSizes`).
- Unificar productos bajo una estructura con variantes y modificadores.
- Mantener datos compatibles con el render actual cuando solo hay una variante.
- Validar que todos los productos cumplen el contrato base.
- Agregar `tags` para busqueda, filtros y futuras badges.

### Fase 3 - Utilidades
- Centralizar `formatPrice` en `src/utils/format.ts`.
- Unificar busqueda con normalizacion (acentos y equivalencias).
- Crear helpers para productos con tamanos/opciones.
- Resolver comportamiento condicional (1 variante = vista simple, varias = selector).

### Fase 4 - UI y logica
- Ajustar Home/ProductList/PizzaCustomizer para usar utilidades comunes.
- Eliminar logica duplicada de tamanos y combinadas.
- Unificar el modal de producto para todas las secciones.
- Mantener el diseno actual, habilitando selecciones solo por condiciones del modelo.
- Regla de navegacion condicional: si una seccion tiene 1 subcategoria y 1 categoria, saltar directo al listado de productos.
- Listado general de productos como estructura interna (no visible), consumido por buscador y filtros.

### Fase 5 - Persistencia y validacion
- Consolidar lectura/escritura de carrito y preferencias en un solo modulo.
- Tipar `paymentDetails` y validar estructura antes de persistir.
- Validar reglas basicas y limites por pedido desde el modelo.

### Fase 6 - QA y control
- Probar busqueda, combinadas, tamanos y carrito en movil/desktop.
- Revisar que el build no incluya datos innecesarios.

## Entregables
- Tipos y contratos actualizados.
- `menu.json` estandarizado con variantes/modificadores.
- Utilidades unificadas y reglas condicionales.
- UI simplificada con menos duplicacion.
- Documentacion actualizada.

## Riesgos
- Cambios en datos pueden romper render si no se ajustan tipos/validaciones.
- Diferencias de precios por tamanos requieren validacion extra.
- Activar variantes sin reglas claras puede impactar UX.

## Checklist
- [ ] Contratos de datos definidos
- [ ] Secciones estandarizadas
- [ ] Utilidades centralizadas
- [ ] UI refactorizada
- [ ] QA en movil y desktop

## Variantes a tener en cuenta para escalar

### NIVEL 1 - Imprescindibles (deberias tenerlas)
1. Variantes estructurales
2. Modificadores obligatorios
3. Modificadores opcionales con costo
4. Disponibilidad
5. Restricciones basicas
6. Etiquetas visuales
7. Producto compuesto

### NIVEL 2 - Importantes para escalar
8. Precio dinamico
9. Reglas condicionales
10. Variantes por sede
11. Limites por pedido

### NIVEL 3 - Solo para SaaS avanzado
12. Impuestos diferenciados
13. Prioridad de visualizacion configurable
14. Compatibilidad entre productos
15. Estados promocionales dinamicos

## Modelo de datos propuesto (resumen)

### Contrato base (TypeScript)
```ts
export type Availability = {
  active: boolean;
  reason?: string;
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

export type Variant = {
  id: string;
  name: string;
  price: number;
  attributes?: string[];
};

export type ProductRules = {
  maxPerOrder?: number;
  conditionalFlags?: Record<string, boolean>;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  basePrice?: number;
  variants?: Variant[];
  modifiers?: Modifier[];
  availability?: Availability;
  rules?: ProductRules;
};
```

### Comportamiento condicional (reglas)
- Si `variants` no existe o tiene longitud 0, usar `basePrice` y render simple.
- Si `variants` tiene longitud 1, render simple con el precio de la unica variante.
- Si `variants` tiene longitud >= 2, mostrar selector de variantes y activar logica.
- Si `modifiers` no existe o esta vacio, no mostrar seccion de modificadores.
- Si un `modifier` es `required`, validar seleccion segun `min/max`.
- Si `availability.active` es false, mostrar como no disponible.

### Ejemplo de producto simple (sin variantes)
```json
{
  "id": "hamburguesa-de-res",
  "name": "Hamburguesa de Res",
  "description": "100 g de carne de res seleccionada...",
  "image": "https://...",
  "basePrice": 28000,
  "availability": { "active": true }
}
```

### Ejemplo con variantes y modificadores
```json
{
  "id": "pizza-4-quesos",
  "name": "Pizza 4 Quesos",
  "description": "Deliciosa pizza con mezcla de quesos.",
  "image": "https://...",
  "variants": [
    { "id": "personal", "name": "Personal", "price": 27000 },
    { "id": "mediana", "name": "Mediana", "price": 55000 },
    { "id": "familiar", "name": "Familiar", "price": 69000 }
  ],
  "modifiers": [
    {
      "id": "sabores",
      "name": "Elige tus sabores",
      "required": true,
      "min": 2,
      "max": 2,
      "options": [
        { "id": "jamon", "name": "Jamon" },
        { "id": "pollo", "name": "Pollo" }
      ]
    }
  ],
  "rules": { "maxPerOrder": 3 }
}
```
