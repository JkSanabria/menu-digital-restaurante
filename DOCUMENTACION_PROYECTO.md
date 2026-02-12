# 📱 Menú Digital de Restaurante

## 🎯 ¿Qué es este proyecto?

Este es un **menú digital interactivo** para un restaurante, diseñado para que los clientes puedan ver los productos, agregarlos a un carrito de compras y hacer pedidos directamente desde su celular o computadora, sin necesidad de descargar ninguna aplicación.

**Imagínalo como**: Un catálogo digital de productos (como ver un álbum de fotos de comida) donde puedes ir seleccionando lo que quieres comer y al final enviar tu pedido por WhatsApp al restaurante.

---

## 👥 ¿Para quién es?

### Usuarios Principales (Clientes del Restaurante):
- Personas que quieren ver el menú del restaurante
- Personas que quieren hacer un pedido para llevar o domicilio
- Personas que prefieren ver fotos y precios antes de decidir

### Usuarios Secundarios (Dueños del Restaurante):
- El restaurante puede actualizar el menú cambiando un archivo de datos (`menu.json`)
- No necesitan saber programar para cambiar precios o productos
- Las imágenes pueden venir de `public/` o de URLs externas

---

## 🎨 ¿Cómo se siente usar la aplicación?

### En el Celular:
- **Rápida y fluida**: Como usar Instagram o TikTok
- **Compacta**: Todo está organizado para que no tengas que hacer mucho scroll
- **Táctil**: Puedes tocar cualquier producto para ver más detalles
- **Intuitiva**: No necesitas instrucciones, es como usar cualquier app de delivery

### En la Computadora:
- **Espaciosa**: Aprovecha la pantalla grande para mostrar más información
- **Elegante**: Diseño más amplio con más espacio entre elementos
- **Cómoda**: Puedes ver varios productos al mismo tiempo

---

## 🏗️ ¿Cómo está construido?

### Tecnologías Usadas (Explicado Simple):

#### 1. **React** (La Base)
- **Qué es**: Una herramienta para crear páginas web interactivas
- **Por qué**: Hace que la página sea rápida y no se recargue cada vez que haces click
- **Analogía**: Como los bloques de LEGO, construyes la página con piezas reutilizables

#### 2. **TypeScript** (El Lenguaje)
- **Qué es**: Una versión mejorada de JavaScript (el lenguaje de las páginas web)
- **Por qué**: Ayuda a prevenir errores antes de que sucedan
- **Analogía**: Como tener autocorrector en el celular, te avisa si escribes algo mal

#### 3. **Vite** (El Constructor)
- **Qué es**: Una herramienta que prepara la aplicación para funcionar
- **Por qué**: Hace que la aplicación cargue super rápido
- **Analogía**: Como un chef que prepara todos los ingredientes antes de cocinar

#### 4. **Tailwind CSS** (El Diseñador)
- **Qué es**: Una herramienta para hacer que la página se vea bonita
- **Por qué**: Permite cambiar colores, tamaños y espacios fácilmente
- **Analogía**: Como tener un set de stickers para decorar tu cuaderno

#### 5. **React Router** (El Navegador)
- **Qué es**: Permite cambiar entre diferentes páginas sin recargar
- **Por qué**: Hace que la navegación sea instantánea
- **Analogía**: Como cambiar de canal en la TV, es inmediato

---

## 📂 ¿Cómo está organizado el proyecto?

### Estructura de Carpetas (Simplificado):

