# Diseño Funcional: Mobile-First Digital Menu (Napoli)

Este documento define la estructura, comportamiento y reglas de diseño para el menú digital jerárquico de **Napoli Pizza & Pasta**. El sistema está optimizado para acceso vía código QR en dispositivos móviles.

## 1. Definición de Jerarquía del Menú

El sistema utiliza una estructura de navegación profunda (Deep Navigation) para organizar un menú extenso sin abrumar al usuario en una sola pantalla.

### Estructura de Datos (JSON)
*   **Nivel 1: Secciones Principales (The "Root")**
    *   Ejemplo: *Il Forno (Pizzas)*, *La Cucina (Pastas)*, *Bebidas*.
    *   Visualización: Tarjetas grandes con imagen de fondo.
*   **Nivel 2: Subcategorías (The "Filter")**
    *   Ejemplo (dentro de Pizzas): *Tradicionales*, *Gourmet*, *Vegetarianas*.
    *   Visualización: Lista o Grid mediano.
*   **Nivel 3: Categorías Específicas (The "Group")**
    *   Ejemplo (dentro de Tradicionales): *Rojas (Base Tomate)*, *Blancas (Sin Salsa)*.
    *   Visualización: Encabezados de grupo o tarjetas simples.
*   **Nivel 4: Items (The "Product")**
    *   Contenido: Nombre, Precio, Descripción, Foto, Badges (Picante/Vegano).
    *   Acción: Botón "Pedir por WhatsApp".

## 2. Flujo de Navegación (User Flow)

1.  **Entrada (QR Scan):**
    *   El usuario escanea el QR en la mesa.
    *   Carga inmediata (< 2s) de la *Home* con las Secciones Principales.
    *   *Feedback:* Animación de entrada suave ("Fade In").

2.  **Exploración (Drill Down):**
    *   Usuario toca "Pizzas" -> Se desliza la pantalla a la derecha (Slide animation).
    *   Aparecen las subcategorías.
    *   El header muestra botón "Atrás" (<) claramente visible.

3.  **Selección (Product View):**
    *   Usuario llega al nivel de productos.
    *   Scroll vertical fluido.
    *   Las imágenes de producto son opcionales pero recomendadas (carga diferida/lazy).

4.  **Acción (Contact):**
    *   Botón flotante o en cada producto para "Pedir por WhatsApp".
    *   Abre la app nativa de WhatsApp con un mensaje pre-llenado.

## 3. Reglas de UI/UX (Mobile-First)

### Ergonomía Táctil
*   **Zona del Pulgar:** Las acciones principales deben estar en el tercio inferior de la pantalla.
*   **Touch Targets:** Altura mínima de **48px** para cualquier elemento interactivo (botones, items de lista).
*   **Márgenes:** Mínimo **16px** laterales para evitar toques accidentales en bordes curvos.

### Comportamiento Visual
*   **Tipografía:**
    *   Títulos (*Lobster Two*): Mínimo 20px.
    *   Cuerpo (*Lato*): Mínimo 16px para descripciones.
*   **Contraste:** Texto `#4A4A4A` sobre fondo `#FFFFFF` (Ratio > 4.5:1).
*   **Imágenes:** Relación de aspecto consistente (1:1 o 4:3) con object-fit cover.

## 4. Skills Globales Implementadas

El proyecto se construye sobre un set de "Skills" reutilizables para garantizar mantenibilidad y escalabilidad a otros restaurantes.

| Nueva Skill (Concepto) | Skill Técnica Mapeada | Propósito |
| :--- | :--- | :--- |
| **`restaurant-menu-hierarchy`** | `menu-hierarchy` | Gestiona la lógica de navegación multinivel y el renderizado recursivo del JSON. |
| **`mobile-entry-experience`** | `menu-ui-mobile` | Controla transiciones (slide), touch events y scroll restoration. |
| **`whatsapp-direct-contact`** | `menu-whatsapp-integration` | Genera enlaces `wa.me` dinámicos con mensajes pre-formateados. |
| **`menu-content-display`** | `menu-content` | Formatea precios (COP), badges y layout de tarjetas de producto. |
| **`no-code-admin`** | `menu-admin-no-code` | Permite edición rápida de precios/stock en el dispositivo del dueño. |

## 5. Estructura del Workspace (`menu-digital-restaurante`)

Este workspace es una SPA (Single Page Application) estática, lo que maximiza la velocidad y minimiza costos de hosting (GitHub Pages / Vercel).

```text
/menu-digital-restaurante
├── /.agent/skills/       # Definición técnica de las skills
├── /data/
│   └── menu_structure.json # Base de datos única del menú
├── /scripts/
│   ├── menu-hierarchy.js # Core Logic
│   ├── menu-ui-mobile.js # UX Logic
│   └── ...
├── index.html            # Punto de entrada único
└── styles.css            # Sistema de Diseño (Napoli Tokens)
```
