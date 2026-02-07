/* ============================================================
   MENU HIERARCHY SKILL (menu-hierarchy.js)
   Gestiona la navegación SPA entre niveles del menú
   ============================================================ */

const MenuHierarchy = (function () {
    let menuData = [];
    let navigationStack = []; // Pila para historial: [{level: 1, id: null, title: 'Inicio'}]
    let container = null;

    // --- FUNCIONES PÚBLICAS ---

    async function initMenu(containerId, dataUrl) {
        container = document.getElementById(containerId);
        if (!container) return console.error('Menu UI: Container not found');

        try {
            const response = await fetch(dataUrl);
            menuData = await response.json();
            navigationStack = [{ level: 1, id: null, title: 'Inicio' }]; // Inicializar Home
            renderCurrentLevel();
            renderBreadcrumbs();
        } catch (error) {
            console.error('Error loading menu data:', error);
            container.innerHTML = '<div class="alert alert-danger">Error cargando el menú. Intente nuevamente.</div>';
        }

        // Init UI Skill
        if (typeof MenuUI !== 'undefined') {
            MenuUI.init(containerId);
        }
    }

    function navigateTo(level, id, title) {
        // Guardar Scroll Actual (del nivel que abandonamos)
        const currentLevelIdx = navigationStack[navigationStack.length - 1].level;
        if (typeof MenuUI !== 'undefined') MenuUI.saveScrollPosition(currentLevelIdx);

        // UI Transition
        if (typeof MenuUI !== 'undefined') MenuUI.prepareTransition('forward');

        // En lugar de manejar niveles fijos, apilamos la selección
        navigationStack.push({ level, id, title });

        // Render
        renderCurrentLevel();
        renderBreadcrumbs();

        // Reset Scroll para nueva vista
        window.scrollTo(0, 0);
    }

    function goBack() {
        if (navigationStack.length > 1) {
            // UI Transition
            if (typeof MenuUI !== 'undefined') MenuUI.prepareTransition('backward');

            navigationStack.pop();
            renderCurrentLevel();
            renderBreadcrumbs();

            // Restaurar Scroll del nivel al que volvemos
            const currentLevelIdx = navigationStack[navigationStack.length - 1].level;
            if (typeof MenuUI !== 'undefined') MenuUI.restoreScrollPosition(currentLevelIdx);
        }
    }

    // --- RENDERIZADO (LÓGICA INTERNA) ---

    function renderBreadcrumbs() {
        const breadcrumbContainer = document.getElementById('breadcrumb-nav');
        if (!breadcrumbContainer) return;

        let html = '';
        // Botón atrás si no estamos en home
        if (navigationStack.length > 1) {
            html += `<button onclick="MenuHierarchy.goBack()" class="btn-back"><i class="fas fa-arrow-left"></i> Volver</button>`;
        }

        // Título actual
        const current = navigationStack[navigationStack.length - 1];
        html += `<h2 class="current-title">${current.title}</h2>`;

        breadcrumbContainer.innerHTML = html;
    }

    function renderCurrentLevel() {
        const current = navigationStack[navigationStack.length - 1];
        let itemsToRender = [];
        let renderType = 'category'; // 'category' (cards) o 'product' (list)

        // LÓGICA DE NAVEGACIÓN
        if (current.level === 1) {
            // Nivel 1: Secciones Principales (Root)
            itemsToRender = menuData;
            renderType = 'category';

        } else if (current.level === 2) {
            // Nivel 2: Subcategorías de una Sección (P.Ej: Bebidas -> Calientes, Frías)
            // Buscar la sección padre en el root
            const parentSection = menuData.find(s => s.id === current.id);
            if (parentSection && parentSection.subcategories) {
                itemsToRender = parentSection.subcategories;
                renderType = 'category';
            }

        } else if (current.level === 3) {
            // Nivel 3: Categorías Finales de una Subcategoría (P.Ej: Calientes -> Café, Té)
            // Buscar: Sección -> Subcategoría -> Categoría Final
            // Aquí el ID actual es de la Subcategoría padre
            // Necesitamos rastrear desde arriba. Usamos el stack para hallar el padre del padre.

            const sectionId = navigationStack[1].id; // Nivel 1 ID
            const subId = current.id; // Nivel 2 ID (Subcategoría actual)

            const section = menuData.find(s => s.id === sectionId);
            const sub = section?.subcategories.find(sb => sb.id === subId);

            if (sub && sub.categories) {
                itemsToRender = sub.categories;
                // Si la categoría final tiene productos directos, renderizamos productos
                // PERO la estructura dice: Sub -> Categories (Array) -> cada una tiene Products
                // Así que al entrar en Nivel 3 mostramos las categorías finales (Café, Té)
                renderType = 'category-final';
            }
        } else if (current.level === 4) {
            // Nivel 4: Productos de una Categoría Final (P.Ej: Café -> Espresso, Cappuccino)
            // ID actual es de la Categoría Final
            const sectionId = navigationStack[1].id;
            const subId = navigationStack[2].id;
            const catId = current.id;

            const section = menuData.find(s => s.id === sectionId);
            const sub = section?.subcategories.find(sb => sb.id === subId);
            const cat = sub?.categories.find(c => c.id === catId);

            if (cat && cat.products) {
                itemsToRender = cat.products;
                renderType = 'product';
            }
        }

        // GENERAR HTML
        if (!itemsToRender || itemsToRender.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">No hay elementos en esta categoría.</p>';
            return;
        }

        let html = `<div class="${renderType === 'product' ? 'product-list' : 'category-grid'}">`;

        itemsToRender.forEach(item => {
            if (renderType === 'category') {
                // Card de Navegación (Nivel 1 y 2)
                html += `
                <div class="category-card" onclick="MenuHierarchy.navigateTo(${current.level + 1}, '${item.id}', '${item.name}')">
                    ${item.image ? `<img src="${item.image}" class="card-img-top" alt="${item.name}">` : ''}
                    <div class="card-body text-center">
                        <h5 class="card-title fw-bold m-0">${item.name}</h5>
                    </div>
                </div>
                `;
            } else if (renderType === 'category-final') {
                // Card de Categoría Final (Nivel 3) -> Lleva a Productos
                html += `
                <div class="category-card final-level" onclick="MenuHierarchy.navigateTo(${current.level + 1}, '${item.id}', '${item.name}')">
                    <div class="card-body text-center d-flex align-items-center justify-content-between">
                        <h5 class="card-title fw-bold m-0">${item.name}</h5>
                        <i class="fas fa-chevron-right text-muted"></i>
                    </div>
                </div>
                `;
            } else {
                // Producto (Nivel 4)
                // OJO: Aquí se integrará con 'menu-content' skill más adelante. Por ahora render básico.
                html += renderProductCard(item);
            }
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Helper render producto (Integrado con menu-content skill)
    function renderProductCard(product) {
        // Delegar al nuevo Skill si existe, sino fallback
        if (typeof MenuContent !== 'undefined') {
            return MenuContent.renderProductCardHTML(product);
        }

        // Fallback básico (legacy)
        return `
        <div class="product-card d-flex gap-3 p-3 border-bottom">
            ${product.image ? `<img src="${product.image}" class="rounded" style="width: 80px; height: 80px; object-fit: cover;">` : ''}
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start">
                    <h6 class="fw-bold mb-1">${product.name}</h6>
                    <span class="price-tag">$${product.price}</span>
                </div>
                <p class="small text-muted mb-2">${product.description}</p>
            </div>
        </div>
        `;
    }

    return {
        initMenu,
        navigateTo,
        goBack
    };

})();

// Auto-init si se desea
// document.addEventListener('DOMContentLoaded', () => MenuHierarchy.initMenu('menu-container', 'data/menu_structure.json'));