```
menu-digital-restaurante/
├── src/                          (Donde vive el código)
│   ├── pages/                    (Pantallas principales)
│   │   ├── Home.tsx             (Pantalla principal con categorías)
│   │   ├── SectionView.tsx      (Pantalla de subcategorías)
│   │   ├── ProductList.tsx      (Lista de productos por subcategoría)
│   │   ├── PizzaCustomizer.tsx  (Menú de pizzas con tamaños y combos)
│   │   ├── PizzaBuilder.tsx     (Modal para pizza combinada mitad y mitad)
│   │   └── CartPage.tsx         (Pantalla del carrito y checkout)
│   │
│   ├── components/               (UI reutilizable)
│   │   ├── FloatingCart.tsx     (Botón flotante del carrito)
│   │   ├── FloatingNavigation.tsx (Navegación flotante)
│   │   └── Header.tsx           (Encabezado)
│   │
│   ├── context/                  (Memoria compartida de la app)
│   │   └── CartContext.tsx      (Recuerda qué productos agregaste)
│   │
│   ├── data/                     (Información del menú)
│   │   └── menu.json            (Archivo con todos los productos)
│   │
│   ├── utils/                    (Utilidades)
│   │   └── searchUtils.ts       (Búsqueda sin acentos)
│   │
│   ├── types/                    (Definiciones de estructura)
│   │   └── menu.ts              (Cómo debe verse cada producto)
│   │
│   └── App.tsx                   (El cerebro que conecta todo)
│
├── public/                       (Imágenes y archivos públicos)
└── package.json                  (Lista de herramientas necesarias)
```

---

## 🎬 ¿Cómo funciona? (Flujo de Uso)

### 1️⃣ **Pantalla Principal (Home)**

**Qué ves**:
- Un buscador arriba (como Google)
- Un banner de ofertas (opcional)
- Categorías grandes con fotos (según el menú cargado):
  - Comidas
  - Bebidas
  - Especialidades
  - Pizzas
  - Entradas / Postres (si existen en el menú)

**Qué puedes hacer**:
- Buscar un producto por nombre
- Tocar una categoría para ver sus subcategorías

**Cómo se ve**:
- **En celular**: 2 categorías por fila, compactas
- **En computadora**: 2 categorías por fila, más grandes

---

### 2️⃣ **Pantalla de Subcategorías (SectionView)**

**Ejemplo**: Si tocaste "Comidas", ahora ves:
- Título: "Comidas - Selecciona una categoría"
- Lista de subcategorías:
  - Desgranados
  - Hamburguesas
  - Papas & Acompañamientos
  - Perros Gallineral

**Qué puedes hacer**:
- Tocar una subcategoría para ver los productos
- Regresar a la pantalla principal (flecha atrás)

**Cómo se ve**:
- **En celular**: Lista vertical compacta, tarjetas pequeñas
- **En computadora**: 2-3 columnas, tarjetas más espaciosas

---

### 3️⃣ **Pantalla de Productos (ProductList)**

**Ejemplo**: Si tocaste "Desgranados", ahora ves:
- Título: "Desgranados - COMIDAS"
- Lista de productos:
  - Desgranado de Costillitas BBQ - $34.000
  - Desgranado de Pollo - $28.000
  - Desgranado Vegetariano - $28.000

**Qué puedes hacer**:
- **Tocar un producto**: Se abre una ventana con foto grande, descripción y opciones
- **Tocar el botón "+"**: Agrega el producto al carrito directamente
- **Tocar el ícono (i)**: Abre los detalles del producto

**Cómo se ve**:
- **En celular**: Lista vertical compacta
  - Solo nombre, precio, ícono de info y botón +
  - Sin fotos ni descripciones (para ahorrar espacio)
- **En computadora**: Tarjetas más grandes con más espacio

---

### 3️⃣.1️⃣ **Pantalla de Pizzas (PizzaCustomizer)**

**Qué ves**:
- Catálogo de pizzas tradicionales
- Botón para armar pizza combinada (mitad y mitad)
- Buscador específico para pizzas
- Modal para elegir tamaño y observaciones

**Qué puedes hacer**:
- Elegir tamaño (Personal/Mediana/Familiar)
- Armar una pizza combinada con 2 sabores
- Agregar pizzas directamente al carrito

---

### 4️⃣ **Ventana de Detalles del Producto (Modal)**

**Qué ves cuando tocas un producto**:
- Foto grande del producto
- Nombre y descripción completa
- Precio unitario
- Selector de cantidad (-, número, +)
- Resumen del carrito actual (si ya tienes productos)
- Botón grande "Agregar al pedido"

**Cómo funciona la combinación**:
- Botón "Combina dos sabores" dentro del modal
- Solo disponible en tamaños Mediana y Familiar
- Si seleccionas tamaño Personal, el botón se deshabilita
- Al elegir combinar, se abre un modal para seleccionar dos sabores
- Si cierras el modal de combinación, vuelve al detalle del producto

