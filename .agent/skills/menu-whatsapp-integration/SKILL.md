---
name: menu-whatsapp-integration
description: Skill para gestionar y generar enlaces dinámicos de pedidos vía WhatsApp.
---

# `menu-whatsapp-integration` Skill

## Propósito
Esta skill centraliza la lógica de interacción con WhatsApp, la herramienta principal de cierre de venta. Su objetivo es convertir la intención de compra del usuario (clic en "Pedir") en una conversación iniciada con el restaurante, enviando un mensaje preformateado y claro.

## Responsabilidades
1.  **Configuración de Contacto**: Permitir configurar el número de teléfono del restaurante (o múltiples según sucursal, si aplicara).
2.  **Generación de Enlaces**: Construir URLs `https://wa.me/` seguras y funcionales tanto en Desktop como Mobile.
3.  **Formato de Mensaje**: Crear plantillas de mensaje dinámicas (ej: "Hola, vi *Producto* en el menú digital y quisiera pedirlo.").
4.  **Tracking Básico**: (Opcional) Proveer hooks para medir cuántos clics se hacen en los botones de pedido.

## Métodos Públicos

### `init(config)`
Inicializa el módulo con la configuración del restaurante.
-   `config`: Objeto con `{ phoneNumber: '573001234567', defaultMessage: 'Hola...' }`.

### `getLink(product, options)`
Genera y retorna la URL completa para el botón de WhatsApp de un producto específico.
-   `product`: Objeto producto con `name`, `price`, etc.
-   `options`: Opciones adicionales como `variant` (ej: "Sin cebolla").

### `openChat(product)`
Abre directamente la ventana/app de WhatsApp con el mensaje prellenado para el producto dado.

## Integración
-   Debe ser consumido por `menu-content.js` al renderizar los botones de "Pedir".
-   Los botones en la UI deben llamar a `MenuWhatsApp.openChat(product)` o usar el link generado por `getLink`.
