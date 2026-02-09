---
name: menu-admin-no-code
description: Skill para proveer una interfaz visual de gestión del contenido del menú sin tocar código.
---

# `menu-admin-no-code` Skill

## Propósito
Esta skill habilita una capa de administración visual que permite a usuarios no técnicos (dueños de restaurante, meseros) modificar la estructura y contenido del menú. En el contexto de este MVP estático, operará manipulando el JSON en memoria y permitiendo su descarga o persistencia simulada (localStorage).

## Responsabilidades
1.  **Edición Visual (CRUD)**: Formularios para editar nombres, precios, descripciones y atributos de productos.
2.  **Gestión de Estructura**: Interfaz para añadir o eliminar categorías y mover productos (Drag & Drop simplificado o botones de orden).
3.  **Persistencia Local**: Guardar los cambios en `localStorage` para que el usuario pueda previsualizar sus ediciones inmediatamente.
4.  **Exportación**: Generar el archivo `menu_structure.json` actualizado para que el desarrollador (o un proceso automatizado) lo suba al servidor.

## Métodos Públicos

### `initAdminMode()`
Activa el modo de edición. Inyecta botones de "Editar" en la interfaz del menú existente y muestra una barra de herramientas de administración.

### `toggleEditProduct(productId)`
Abre un modal/formulario para editar los datos de un producto específico.

### `saveChanges()`
Valida y guarda el estado actual del menú en el almacenamiento local o genera el archivo de exportación.

### `addNewProduct(categoryId)`
Añade un nuevo producto plantilla a la categoría especificada.

## Integración
-   Funciona como una "capa superior" sobre `menu-hierarchy.js`.
-   Al activarse, intercepta los clics de navegación para permitir edición o añade controles extra.