**Qué puedes hacer**:
- Cambiar la cantidad (cuántos quieres)
- Agregar al carrito
- Cerrar la ventana (X arriba a la derecha)

---

### 5️⃣ **Pantalla del Carrito (CartPage)**

**Qué ves**:
- Título: "Tu Pedido"
- Formulario para tus datos:
  - Nombre
  - Dirección de entrega (domicilio) o sede (recoger)
- Lista de productos que agregaste:
  - Nombre, cantidad, precio
  - Botones para aumentar/disminuir cantidad
  - Botón de basura para eliminar
- Sección de propina (opcional)
- Método de pago (Efectivo o Transferencia)
- Notas especiales (opcional)
- Resumen del total
- Botón grande "Enviar Pedido por WhatsApp"

**Qué puedes hacer**:
- Modificar cantidades
- Eliminar productos
- Agregar propina
- Seleccionar método de pago y detalles (banco o cambio)
- Elegir si es domicilio o recoger
- Administrar direcciones guardadas
- Escribir notas especiales
- Enviar el pedido por WhatsApp

**Cómo funciona el envío**:
1. Llenas tus datos
2. Revisas tu pedido
3. Tocas "Enviar Pedido"
4. Se abre WhatsApp con un mensaje pre-escrito que incluye:
   - Tu nombre
   - Tu dirección
   - Lista de productos
   - Total a pagar
   - Método de pago
5. Solo tienes que tocar "Enviar" en WhatsApp

**Cómo se ve**:
- **En celular**: 
  - Todo en una columna vertical
  - Resumen del pedido pegado abajo (sticky)
- **En computadora**:
  - Dos columnas:
    - Izquierda: Formulario y productos
    - Derecha: Propina, pago, notas y resumen (sticky)

---

## 🧩 Componentes Principales (Piezas Reutilizables)

### 1. **Carrito Flotante (Floating Cart Button)**
- **Qué es**: Un botón redondo que aparece abajo en todas las pantallas
- **Cuándo aparece**: Solo cuando tienes productos en el carrito
- **Qué muestra**: 
  - Ícono de carrito
  - Número de productos
  - Total a pagar
- **Qué hace**: Te lleva a la pantalla del carrito

### 2. **Buscador (Search Bar)**
- **Qué es**: Una barra de búsqueda en la pantalla principal
- **Qué hace**: Busca productos por nombre o descripción
- **Cómo funciona**: Mientras escribes, va filtrando los resultados
- **Extra**: No diferencia acentos ("Jamón" = "Jamon")

### 3. **Tarjeta de Producto (Product Card)**
- **Qué es**: Una caja que muestra un producto
- **Qué incluye**:
  - Nombre del producto
  - Precio
  - Ícono de información
  - Botón para agregar
- **Variantes**:
  - Compacta (móvil)
  - Espaciosa (desktop)

### 4. **Modal de Detalles (Product Modal)**
- **Qué es**: Una ventana emergente con información completa
- **Cuándo aparece**: Al tocar un producto
- **Qué incluye**:
  - Foto grande
  - Descripción
  - Selector de cantidad
  - Botón de agregar

---

## 🎨 Reglas de Diseño Visual

