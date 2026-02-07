---
name: menu-hierarchy
description: Skill para gestionar la lógica de navegación jerárquica del menú (Sección > Subcategoría > Categoría Final).
---

# `menu-hierarchy` Skill

## Propósito
Este skill encapsula toda la lógica relacionada con la estructura de árbol del menú del restaurante, asegurando una navegación fluida entre los tres niveles jerárquicos definidos sin recargas de página (SPA feeling).

## Responsabilidades
1.  **Carga de Estructura**: Leer y validar el JSON de configuración del menú.
2.  **Estado de Navegación**: Mantener el rastro de dónde se encuentra el usuario (Breadcrumbs).
3.  **Filtrado por Nivel**:
    -   **Nivel 1 (Home)**: Mostrar solo Secciones Principales (ej: Comidas, Bebidas).
    -   **Nivel 2 (Subcategoría)**: Al seleccionar una Sección, mostrar sus Subcategorías (ej: Bebidas -> Calientes, Frías).
    -   **Nivel 3 (Listado)**: Al seleccionar una Subcategoría, mostrar la Categoría Final con sus Productos.
4.  **UI Rendering**: Generar dinámicamente el HTML de las tarjetas de navegación basado en el nivel actual.

## Métodos Públicos (Interfaz)

### `initMenu(containerId, dataUrl)`
Inicializa el menú cargando datos desde `dataUrl` y renderizando el Nivel 1 en `containerId`.

### `navigateTo(level, id)`
Cambia la vista actual al nivel especificado, filtrando por el ID padre seleccionado.
-   `level`: 1 (Secciones), 2 (Subcategorías), 3 (Productos).
-   `id`: Identificador del padre seleccionado (null para Nivel 1).

### `goBack()`
Regresa al nivel inmediatamente anterior en la pila de navegación.

### `getBreadcrumbs()`
Retorna un array con la ruta actual para mostrar la barra de navegación (ej: ["Inicio", "Bebidas", "Calientes"]).

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
