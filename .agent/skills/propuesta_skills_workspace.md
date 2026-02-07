# Definición de Skills del Workspace: Menú Digital Restaurante

Este documento define la estructura y responsabilidades propuestas para las skills específicas del workspace `menu-digital-restaurante`. Estas skills se integrarán con las skills globales existentes.

## Skills Propuestas

### 1. `menu-hierarchy`
**Propósito**: Definir y validar la estructura jerárquica del menú (3 niveles + productos).
**Responsabilidades**:
- Gestionar la lógica de navegación entre Secciones Principales > Subcategorías > Categorías Finales.
- Validar la integridad de los datos jerárquicos.
- Proveer métodos para obtener "breadcrumbs" o rutas de navegación.
- Estructurar el JSON o base de datos de categorías.

### 2. `menu-content`
**Propósito**: Gestionar el contenido editable y detallado de los productos del menú.
**Responsabilidades**:
- Definir el modelo de datos del Producto: Nombre, Precio, Descripción, Ingredientes.
- Manejar atributos especiales: Íconos (Picante, Vegano, Chef's Choice), Alérgenos.
- Gestión de URLs de imágenes y optimización de media.
- Formato de moneda y localización de precios.

### 3. `menu-ui-mobile`
**Propósito**: Asegurar una experiencia de usuario tipo app nativa, optimizada para dispositivos móviles.
**Responsabilidades**:
- Implementar componentes UI táctiles: Cards, Botones grandes (Touch Targets > 44px).
- Gestionar transiciones y animaciones suaves entre niveles de jerarquía.
- Prevenir comportamientos no deseados como zoom accidental.
- Garantizar accesibilidad y legibilidad en pantallas pequeñas (Mobile First).

### 4. `menu-whatsapp-integration`
**Propósito**: Gestionar la integración fluida con la API de WhatsApp para pedidos.
**Responsabilidades**:
- Generar enlaces dinámicos `wa.me` con mensajes prellenados.
- Formatear el mensaje de pedido: "Hola, quiero pedir: [Producto] - [Precio]".
- Configurar y validar el número de teléfono del restaurante (admin configurable).
- Manejo de variantes de producto en el mensaje (ej: "Sin cebolla").

### 5. `menu-admin-no-code`
**Propósito**: Proveer una interfaz de administración intuitiva que no requiera conocimientos técnicos.
**Responsabilidades**:
- Panel visual para CRUD (Crear, Leer, Actualizar, Borrar) de productos y categorías.
- Interfaz de "Arrastrar y Soltar" (Drag & Drop) para reordenar elementos.
- Edición rápida de precios y disponibilidad (Stock/Agotado).
- Publicación inmediata de cambios sin necesidad de despliegues complejos (Hot Reload de datos).

---
**Nota**: Estas skills son específicas del dominio "Restaurante" y complementan, no reemplazan, a las skills globales de arquitectura, estilos y buenas prácticas definidas en el ecosistema Antigravity.
