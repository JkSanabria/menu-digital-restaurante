---
name: menu-content
description: Skill para gestionar y enriquecer el contenido de los productos (precios, ingredientes, alérgenos, disponibilidad).
---

# `menu-content` Skill

## Propósito
Este skill se encarga de la lógica de presentación y manipulación de los datos específicos de cada producto. Su objetivo es transformar los datos crudos del JSON en una experiencia de usuario rica y detallada.

## Responsabilidades
1.  **Formato de Precios**: Convertir números crudos (4500) en formatos de moneda localizables ($4,500).
2.  **Gestión de Disponibilidad**: Manejar estados como "Agotado" o "Stock Limitado".
3.  **Visualización de Atributos**: Renderizar íconos visuales para características especiales (Picante, Vegano, Gluten-Free) basados en etiquetas.
4.  **Enriquecimiento de Descripción**: Procesar arrays de ingredientes o descripciones largas para su correcta visualización (truncado/expandido).
5.  **Optimización de Imágenes**: Manejo de fallbacks si una imagen no carga.

## Métodos Públicos

### `formatPrice(price)`
Retorna el precio formateado con separadores de miles y símbolo de moneda (COP por defecto).

### `renderProductList(productsContainer, productsArray)`
Renderiza la lista completa de tarjetas de producto enriquecidas dentro del contenedor dado. Reemplaza el renderizado básico de `menu-hierarchy`.

### `getProductStatus(product)`
Retorna un objeto con la clase CSS y texto del estado del producto (ej: `{ class: 'text-danger', text: 'Agotado' }`).

### `renderAttributeIcons(attributes)`
Genera el HTML de los badges/íconos para atributos como "Picante" o "Vegano".

## Estructura de Datos (Producto)
El skill espera objetos de producto con esta forma:
```json
{
  "id": "p1",
  "name": "Nombre Producto",
  "price": 10000,
  "description": "Descripción corta...",
  "status": "available", // available, sold_out
  "attributes": ["spicy", "vegan"], // Claves para íconos
  "image": "url..."
}
```

## Dependencias
-   Se integra en el flujo de `menu-hierarchy` (Nivel 4).
-   Requiere Iconos (FontAwesome) cargados en `index.html`.
