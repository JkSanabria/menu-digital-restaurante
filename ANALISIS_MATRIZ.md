# Matriz impacto/esfuerzo (analisis)

Contexto: proyecto 100% frontend para compilar el pedido y enviarlo por WhatsApp. No hay BD ni persistencia de carrito.

## Impacto alto / esfuerzo bajo
- Consistencia de busqueda con normalizacion unificada (acentos y errores comunes).
- Mensaje claro para combinadas: "Solo Mediana y Familiar".
- Claridad visual en productos con nota (explicar que es linea distinta).

## Impacto alto / esfuerzo medio
- Centralizar formatPrice y utilidades comunes.
- Tipado de paymentDetails y estructura del resumen del pedido.
- Reglas de combinadas desde datos (combinationAllowedSizes).

## Impacto medio / esfuerzo bajo
- Unificar etiquetas/badges para reglas de negocio (combinar, notas, tamanos).

## Impacto medio / esfuerzo medio
- Pizzas como seccion normal con reglas declarativas en menu.json.
