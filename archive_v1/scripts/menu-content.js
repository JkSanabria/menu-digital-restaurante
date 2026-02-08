/* ============================================================
   MENU CONTENT SKILL (menu-content.js)
   Gestiona la lógica detallada de productos, precios y atributos
   ============================================================ */

const MenuContent = (function () {

    // --- CONFIGURACIÓN ---
    const CONFIG = {
        currency: 'COP',
        locale: 'es-CO',
        icons: {
            'vegano': '<i class="fas fa-leaf text-success" title="Vegano"></i>',
            'picante': '<i class="fas fa-pepper-hot text-danger" title="Picante"></i>',
            'gluten-free': '<i class="fas fa-wheat-awn-circle-exclamation text-warning" title="Sin Gluten"></i>',
            'recomendado': '<i class="fas fa-star text-warning" title="Recomendado"></i>',
            'nuevo': '<span class="badge bg-info text-white">NUEVO</span>',
            // Default fallback
            'default': '<i class="fas fa-info-circle text-muted"></i>'
        },
        status: {
            'available': { text: '', class: '' },
            'sold_out': { text: 'AGOTADO', class: 'badge bg-secondary text-white ms-2' },
            'limited': { text: 'POCAS UNIDADES', class: 'badge bg-warning text-dark ms-2' }
        }
    };

    // --- FUNCIONES PÚBLICAS ---

    function formatPrice(price) {
        if (typeof price !== 'number') return '$0';
        return new Intl.NumberFormat(CONFIG.locale, {
            style: 'currency',
            currency: CONFIG.currency,
            maximumFractionDigits: 0 // En COP no solemos usar centavos
        }).format(price);
    }

    function getAttributeIcon(attrKey) {
        const key = attrKey.toLowerCase();
        return CONFIG.icons[key] || '';
    }

    function getProductStatusBadge(statusKey) {
        const status = CONFIG.status[statusKey] || CONFIG.status['available'];
        if (!status.text) return '';
        return `<span class="${status.class}">${status.text}</span>`;
    }

    function renderProductCardHTML(product) {
        const priceFormatted = formatPrice(product.price);
        const statusBadge = getProductStatusBadge(product.status);

        // Renderizar íconos de atributos (ej: Vegano, Picante)
        let iconsHTML = '';
        if (product.attributes && Array.isArray(product.attributes)) {
            iconsHTML = `<div class="product-attributes mb-2 gap-2 d-flex">
                ${product.attributes.map(attr => getAttributeIcon(attr)).join('')}
            </div>`;
        } else if (product.icons && Array.isArray(product.icons)) { // Compatibilidad con JSON anterior
            iconsHTML = `<div class="product-attributes mb-2 gap-2 d-flex">
                ${product.icons.map(icon => `<span class="badge bg-light text-dark border">${icon}</span>`).join('')}
            </div>`;
        }

        // Imagen con fallback
        const imageHTML = product.image
            ? `<div class="product-img-wrapper">
                 <img src="${product.image}" class="product-img rounded" alt="${product.name}" onerror="this.src='https://placehold.co/100x100?text=Sin+Foto'">
               </div>`
            : '';

        // Estilos para productos agotados (Visualmente deshabilitados)
        const isSoldOut = product.status === 'sold_out';
        const opacityClass = isSoldOut ? 'opacity-50' : '';
        const pointerEvents = isSoldOut ? 'pointer-events-none' : '';

        return `
        <div class="product-card d-flex gap-3 p-3 border-bottom position-relative ${opacityClass} ${pointerEvents}">
            ${imageHTML}
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start mb-1">
                    <h6 class="fw-bold mb-0 text-dark pr-2">${product.name} ${statusBadge}</h6>
                    <span class="price-tag flex-shrink-0">${priceFormatted}</span>
                </div>
                
                ${iconsHTML}

                <p class="small text-muted mb-2 line-clamp-2" style="font-size: 0.9rem;">${product.description || ''}</p>
                
                ${product.ingredients ? `<p class="ingredients-text x-small text-secondary fst-italic mb-2"><i class="fas fa-flask text-muted me-1"></i> ${product.ingredients.join(', ')}</p>` : ''}

                ${!isSoldOut ? `
                <button class="whatsapp-btn-sm btn btn-sm btn-outline-success rounded-pill px-3 mt-1" 
                    onclick="event.stopPropagation(); MenuWhatsApp.openChat('${product.name}', ${product.price})">
                    <i class="fab fa-whatsapp me-1"></i> Pedir
                </button>` : ''}
            </div>
        </div>
        `;
    }

    /**
     * Renderiza una lista completa de productos en el contenedor dado.
     * @param {HTMLElement} container - Elemento del DOM donde renderizar.
     * @param {Array} products - Array de objetos producto.
     */
    function renderProductList(container, products) {
        if (!container || !products || products.length === 0) {
            container.innerHTML = '<div class="text-center p-4 text-muted">No hay productos disponibles en esta categoría.</div>';
            return;
        }

        const listHTML = `<div class="product-list-container d-flex flex-column gap-0 bg-white rounded shadow-sm border">
            ${products.map(p => renderProductCardHTML(p)).join('')}
        </div>`;

        container.innerHTML = listHTML;
    }

    return {
        formatPrice,
        renderProductList,
        renderProductCardHTML // Expuesto por si se necesita individualmente
    };

})();
