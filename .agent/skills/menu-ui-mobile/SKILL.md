---
name: menu-ui-mobile
description: Skill para optimizar la experiencia de usuario en dispositivos móviles (Look & Feel de App Nativa).
---

# `menu-ui-mobile` Skill

## Propósito
Optimizar la experiencia mobile-first para React + Tailwind, con tactilidad, feedback inmediato y transiciones suaves tipo app nativa.

## Responsabilidades
1. **Touch Targets**: Tamaño minimo 44x44px en botones e iconos interactivos.
2. **Feedback Tactil**: Usar `active:scale-[0.98]` y cambios de color inmediatos.
3. **Estados Hover**: Solo en desktop con `lg:hover:*`.
4. **Elementos Sticky**: Header y CTA flotante accesibles sin bloquear contenido.
5. **Transiciones**: `transition-all duration-200` y animaciones de entrada suaves para modales.
6. **Scroll**: Evitar scroll horizontal y usar `overflow-hidden` en contenedores criticos.

## Reglas Practicas (Tailwind)

- Botones: `py-3 px-4` o `w-10 h-10` como minimo
- Inputs: `text-sm` en mobile y `md:text-base`
- Acciones flotantes: `rounded-full`, sombra y borde suave
- Hover solo desktop: `lg:hover:shadow-lg`, `lg:hover:border-primary/20`

## Integracion

- **Con `menu-visual-system`**: Esta skill hereda tokens y patrones visuales.
- **Con `responsive-design-testing`**: Validar en 375px, 768px y 1280px.

## Checklist Mobile

- [ ] Botones tactiles (>=44px)
- [ ] Texto legible en mobile (>= `text-sm`)
- [ ] Sin hover en mobile
- [ ] Modal visible sin overflow horizontal
