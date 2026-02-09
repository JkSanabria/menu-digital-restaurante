/* ============================================================
   MENU ADMIN SKILL (menu-admin.js)
   Modo Edición para Gestionar Contenido Sin Código
   ============================================================ */

const MenuAdmin = (function () {

    let isEditing = false;
    let currentMenuData = []; // Referencia local para editar

    // --- TEMPLATES ---
    const ADMIN_BAR_HTML = `
        <div id="admin-toolbar" class="d-none position-fixed bottom-0 start-0 w-100 bg-dark text-white p-3 shadow-lg d-flex justify-content-between align-items-center" style="z-index: 1050;">
            <span class="fw-bold"><i class="fas fa-tools me-2"></i> Modo Edición</span>
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-light" onclick="MenuAdmin.downloadJSON()"><i class="fas fa-download"></i> Guardar JSON</button>
                <button class="btn btn-sm btn-danger" onclick="MenuAdmin.toggleEditMode()"><i class="fas fa-times"></i> Salir</button>
            </div>
        </div>
        <button id="btn-admin-toggle" class="btn btn-primary rounded-circle shadow-lg position-fixed" style="bottom: 20px; right: 20px; z-index: 1040; width: 50px; height: 50px;" onclick="MenuAdmin.toggleEditMode()">
            <i class="fas fa-pen"></i>
        </button>
    `;

    const EDIT_MODAL_HTML = `
        <div class="modal fade" id="editProductModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Producto</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editProductForm">
                            <input type="hidden" id="edit-id">
                            <div class="mb-3">
                                <label class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="edit-name" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Precio</label>
                                <input type="number" class="form-control" id="edit-price" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Descripción</label>
                                <textarea class="form-control" id="edit-desc" rows="2"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Estado</label>
                                <select class="form-select" id="edit-status">
                                    <option value="available">Disponible</option>
                                    <option value="sold_out">Agotado</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" onclick="MenuAdmin.saveProductChanges()">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- FUNCIONES PÚBLICAS ---

    function init() {
        // Inyectar UI de admin
        document.body.insertAdjacentHTML('beforeend', ADMIN_BAR_HTML);
        document.body.insertAdjacentHTML('beforeend', EDIT_MODAL_HTML);
    }

    function toggleEditMode() {
        isEditing = !isEditing;
        const toolbar = document.getElementById('admin-toolbar');
        const toggleBtn = document.getElementById('btn-admin-toggle');

        if (isEditing) {
            toolbar.classList.remove('d-none');
            toggleBtn.classList.add('d-none');
            document.body.classList.add('admin-mode-active');
            _attachEditButtons();
        } else {
            toolbar.classList.add('d-none');
            toggleBtn.classList.remove('d-none');
            document.body.classList.remove('admin-mode-active');
            _removeEditButtons();
        }
    }

    function _attachEditButtons() {
        // Buscar todas las tarjetas de producto y añadir botón editar
        const products = document.querySelectorAll('.product-card');
        products.forEach(card => {
            if (!card.querySelector('.btn-edit-product')) {
                const editBtn = document.createElement('button');
                editBtn.className = 'btn btn-sm btn-warning btn-edit-product position-absolute top-0 end-0 m-2';
                editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
                editBtn.style.zIndex = '10';

                // Obtener datos del producto (simulado por ahora, idealmente data-id)
                // En una app real, el ID estaría en el DOM. Aquí asumimos el contexto.
                // Como es demo, solo mostramos el alert
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    _openEditModal(card);
                };

                card.appendChild(editBtn);
            }
        });
    }

    function _removeEditButtons() {
        document.querySelectorAll('.btn-edit-product').forEach(btn => btn.remove());
    }

    function _openEditModal(cardElement) {
        // Extraer datos visuales para rellenar (Hack rápido para MVP sin store global accesible directo)
        const name = cardElement.querySelector('h6').innerText.split('\n')[0]; // Limpiar badges
        const price = cardElement.querySelector('.price-tag').innerText.replace(/[^0-9]/g, '');
        const desc = cardElement.querySelector('p.small').innerText;

        document.getElementById('edit-name').value = name;
        document.getElementById('edit-price').value = price;
        document.getElementById('edit-desc').value = desc;

        const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
        modal.show();
    }

    function saveProductChanges() {
        alert('En esta demo, los cambios se guardarían en el JSON local y se repintaría la vista.');
        // Aquí iría la lógica de actualizar `menuData` en memoria y llamar a `renderCurrentLevel`
        const modalEl = document.getElementById('editProductModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }

    function downloadJSON() {
        // Simulación de descarga
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ status: 'ok', msg: 'Aquí iría el JSON completo' }));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "menu_structure.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    return {
        init,
        toggleEditMode,
        saveProductChanges,
        downloadJSON
    };

})();

// Auto-init para demo
document.addEventListener('DOMContentLoaded', () => setTimeout(MenuAdmin.init, 1000));
