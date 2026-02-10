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

### 6. `menu-ui-card-governance`
**Propósito**: Normalizar el lenguaje visual de cards de producto y sección en todo el frontend.
**Responsabilidades**:
- Definir el radio estándar base para cards principales: `rounded-2xl`.
- Definir la sombra base única para cards: `shadow-sm`.
- Establecer variantes permitidas solo por rol:
  - Card compacta (listas densas o resultados): `rounded-xl` con `shadow-sm`.
  - Card destacada (solo cuando el contenido requiera énfasis): `shadow-md` con borde/acento explícito.
- Mantener `border border-gray-100` como borde base de cards.
- Evitar radios y sombras múltiples en una misma vista salvo justificación funcional.

### 7. `menu-ui-button-governance`
**Propósito**: Unificar el diseño de botones primarios, secundarios y ghost en la UI.
**Responsabilidades**:
- Definir padding y altura base para botones: `min-h-[44px] px-4 py-3`.
- Definir radios por tipo:
  - Primario: `rounded-xl`.
  - Secundario: `rounded-xl`.
  - Ghost: `rounded-full` (icon-only usa `h-11 w-11 p-0`).
- Mantener estado base y accesible:
  - Default: contraste suficiente, `font-bold`.
  - Hover: cambios de color/fondo coherentes con el tipo.
  - Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`.
- Permitir variante de color para primario (ej. `bg-primary` o `bg-organic`) sin alterar padding, radio, altura ni estados.

### 8. `menu-ui-iconography`
**Propósito**: Mantener consistencia en tamaños y uso de iconos en la UI.
**Responsabilidades**:
- Definir tamaños permitidos:
  - `16`: iconos compactos (controles densos y acciones secundarias).
  - `20`: iconos de acción estándar (botones principales y secundarios).
  - `24`: iconos de encabezado o decorativos ligeros.
  - `32`: iconos decorativos de estado vacío.
- Alinear tamaño de iconos con el tamaño del botón y su rol.
- Evitar tamaños ad-hoc fuera de la escala definida.

### 9. `menu-ui-badge-governance`
**Propósito**: Unificar el estilo de badges y labels en cards, estados y acordeones.
**Responsabilidades**:
- Definir estilo base de badge: `inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border`.
- Permitir variantes por rol:
  - Estado: colores de fondo/texto/borde derivados del estado (ej. verde, amber, gris).
  - Categoría: fondo oscuro o neutro con texto claro.
  - Información: fondo suave con borde sutil.
- Evitar duplicación de estilos para el mismo rol semántico.

### 10. `menu-ui-modal-governance`
**Propósito**: Normalizar la estructura visual de modales y overlays.
**Responsabilidades**:
- Definir overlay base: `bg-black/60`.
- Definir contenedor: `bg-white rounded-2xl shadow-xl`.
- Establecer estructura estándar: Header, Body, Footer.
- Unificar padding: `p-6` en header/body/footer.
- Mantener comportamiento actual; solo ajustar presentación.

### 11. `menu-ui-surface-governance`
**Propósito**: Equilibrar fondos y superficies entre vistas.
**Responsabilidades**:
- Definir fondo base reutilizable: `min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-white`.
- Definir fondo alterno suave (si se requiere): `min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-white`.
- Aplicar fondos de forma consistente sin competir con el contenido.

### 12. `menu-ui-spacing-governance`
**Propósito**: Normalizar la escala de espaciado y gaps.
**Responsabilidades**:
- Definir escala permitida de gaps: `gap-2`, `gap-4`, `gap-6` (y sus variantes responsivas).
- Usar `gap-2` para densidad compacta, `gap-4` para layout base y `gap-6` para secciones amplias.
- Evitar valores fuera de la escala definida.

---
**Nota**: Estas skills son específicas del dominio "Restaurante" y complementan, no reemplazan, a las skills globales de arquitectura, estilos y buenas prácticas definidas en el ecosistema Antigravity.
