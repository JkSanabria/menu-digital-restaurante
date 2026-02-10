---
name: menu-hierarchy
description: Skill para gestionar la lógica de navegación jerárquica del menú (Sección > Subcategoría > Categoría Final).
---

# `menu-hierarchy` Skill

## Propósito
Definir la estructura jerarquica del menu (Seccion > Subcategoria > Categoria/Productos) y su mapeo a rutas en React Router, asegurando navegacion coherente y consistente.

## Responsabilidades
1. **Estructura de Datos**: Validar la forma del JSON del menu.
2. **Rutas y Jerarquia**:
   - Home: listado de Secciones
   - Seccion: listado de Subcategorias
   - Subcategoria: listado de Productos
3. **Breadcrumbs/Contexto**: Definir etiquetas y ruta visible para el usuario.
4. **Consistencia Visual**: Usar los patrones de tarjetas definidos en `menu-visual-system`.

## Reglas de Navegacion

- La jerarquia no debe romperse con saltos directos sin contexto.
- Los labels deben ser consistentes con el nombre real de la seccion/subcategoria.
- Si una seccion redirige (ej: pizzas), documentar la excepcion.

## Integracion

- **React Router**: rutas claras y predecibles.
- **menu-visual-system**: cards y headers deben seguir el sistema visual.

## Nota
Esta skill no define render HTML ni estilos; define la arquitectura de navegacion.

## Estructura de Datos Esperada (JSON)

```json
[
  {
    "id": "section_id",
    "name": "Sección Principal",
    "image": "url_imagen",
    "subcategories": [
      {
        "id": "sub_id",
        "name": "Subcategoría",
        "image": "url_imagen",
         "categories": [
             {
                 "id": "cat_final_id",
                 "name": "Categoría Final",
                 "products": [...]
             }
         ]
      }
    ]
  }
]
```

## Dependencias
-   Requiere `styles.css` para las clases de las tarjetas (`.category-card`, etc.).
-   Integración futura con `menu-content` para el renderizado detallado de productos en el Nivel 3.
