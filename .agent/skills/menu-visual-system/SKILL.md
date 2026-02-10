---
name: menu-visual-system
description: Sistema visual del proyecto Menu Restaurante (tokens, jerarquias, componentes y micro-interacciones) alineado a React + Tailwind.
---

# Menu Visual System (Workspace)

Esta skill define el sistema visual especifico del proyecto y aterriza los patrones globales a decisiones concretas de UI.

**Rol:** Gobernanza local del sistema visual
**Uso:** OBLIGATORIO antes de modificar UI/estilos del proyecto

---

## 1. Tokens y Roles de Color

**Marca y acentos**
- Primario: `text-primary`, `bg-primary`, `border-primary`
- Acento: `text-orange-600`, `bg-orange-50`, `border-orange-200`

**Neutrales**
- Fondo principal: `bg-white`
- Fondo secundario: `bg-gray-50`
- Texto principal: `text-gray-900` / `text-gray-800`
- Texto secundario: `text-gray-600` / `text-gray-500`
- Borde base: `border-gray-100` / `border-gray-200`

**Regla:** No introducir nuevos colores sin actualizar esta skill.

---

## 2. Jerarquia Tipografica

**H1 Hero (solo portada/hero)**
- `text-3xl md:text-5xl font-heading font-black tracking-tight uppercase text-gray-900`

**H1 (titulo de vista)**
- `text-2xl md:text-4xl font-heading font-black tracking-tight text-gray-900`

**H2 (seccion)**
- `text-xl md:text-2xl font-heading font-bold tracking-tight text-gray-900`

**H3 (card/title)**
- `text-base md:text-lg font-heading font-bold text-gray-800`

**Section-title (meta/contexto)**
- `text-xs md:text-sm font-bold uppercase tracking-widest text-gray-400`

**Body**
- `text-sm md:text-base font-body text-gray-700`

**Caption/Meta**
- `text-[10px] md:text-xs text-gray-500`

**Reglas de uppercase**
- Solo `H1 Hero` y `Section-title` usan uppercase
- `H1`, `H2`, `H3` no usan uppercase

---

## 3. Espaciado y Radios

**Padding base**
- Mobile: `p-3`
- Desktop: `md:p-6`

**Gap base**
- Mobile: `gap-2` / `gap-3`
- Desktop: `md:gap-4` / `md:gap-6`

**Radios**
- Cards: `rounded-xl md:rounded-2xl`
- Modales: `rounded-xl` (mobile), `sm:rounded-3xl` (desktop)
- Botones: `rounded-lg` o `rounded-xl` segun jerarquia

---

## 4. Componentes Canonicos

**Card base**
- `bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100`
- Hover: `lg:hover:shadow-lg lg:hover:border-primary/20`

**Boton primario**
- `bg-primary hover:bg-red-700 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]`

**Boton secundario**
- `bg-white border border-primary text-primary font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-all`

**Boton ghost**
- `bg-gray-50 text-gray-600 border border-gray-200`

**Input / Select / Textarea**
- `bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary`

**Badge / Status**
- `text-[10px] font-semibold border px-2 py-0.5 rounded-full`

**Acordeon Header**
- Layout: titulo + badge + icono `ChevronDown` con rotacion
- Icono: `w-4 h-4 text-gray-400 transition-transform`

**Stepper de cantidad**
- Contenedor: `bg-gray-50 rounded-lg border border-gray-200`
- Botones: `w-7 h-7 md:w-10 md:h-10 bg-white rounded-md`

**Floating CTA**
- `rounded-full shadow-lg border border-white/20 bg-primary text-white`

---

## 5. Iconografia

- Inline label: `size={12}`
- Boton regular: `size={16}`
- Accion principal: `size={20}`
- Hero/Icono destacado: `size={24}`

**Regla:** No mezclar tamanos arbitrarios.

---

## 6. Micro-interacciones

- `transition-all duration-200 ease-out`
- Hover solo en desktop: usar `lg:hover:*`
- Active: `active:scale-[0.98]` en CTAs
- Focus: `focus:ring-1 focus:ring-primary`

---

## 7. Layout y Contenedores

- Contenedor principal: `max-w-md md:max-w-5xl mx-auto`
- Fondo global: `bg-gray-100` (shell), superficie interna `bg-white`

---

## 8. Reglas de Gobernanza Local

1. Ninguna vista puede definir estilos que contradigan esta skill.
2. Si un componente no encaja, se actualiza esta skill antes de implementar.
3. Evitar estilos ad-hoc por pagina.

---

## 9. Integracion con otras skills

- `ui-visual-system` (global): esta skill es su especializacion local.
- `menu-ui-mobile`: reglas tactiles y mobile-first.
- `responsive-design-testing`: validacion de consistencia por breakpoint.

---

## Resumen Ejecutivo

Este documento es la fuente unica de verdad visual del proyecto. Todas las vistas y componentes deben alinearse a estos tokens, jerarquias y patrones.
