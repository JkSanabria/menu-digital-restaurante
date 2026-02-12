# 🍕 Menú Digital Napoli

> Un menú digital interactivo y moderno para restaurantes, optimizado para dispositivos móviles y con integración directa a WhatsApp.

![React](https://img.shields.io/badge/React-18.3-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-purple?logo=vite)

---

## 🎯 ¿Qué es?

Un menú digital completo que permite a los clientes:
- 📱 Ver productos organizados por categorías
- 🔍 Buscar productos específicos
- 🛒 Agregar productos a un carrito de compras
- 💬 Enviar pedidos directamente por WhatsApp
- 📲 Usar desde cualquier dispositivo (celular, tablet, computadora)

**Sin necesidad de descargar ninguna aplicación** - funciona directo en el navegador.

---

## ✨ Características Principales

### 🎨 Diseño Responsivo
- **Mobile-First**: Diseñado primero para celulares, luego optimizado para pantallas grandes
- **Compacto en móvil**: 40% menos scroll necesario
- **Espacioso en desktop**: Aprovecha las pantallas grandes

### 🚀 Rápido y Fluido
- Navegación instantánea sin recargas
- Transiciones suaves entre pantallas
- Carrito persistente (no se pierde al cerrar la página)

### 🍕 Combinación de Sabores
- Botón "Combina dos sabores" en el modal de detalle
- Solo disponible en tamaños Mediana y Familiar
- Selector dedicado con búsqueda de sabores
- Al cerrar el selector, vuelve al detalle del producto

### 💬 Integración WhatsApp
- Genera automáticamente el mensaje del pedido
- Incluye todos los detalles (productos, total, dirección)
- Un solo tap para enviar

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18 o superior
- npm (viene con Node.js)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/JkSanabria/menu-digital-restaurante.git

# 2. Entrar a la carpeta
cd menu-digital-restaurante

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Construcción para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

---

## 📱 Capturas de Pantalla

### Móvil
- Pantalla principal con categorías
- Lista compacta de productos
- Carrito de compras

### Desktop
- Vista espaciosa de productos
- Carrito con layout de 2 columnas

---

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.3 | Interfaz de usuario interactiva |
| **TypeScript** | 5.7 | Lenguaje con tipado estático |
| **Vite** | 6.0 | Herramienta de construcción rápida |
| **Tailwind CSS** | 3.4 | Framework de estilos utility-first |
| **React Router** | 7.1 | Navegación entre páginas |
| **Lucide React** | 0.468 | Iconos modernos |

---

## 📂 Estructura del Proyecto

```
menu-digital-restaurante/
├── src/
│   ├── pages/           # Pantallas principales
│   │   ├── Home.tsx            # Categorías principales
│   │   ├── SectionView.tsx     # Subcategorías
│   │   ├── ProductList.tsx     # Lista de productos
│   │   └── CartPage.tsx        # Carrito de compras
│   │
│   ├── context/         # Estado global
│   │   └── CartContext.tsx     # Gestión del carrito
│   │
│   ├── data/            # Datos del menú
│   │   └── menu.json           # Productos y categorías
│   │
│   ├── types/           # Definiciones TypeScript
│   │   └── menu.ts             # Tipos de datos
│   │
│   └── App.tsx          # Componente principal
│
├── public/              # Archivos estáticos
└── DOCUMENTACION_PROYECTO.md  # Documentación completa
```

---

## 📖 Documentación Completa

Para una guía detallada del proyecto, incluyendo:
- Explicación completa de cada funcionalidad
- Flujo de uso paso a paso
- Decisiones de diseño y arquitectura
- Gobernanza del sistema visual
- Guía de reconstrucción del sistema
- Solución a problemas comunes

👉 **[Ver Documentación Completa](./DOCUMENTACION_PROYECTO.md)**

---

## 🎛️ Sistema Visual

Este proyecto aplica un sistema visual gobernado para mantener consistencia:
- Cards: `rounded-2xl` + `shadow-sm`
- Botones: `min-h-[44px]`, `px-4 py-3`, `rounded-xl`
- Iconos: tamaños `16 / 20 / 24 / 32`
- Badges: `rounded-full`, `px-2.5 py-0.5`, `text-[10px]`
- Modales: overlay `bg-black/60`, contenedor `rounded-2xl`, `p-6`
- Fondos: `bg-gradient-to-b from-orange-50/60 via-white to-white`
- Espaciado: `gap-2`, `gap-4`, `gap-6`

Más detalle en la [Documentación Completa](./DOCUMENTACION_PROYECTO.md).

---

## 🎨 Personalización

### Cambiar el Menú

Edita el archivo `src/data/menu.json` para:
- Agregar/eliminar productos
- Cambiar precios
- Actualizar descripciones
- Modificar categorías

### Cambiar Colores

Edita `tailwind.config.js` para personalizar:
- Color primario (actualmente rojo)
- Paleta de colores
- Fuentes tipográficas

### Cambiar Número de WhatsApp

Edita `src/pages/CartPage.tsx` y busca la función que genera el enlace de WhatsApp.

---

## 🌟 Características Destacadas

### Diseño Mobile-First
```
Móvil:    Compacto, eficiente, menos scroll
Tablet:   Intermedio, 2 columnas
Desktop:  Espacioso, 3 columnas, sidebar
```

### Carrito Inteligente
- Se guarda automáticamente en el navegador
- Persiste aunque cierres la página
- Actualización en tiempo real
- Contador flotante siempre visible

### Búsqueda Instantánea
- Busca mientras escribes
- Filtra por nombre y descripción
- Resultados inmediatos

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios siguiendo los [estándares de commits](./DOCUMENTACION_PROYECTO.md#estándares-de-mensajes-de-commit)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Estándares de Código

Este proyecto sigue estándares estrictos de calidad:

- ✅ **Commits en lenguaje natural**: Mensajes claros y descriptivos
- ✅ **Código TypeScript**: Tipado estático completo
- ✅ **Responsive Design**: Mobile-first obligatorio
- ✅ **Documentación exhaustiva**: Todo está documentado

Ver [Documentación Completa](./DOCUMENTACION_PROYECTO.md) para más detalles.

---

## 🐛 Problemas Conocidos

Ninguno actualmente. Si encuentras algún problema:

1. Revisa la [sección de problemas comunes](./DOCUMENTACION_PROYECTO.md#problemas-comunes-y-soluciones)
2. Abre un issue en GitHub
3. Incluye capturas de pantalla y pasos para reproducir

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

**Equipo de Desarrollo Napoli**

---

## 🙏 Agradecimientos

- Diseño inspirado en las mejores prácticas de UX móvil
- Iconos por [Lucide](https://lucide.dev)
- Fuentes por [Google Fonts](https://fonts.google.com)

---

## 📞 Contacto

¿Preguntas? ¿Sugerencias?

- 📧 Email: contacto@napoli.com
- 💬 WhatsApp: +57 XXX XXX XXXX
- 🌐 Web: https://napoli.com

---

## 🔗 Enlaces Útiles

- [Documentación Completa](./DOCUMENTACION_PROYECTO.md) - Guía exhaustiva del proyecto
- [React Docs](https://react.dev) - Documentación oficial de React
- [TypeScript Docs](https://www.typescriptlang.org) - Documentación oficial de TypeScript
- [Tailwind CSS](https://tailwindcss.com) - Documentación de Tailwind

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ para restaurantes modernos

</div>