### Colores Principales:
- **Rojo (#DC2626)**: Color principal (botones, precios)
- **Blanco (#FFFFFF)**: Fondo de tarjetas
- **Gris claro (#F9FAFB)**: Fondo de la página
- **Negro (#111827)**: Textos principales

### Espaciado (Padding):
- **Móvil**: Compacto (12px entre elementos)
- **Desktop**: Espacioso (32px entre elementos)

### Tipografía:
- **Títulos**: Grande y negrita
- **Precios**: Rojo y negrita
- **Descripciones**: Gris y normal

### Animaciones:
- **Transiciones suaves**: Todo se mueve suavemente (300ms)
- **Hover effects**: Los elementos cambian al pasar el mouse
- **Active states**: Los botones se "hunden" al tocarlos

### Sistema Visual (Gobernanza):
- **Cards**: Radio base `rounded-2xl`, sombra base `shadow-sm`.
- **Botones**: Altura mínima táctil `min-h-[44px]`, padding `px-4 py-3`, radio `rounded-xl`.
- **Iconografía**: Tamaños permitidos `16 / 20 / 24 / 32` según rol.
- **Badges**: Estilo base con `rounded-full`, `px-2.5 py-0.5`, `text-[10px]`.
- **Modales**: Overlay `bg-black/60`, contenedor `rounded-2xl` con `p-6` en header/body/footer.
- **Fondos**: Fondo base `bg-gradient-to-b from-orange-50/60 via-white to-white`.
- **Espaciado**: Gaps permitidos `gap-2`, `gap-4`, `gap-6`.

---

## 📊 ¿Cómo se guardan los datos?

### Archivo de Menú (`menu.json`):
Este es un archivo de texto que contiene TODOS los productos del restaurante.

**Estructura**:
```
Menú
├── Sección (ej: Comidas)
│   ├── Subcategoría (ej: Desgranados)
│   │   ├── Categoría Final (ej: Desgranados)
│   │   │   ├── Producto 1
│   │   │   ├── Producto 2
│   │   │   └── Producto 3
```

**Información de cada producto**:
- ID único
- Nombre
- Descripción
- Precio
- URL de la imagen

**Ejemplo**:
```json
{
  "id": "desgranado-costillitas",
  "name": "Desgranado de Costillitas BBQ",
  "description": "Delicioso desgranado con costillitas en salsa BBQ",
  "price": 34000,
  "image": "https://..."
}
```

### Carrito y preferencias (En la Memoria del Navegador):
- Se guarda en el navegador (localStorage)
- Persiste aunque cierres la pestaña
- Se borra si limpias el caché del navegador
- Nombre y dirección también se guardan en cookies de respaldo
- Direcciones guardadas, método de pago y notas se persisten localmente

---

## 🔄 ¿Cómo fluyen los datos?

### 1. **Carga Inicial**:
```
Usuario abre la app
    ↓
Se carga el archivo menu.json
    ↓
Se muestran las categorías principales
```

### 2. **Navegación**:
```
Usuario toca "Comidas"
    ↓
Se filtran las subcategorías de "Comidas"
    ↓
Se muestra la lista de subcategorías
```

### 3. **Agregar al Carrito**:
```
Usuario toca "+"
    ↓
Se agrega el producto al carrito (memoria)
    ↓
Se actualiza el contador del carrito flotante
    ↓
Se guarda en localStorage (para no perderlo)
```

### 4. **Enviar Pedido**:
```
Usuario llena sus datos
    ↓
Usuario toca "Enviar Pedido"
    ↓
Se genera un mensaje de WhatsApp con:
  - Nombre del cliente
  - Dirección
  - Lista de productos
  - Total
    ↓
Se abre WhatsApp con el mensaje pre-escrito
    ↓
Usuario solo toca "Enviar" en WhatsApp
```

---

## 🎯 Funcionalidades Principales

### ✅ Lo que SÍ hace:
1. **Mostrar el menú**: Organizado por categorías y subcategorías
2. **Buscar productos**: Por nombre o descripción
3. **Ver detalles**: Foto, descripción, precio de cada producto
4. **Agregar al carrito**: Con selector de cantidad
5. **Modificar el carrito**: Cambiar cantidades o eliminar productos
6. **Calcular totales**: Suma automática de productos + propina
7. **Enviar pedido por WhatsApp**: Genera mensaje automático
8. **Guardar el carrito**: Persiste aunque cierres la página
9. **Responsive**: Se adapta a celulares, tablets y computadoras
10. **Pizzas combinadas**: Mitad y mitad con selector de sabores
11. **Direcciones guardadas**: Reutiliza direcciones y guías

### ❌ Lo que NO hace:
1. **No procesa pagos**: Solo envía el pedido por WhatsApp
2. **No tiene login**: No necesitas crear cuenta
3. **No tiene backend**: Todo funciona en el navegador
4. **No envía emails**: Solo WhatsApp
5. **No tiene inventario**: No controla stock
6. **No tiene delivery tracking**: No rastrea el pedido
7. **No tiene historial**: No guarda pedidos anteriores

---

## 🚀 ¿Cómo se ejecuta el proyecto?

### Requisitos Previos:
1. **Node.js**: Programa para ejecutar JavaScript (versión 18 o superior)
2. **npm**: Gestor de paquetes (viene con Node.js)

### Instalación (Primera Vez):
```bash
# 1. Descargar las dependencias
npm install

# Esto descarga todas las herramientas necesarias
# (React, TypeScript, Vite, etc.)
```

### Ejecución (Desarrollo):
```bash
# 2. Iniciar el servidor de desarrollo
npm run dev

# Esto abre la aplicación en http://localhost:5173
# Cualquier cambio que hagas se verá automáticamente
```

### Construcción (Producción):
```bash
# 3. Crear la versión final para publicar
npm run build

# Esto genera una carpeta "dist" con archivos optimizados
# listos para subir a un servidor web
```

---

## 📱 Diseño Responsivo (Mobile-First)

### Estrategia:
**Diseñamos primero para celulares, luego mejoramos para pantallas grandes**

### Breakpoints (Tamaños de Pantalla):
- **Móvil**: 0px - 767px (celulares)
- **Tablet**: 768px - 1023px (tablets)
- **Desktop**: 1024px+ (computadoras)

### Diferencias por Dispositivo:

#### En Celular:
- Tarjetas compactas (padding pequeño)
- Lista vertical (una columna)
- Títulos más pequeños
- Menos espacio entre elementos
- Resumen del carrito pegado abajo

#### En Tablet:
- Tarjetas medianas
- 2 columnas
- Títulos medianos
- Espacio moderado

#### En Desktop:
- Tarjetas espaciosas (padding grande)
- 2-3 columnas
- Títulos grandes
- Mucho espacio entre elementos
- Resumen del carrito en sidebar lateral

---

## 🎨 Paleta de Colores Completa

### Colores Principales:
- **Primary (Rojo)**: `#DC2626` - Botones, precios, acentos
- **White**: `#FFFFFF` - Fondos de tarjetas
- **Gray-50**: `#F9FAFB` - Fondo de página
- **Gray-100**: `#F3F4F6` - Bordes sutiles
- **Gray-400**: `#9CA3AF` - Textos secundarios
- **Gray-800**: `#1F2937` - Textos principales
- **Gray-900**: `#111827` - Títulos

### Colores Semánticos:
- **Success (Verde)**: `#10B981` - Confirmaciones
- **Warning (Amarillo)**: `#F59E0B` - Advertencias
- **Error (Rojo)**: `#EF4444` - Errores
- **Info (Azul)**: `#3B82F6` - Información

---

## 🔧 Dependencias del Proyecto

### Dependencias Principales (Necesarias para que funcione):

1. **react** (^18.2.0)
   - Qué hace: Crea la interfaz de usuario
   - Por qué: Es la base de toda la aplicación

2. **react-dom** (^18.2.0)
   - Qué hace: Conecta React con el navegador
   - Por qué: Permite que React se muestre en la página

3. **react-router-dom** (^7.13.0)
   - Qué hace: Maneja la navegación entre páginas
   - Por qué: Permite cambiar de pantalla sin recargar

4. **lucide-react** (^0.368.0)
   - Qué hace: Proporciona íconos bonitos
   - Por qué: Para mostrar íconos de carrito, búsqueda, etc.

### Dependencias de Desarrollo (Solo para programar):

1. **vite** (^5.2.0)
   - Qué hace: Servidor de desarrollo y constructor
   - Por qué: Hace que la app cargue rápido

2. **typescript** (^5.2.2)
   - Qué hace: Lenguaje de programación mejorado
   - Por qué: Previene errores

3. **tailwindcss** (^3.4.3)
   - Qué hace: Framework de estilos CSS
   - Por qué: Facilita el diseño visual

4. **@vitejs/plugin-react** (^4.2.1)
   - Qué hace: Conecta Vite con React
   - Por qué: Necesario para que funcionen juntos

---

## 📝 Convenciones y Decisiones de Diseño

### 1. **Mobile-First**
**Decisión**: Diseñar primero para móvil, luego mejorar para desktop
**Por qué**: La mayoría de usuarios usan celulares
**Cómo**: Estilos base = móvil, prefijos `md:` = desktop

### 2. **Sin Imágenes en Lista de Productos (Móvil)**
**Decisión**: No mostrar fotos en la lista de productos en móvil
**Por qué**: Ahorrar espacio vertical (40% menos scroll)
**Cómo**: Las fotos solo se ven al tocar el producto

### 3. **Carrito Persistente**
**Decisión**: Guardar el carrito en localStorage
**Por qué**: No perder el pedido si cierras la página
**Cómo**: Se guarda automáticamente cada vez que agregas algo

### 4. **WhatsApp como Canal de Pedidos**
**Decisión**: Enviar pedidos por WhatsApp en vez de email
**Por qué**: 
  - Más usado en Latinoamérica
  - Respuesta más rápida del restaurante
  - No requiere backend complejo
**Cómo**: Se genera un mensaje pre-formateado

### 5. **Diseño Compacto en Móvil**
**Decisión**: Reducir padding y espacios en celulares
**Por qué**: Aprovechar mejor el espacio limitado
**Cómo**: `p-3` en móvil vs `md:p-8` en desktop

### 6. **Títulos Inline en Móvil**
**Decisión**: Poner título y subtítulo en la misma línea
**Por qué**: Ahorrar espacio vertical
**Cómo**: `inline` en móvil, `block` en desktop

---

## 🔄 Guía de Reconstrucción del Sistema

Si tuvieras que recrear esta aplicación desde cero, este sería el orden:

### Fase 1: Fundamentos (Día 1)
1. **Crear el proyecto con Vite + React + TypeScript**
2. **Instalar Tailwind CSS**
3. **Crear el archivo `menu.json` con datos de ejemplo**
4. **Definir los tipos en `types/menu.ts`**

### Fase 2: Navegación Básica (Día 2)
1. **Instalar React Router**
2. **Crear las 4 páginas vacías** (Home, SectionView, ProductList, CartPage)
3. **Configurar las rutas en `App.tsx`**
4. **Probar la navegación básica**

### Fase 3: Contexto del Carrito (Día 3)
1. **Crear `CartContext.tsx`**
2. **Implementar funciones**:
   - `addToCart`
   - `removeFromCart`
   - `updateQuantity`
   - `clearCart`
3. **Conectar con localStorage**

### Fase 4: Pantalla Principal (Día 4)
1. **Implementar `Home.tsx`**:
   - Buscador
   - Grid de categorías
   - Resultados de búsqueda
2. **Agregar imágenes de categorías**
3. **Probar navegación a subcategorías**

### Fase 5: Pantalla de Subcategorías (Día 5)
1. **Implementar `SectionView.tsx`**:
   - Header con título
   - Lista de subcategorías
   - Botón de regresar
2. **Aplicar estilos responsive**

### Fase 6: Pantalla de Productos (Día 6-7)
1. **Implementar `ProductList.tsx`**:
   - Header
   - Lista de productos
   - Modal de detalles
   - Botones de agregar
2. **Aplicar diseño compacto móvil**
3. **Probar agregar al carrito**

### Fase 7: Pantalla del Carrito (Día 8-9)
1. **Implementar `CartPage.tsx`**:
   - Formulario de datos
   - Lista de productos
   - Controles de cantidad
   - Sección de propina
   - Método de pago
   - Notas especiales
   - Resumen
2. **Implementar layout responsive** (columna móvil, 2 columnas desktop)
3. **Generar mensaje de WhatsApp**

### Fase 8: Componentes Compartidos (Día 10)
1. **Carrito flotante**
2. **Pulir animaciones y transiciones**
3. **Agregar estados de hover y active**

### Fase 9: Testing y Ajustes (Día 11-12)
1. **Probar en diferentes dispositivos**:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1280px)
2. **Ajustar espaciados y tamaños**
3. **Verificar funcionalidad del carrito**
4. **Probar envío por WhatsApp**

### Fase 10: Optimización y Deploy (Día 13-14)
1. **Optimizar imágenes**
2. **Revisar performance**
3. **Crear build de producción**
4. **Subir a Vercel o Netlify**

---

## 🎓 Conceptos Clave para Entender el Proyecto

### 1. **SPA (Single Page Application)**
**Qué es**: Una aplicación que no recarga la página completa al navegar
**Analogía**: Como un libro donde cambias de capítulo sin cerrar el libro
**En este proyecto**: Usamos React Router para cambiar de "página" sin recargar

### 2. **Estado (State)**
**Qué es**: La memoria de la aplicación
**Analogía**: Como tu memoria a corto plazo
**En este proyecto**: 
  - Estado del carrito (qué productos tienes)
  - Estado del modal (abierto/cerrado)
  - Estado de búsqueda (qué estás buscando)

### 3. **Contexto (Context)**
**Qué es**: Memoria compartida entre todas las páginas
**Analogía**: Como una pizarra que todos pueden ver
**En este proyecto**: El carrito es un contexto (todas las páginas lo ven)

### 4. **Componente**
**Qué es**: Una pieza reutilizable de la interfaz
**Analogía**: Como un molde para hacer galletas
**En este proyecto**: 
  - Tarjeta de producto
  - Modal de detalles
  - Carrito flotante

### 5. **Props**
**Qué es**: Información que le pasas a un componente
**Analogía**: Como los ingredientes que le das al chef
**En este proyecto**: Le pasas el producto a la tarjeta para que lo muestre

### 6. **Responsive Design**
**Qué es**: Diseño que se adapta al tamaño de la pantalla
**Analogía**: Como ropa que se estira para diferentes tallas
**En este proyecto**: Mobile-first con breakpoints

---

## 🐛 Problemas Comunes y Soluciones

### Problema 1: "El carrito se borra al recargar"
**Causa**: No se está guardando en localStorage
**Solución**: Verificar que `CartContext` tenga `useEffect` para guardar

### Problema 2: "Las imágenes no cargan"
**Causa**: URLs rotas en `menu.json`
**Solución**: Verificar que las URLs sean válidas

### Problema 3: "El diseño se ve mal en móvil"
**Causa**: Olvidaste aplicar estilos mobile-first
**Solución**: Asegúrate de que los estilos base sean para móvil

### Problema 4: "WhatsApp no se abre"
**Causa**: Formato incorrecto del enlace
**Solución**: Verificar que el número tenga formato internacional

### Problema 5: "La página no carga"
**Causa**: Error en el código
**Solución**: Revisar la consola del navegador (F12)

---

## 📚 Recursos Adicionales

### Para Aprender Más:
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **Vite**: https://vitejs.dev

### Herramientas Útiles:
- **Chrome DevTools**: Para probar en diferentes tamaños
- **React DevTools**: Para ver el estado de la aplicación
- **VS Code**: Editor de código recomendado

---

## ✅ Checklist de Funcionalidades

### Navegación:
- [x] Ver categorías principales
- [x] Ver subcategorías
- [x] Ver lista de productos
- [x] Regresar a pantalla anterior
- [x] Buscar productos

### Carrito:
- [x] Agregar productos
- [x] Modificar cantidades
- [x] Eliminar productos
- [x] Ver total
- [x] Persistir en localStorage
- [x] Contador en carrito flotante

### Pedido:
- [x] Llenar datos del cliente
- [x] Seleccionar método de pago
- [x] Agregar propina
- [x] Escribir notas especiales
- [x] Generar mensaje de WhatsApp
- [x] Enviar por WhatsApp

### Responsive:
- [x] Diseño móvil compacto
- [x] Diseño tablet intermedio
- [x] Diseño desktop espacioso
- [x] Transiciones suaves
- [x] Touch feedback

---

## 🎯 Resumen Ejecutivo

**Este proyecto es**:
- Un menú digital interactivo para restaurantes
- Construido con React, TypeScript y Tailwind CSS
- Optimizado para celulares (mobile-first)
- Sin backend (todo en el navegador)
- Integrado con WhatsApp para pedidos

**Características principales**:
- Navegación por categorías jerárquicas
- Carrito de compras persistente
- Diseño responsive (móvil y desktop)
- Envío de pedidos por WhatsApp
- Búsqueda de productos
- Modal de detalles de producto

**Tecnologías clave**:
- React (interfaz)
- TypeScript (lenguaje)
- Vite (constructor)
- Tailwind CSS (estilos)
- React Router (navegación)

**Filosofía de diseño**:
- Mobile-first (diseñar para móvil primero)
- Compacto en celulares, espacioso en desktop
- Rápido y fluido
- Intuitivo y fácil de usar

---

**Última actualización**: 11 de Febrero de 2026  
**Versión**: 1.1.0  
**Autor**: Equipo de Desarrollo
