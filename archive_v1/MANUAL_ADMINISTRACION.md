# Manual de Administración - Menú Digital

Este documento guía al administrador del restaurante sobre cómo actualizar precios, productos y disponibilidad en su Menú Digital sin necesidad de conocimientos técnicos de programación.

## 1. Acceso al Modo Edición

El Menú Digital incluye un **"Modo Administrador"** oculto para realizar cambios rápidos.

1.  Abra su menú digital en un navegador (computadora o tablet recomendada).
2.  Haga clic en el **botón flotante azul con el ícono de un lápiz** ubicado en la esquina inferior derecha.
3.  Verá aparecer una **barra de herramientas negra** en la parte inferior de la pantalla indicando que el "Modo Edición" está activo.

## 2. Editar Productos

Una vez activo el modo edición, todos los productos mostrarán un pequeño botón amarillo con un lápiz.

### Para modificar un producto:
1.  Navegue por el menú hasta encontrar el producto que desea cambiar.
2.  Haga clic en el botón amarillo **"Editar"** sobre la tarjeta del producto.
3.  Se abrirá una ventana emergente con la información actual:
    *   **Nombre:** Nombre del plato o bebida.
    *   **Precio:** Valor numérico (sin puntos ni signos, ej: `15000`).
    *   **Descripción:** Detalle de ingredientes o presentación.
    *   **Estado:** Cambie entre **"Disponible"** y **"Agotado"** (esto mostrará una etiqueta gris y deshabilitará los pedidos por WhatsApp).
4.  Realice los cambios necesarios y presione **"Guardar"**.

## 3. Publicar Cambios

El sistema funciona con un archivo de configuración seguro (`menu_structure.json`). Para que sus cambios sean visibles para todos los clientes, debe guardar y actualizar este archivo.

1.  En la barra de herramientas inferior (Modo Edición), haga clic en el botón **"Guardar JSON"**.
2.  Se descargará automáticamente un archivo llamado `menu_structure.json` a su dispositivo.
3.  **Para hacer públicos los cambios:**
    *   **Opción A (Autogestión):** Reemplace el archivo `data/menu_structure.json` en la carpeta de su proyecto con el nuevo archivo descargado.
    *   **Opción B (Soporte):** Envíe este archivo a su encargado de sistemas o cárguelo en su plataforma de hosting si dispone de una.

## 4. Gestión de Pedidos por WhatsApp

Los pedidos llegan directamente al número de WhatsApp configurado.

*   **Número actual:** `+57 321 946 0060`
*   **Mensaje que recibe:** "Hola, quisiera pedir *Nombre Producto* ($Precio)."
*   **Nota:** Si necesita cambiar el número de recepción de pedidos, contacte a soporte técnico para actualizar la configuración global del sistema.

---
**Soporte Técnico**
Si experimenta problemas o necesita agregar nuevas categorías principales, contacte a su administrador de sistemas.
