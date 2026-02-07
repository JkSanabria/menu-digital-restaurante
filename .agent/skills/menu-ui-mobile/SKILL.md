---
name: menu-ui-mobile
description: Skill para optimizar la experiencia de usuario en dispositivos móviles (Look & Feel de App Nativa).
---

# `menu-ui-mobile` Skill

## Propósito
Esta skill asegura que la aplicación web se comporte y se sienta como una aplicación móvil nativa. Se enfoca en la usabilidad táctil, las transiciones suaves y la eliminación de fricción típica de la web (zoom, scroll elástico, delays).

## Responsabilidades
1.  **Optimización Viewport**: Prevenir el zoom accidental y asegurar que la escala sea 1:1.
2.  **Touch Feedback**: Implementar estados `:active` visuales inmediatos para emular la respuesta nativa.
3.  **Transiciones de Vista**: Animar el cambio entre niveles jerárquicos (slide in/out o fade) para dar contexto espacial.
4.  **Scroll Restoration**: Recordar la posición del scroll al volver atrás en la navegación.
5.  **Sticky Elements**: Mantener la barra de navegación y los breadcrumbs siempre visibles y accesibles.

## Métodos Públicos

### `init()`
Inicializa los listeners globales para la gestión de scroll y touch events.

### `animatePageTransition(direction)`
Ejecuta una animación CSS en el contenedor principal antes de cambiar el contenido.
-   `direction`: 'forward' (avanzar nivel) o 'backward' (retroceder).

### `restoreScrollPosition(level)`
Restaura la posición del scroll guardada para un nivel específico al regresar.

## Integración
-   Debe ser invocado por `menu-hierarchy.js` antes y después de `renderCurrentLevel`.
-   Requiere ajustes en `styles.css` para propiedades como `touch-action`, `-webkit-tap-highlight-color`, etc.
