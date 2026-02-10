---
name: menu-content
description: Skill para gestionar y enriquecer el contenido de los productos (precios, ingredientes, alérgenos, disponibilidad).
---

# `menu-content` Skill

## Propósito
Gestionar la presentacion de datos del producto en React + Tailwind, asegurando consistencia visual y contenido enriquecido sin logica de render directo.

## Responsabilidades
1. **Formato de Precios**: Usar un unico formateador (COP) para todo el proyecto.
2. **Disponibilidad**: Definir estados (disponible, agotado) y su representacion visual.
3. **Atributos**: Mapear etiquetas (picante, vegano, etc.) a badges/iconeo consistente.
4. **Descripcion**: Truncado/expandido con reglas claras.
5. **Imagenes**: Fallback visual y manejo de imagenes faltantes.

## Reglas de Visualizacion

- Precios siempre en negrita y color de marca.
- Estados de disponibilidad usan badges con borde y color consistente.
- Atributos se muestran como chips o iconos segun el sistema visual.

## Integracion

- **menu-visual-system**: patrones de cards, badges e iconos.
- **menu-hierarchy**: jerarquia determina que productos se muestran.

## Nota
Esta skill no define HTML ni depende de librerias externas (ej: FontAwesome).

## Estructura de Datos (Producto)
El skill espera objetos de producto con esta forma:
```json
{
  "id": "p1",
  "name": "Nombre Producto",
  "price": 10000,
  "description": "Descripción corta...",
  "status": "available", // available, sold_out
  "attributes": ["spicy", "vegan"], // Claves para íconos
  "image": "url..."
}
```

## Dependencias
-   Se integra en el flujo de `menu-hierarchy` (Nivel 4).
-   Requiere Iconos (FontAwesome) cargados en `index.html`.
