/* ============================================================
   MENU UI MOBILE SKILL (menu-ui-mobile.js)
   Gestiona interacciones y animaciones estilo App Nativa
   ============================================================ */

const MenuUI = (function () {
    const SCROLL_POSITIONS = {};
    const ANIMS = {
        in: 'animate__slideInRight',
        out: 'animate__slideOutLeft',
        backIn: 'animate__slideInLeft',
        backOut: 'animate__slideOutRight'
    };

    let container = null;

    function init(containerId) {
        container = document.getElementById(containerId);

        // --- Mobile Specific Tweaks ---
        // Eliminar delay de click (300ms) - Modern browsers do this via viewport meta, but ensuring touch-action: manipulation helps
        document.body.style.touchAction = 'manipulation';

        // Mejorar feedback visual de taps
        _setupTouchFeedback();
    }

    /* --- PRIVATE HELPERS --- */
    function _setupTouchFeedback() {
        // En iOS Safari, a veces el active state tiene delay. Esto puede forzarlo.
        document.addEventListener("touchstart", function () { }, true);
    }

    /* --- PUBLIC METHODS --- */

    function saveScrollPosition(level) {
        SCROLL_POSITIONS[level] = window.scrollY;
    }

    function restoreScrollPosition(level) {
        const pos = SCROLL_POSITIONS[level] || 0;
        // Pequeño delay para permitir renderizado
        setTimeout(() => {
            window.scrollTo({ top: pos, behavior: 'auto' }); // Instant jump, no smooth scroll here
        }, 10);
    }

    /**
     * Prepara el contenedor para una transición.
     * Retorna una promesa que se resuelve cuando la animación de salida termina (opcional)
     * O simplemente aplica clases para la entrada del nuevo contenido.
     */
    async function prepareTransition(direction) {
        if (!container) return;

        // Limpiar animaciones previas
        container.classList.remove(ANIMS.in, ANIMS.out, ANIMS.backIn, ANIMS.backOut);

        // Forzar reflow para reiniciar animaciones CSS si es necesario
        void container.offsetWidth;

        if (direction === 'forward') {
            container.classList.add(ANIMS.in);
        } else if (direction === 'backward') {
            container.classList.add(ANIMS.backIn);
        }
    }

    function showLoading() {
        if (!container) return;
        container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
            </div>`;
    }

    return {
        init,
        saveScrollPosition,
        restoreScrollPosition,
        prepareTransition,
        showLoading
    };

})();
