/* ============================================================
   MENU WHATSAPP SKILL (menu-whatsapp.js)
   Gestiona la generación de mensajes y enlaces de WhatsApp
   ============================================================ */

const MenuWhatsApp = (function () {

    // --- CONFIGURACIÓN POR DEFECTO ---
    let CONFIG = {
        phoneNumber: '573219460060', // Ejemplo (admin configurable)
        messageTemplate: 'Hola, quisiera pedir *{product}* ({price}).',
        groupOrders: false // Futuro: Permitir "Carrito"
    };

    // --- FUNCIONES PÚBLICAS ---

    function init(userConfig) {
        if (userConfig) {
            CONFIG = { ...CONFIG, ...userConfig };
        }
    }

    function _formatMessage(product) {
        let msg = CONFIG.messageTemplate;
        msg = msg.replace('{product}', product.name || 'Producto');

        // Formato precio si viene formateado o número
        let priceText = '';
        if (typeof product.price === 'number') {
            priceText = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price);
        } else {
            priceText = product.price || '';
        }
        msg = msg.replace('{price}', priceText);

        return encodeURIComponent(msg);
    }

    function getLink(product) {
        if (!product) return '#';
        const phone = CONFIG.phoneNumber.replace(/\+/g, '').replace(/\s/g, ''); // Limpiar número
        const text = _formatMessage(product);

        // Detectar dispositivo para usar api.whatsapp o wa.me (aunque wa.me es universal)
        return `https://wa.me/${phone}?text=${text}`;
    }

    function openChat(productName, productPrice) {
        const product = { name: productName, price: productPrice };
        const url = getLink(product);
        window.open(url, '_blank');
    }

    /**
     * Retorna el handler para el botón onclick
     * @param {Object} product - Objeto producto completo
     */
    function handleOrderClick(product) {
        const url = getLink(product);

        // Tracking super básico (si existiera Analytics)
        console.log(`[WhatsApp Order] Click en: ${product.name}`);

        window.open(url, '_blank');
    }

    return {
        init,
        getLink,
        handleOrderClick,
        openChat // Helper manual
    };

})();
