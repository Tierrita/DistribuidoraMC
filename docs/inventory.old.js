// ============================================
// SISTEMA DE INVENTARIO - Distribuidora MC
// ============================================

// Variables globales
let inventory = [];
let editingProductId = null;

// Elementos del DOM
const inventoryTableBody = document.getElementById('inventoryTableBody');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const btnAddProduct = document.getElementById('btnAddProduct');
const modalClose = document.getElementById('modalClose');
const btnCancel = document.getElementById('btnCancel');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const emptyState = document.getElementById('emptyState');
const modalTitle = document.getElementById('modalTitle');

// Cargar datos del localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadInventoryFromStorage();
    renderInventory();
    updateStats();
    initializeEventListeners();
    
    // Agregar productos de ejemplo si está vacío
    if (inventory.length === 0) {
        addSampleProducts();
    }
});

// ============================================
// FUNCIONES DE ALMACENAMIENTO
// ============================================

function saveInventoryToStorage() {
    localStorage.setItem('distributoraMC_inventory', JSON.stringify(inventory));
}

function loadInventoryFromStorage() {
    const stored = localStorage.getItem('distributoraMC_inventory');
    if (stored) {
        inventory = JSON.parse(stored);
    }
}

// ============================================
// PRODUCTOS DE EJEMPLO
// ============================================

function addSampleProducts() {
    inventory = [
        {
            id: Date.now() + 1,
            code: 'JAM001',
            name: 'Jamón Cocido Premium',
            category: 'jamones',
            price: 2500,
            stock: 45,
            minStock: 20
        },
        {
            id: Date.now() + 2,
            code: 'QUE001',
            name: 'Queso Parmesano',
            category: 'quesos',
            price: 3200,
            stock: 15,
            minStock: 10
        },
        {
            id: Date.now() + 3,
            code: 'EMB001',
            name: 'Salame Milano',
            category: 'embutidos',
            price: 1800,
            stock: 8,
            minStock: 15
        },
        {
            id: Date.now() + 4,
            code: 'JAM002',
            name: 'Jamón Crudo Serrano',
            category: 'jamones',
            price: 4500,
            stock: 25,
            minStock: 10
        },
        {
            id: Date.now() + 5,
            code: 'QUE002',
            name: 'Queso Roquefort',
            category: 'quesos',
            price: 2800,
            stock: 30,
            minStock: 15
        },
        {
            id: Date.now() + 6,
            code: 'CAR001',
            name: 'Pavita Natural',
            category: 'carnes',
            price: 1500,
            stock: 5,
            minStock: 20
        }
    ];
    saveInventoryToStorage();
    renderInventory();
    updateStats();
}

// ============================================
// INICIALIZAR EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Botón agregar producto
    btnAddProduct.addEventListener('click', openModalForAdd);
    
    // Cerrar modal
    modalClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    
    // Click fuera del modal
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeModal();
        }
    });
    
    // Submit del formulario
    productForm.addEventListener('submit', handleFormSubmit);
    
    // Búsqueda
    searchInput.addEventListener('input', handleSearch);
    
    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModalForAdd() {
    editingProductId = null;
    modalTitle.textContent = 'Agregar Producto';
    productForm.reset();
    productModal.classList.add('active');
}

function openModalForEdit(productId) {
    editingProductId = productId;
    modalTitle.textContent = 'Editar Producto';
    
    const product = inventory.find(p => p.id === productId);
    if (product) {
        document.getElementById('productCode').value = product.code;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productMinStock').value = product.minStock;
    }
    
    productModal.classList.add('active');
}

function closeModal() {
    productModal.classList.remove('active');
    productForm.reset();
    editingProductId = null;
}

// ============================================
// FORM HANDLING
// ============================================

function handleFormSubmit(e) {
    e.preventDefault();
    
    const productData = {
        code: document.getElementById('productCode').value.trim().toUpperCase(),
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        minStock: parseInt(document.getElementById('productMinStock').value)
    };
    
    if (editingProductId) {
        // Editar producto existente
        const index = inventory.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            inventory[index] = { ...inventory[index], ...productData };
            showNotification('Producto actualizado correctamente', 'success');
        }
    } else {
        // Agregar nuevo producto
        const newProduct = {
            id: Date.now(),
            ...productData
        };
        inventory.push(newProduct);
        showNotification('Producto agregado correctamente', 'success');
    }
    
    saveInventoryToStorage();
    renderInventory();
    updateStats();
    closeModal();
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderInventory(productsToRender = inventory) {
    if (productsToRender.length === 0) {
        inventoryTableBody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    inventoryTableBody.innerHTML = productsToRender.map(product => {
        const stockStatus = getStockStatus(product.stock, product.minStock);
        
        return `
            <tr data-id="${product.id}">
                <td><span class="product-code">${product.code}</span></td>
                <td><strong>${product.name}</strong></td>
                <td>
                    <span class="category-badge category-${product.category}">
                        ${getCategoryName(product.category)}
                    </span>
                </td>
                <td class="price">$${product.price.toFixed(2)}</td>
                <td><strong>${product.stock}</strong> unidades</td>
                <td>
                    <span class="stock-badge ${stockStatus.class}">
                        <i class="${stockStatus.icon}"></i>
                        ${stockStatus.text}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="openModalForEdit(${product.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================
// DELETE PRODUCT
// ============================================

function deleteProduct(productId) {
    const product = inventory.find(p => p.id === productId);
    
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
        inventory = inventory.filter(p => p.id !== productId);
        saveInventoryToStorage();
        renderInventory();
        updateStats();
        showNotification('Producto eliminado', 'success');
    }
}

// ============================================
// SEARCH AND FILTER
// ============================================

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = inventory.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm)
    );
    renderInventory(filtered);
}

function handleFilter(e) {
    const category = e.currentTarget.dataset.category;
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Filter products
    if (category === 'todos') {
        renderInventory(inventory);
    } else {
        const filtered = inventory.filter(p => p.category === category);
        renderInventory(filtered);
    }
}

// ============================================
// STATISTICS
// ============================================

function updateStats() {
    const totalProducts = inventory.length;
    const lowStock = inventory.filter(p => p.stock <= p.minStock && p.stock > 0).length;
    const normalStock = inventory.filter(p => p.stock > p.minStock).length;
    const totalValue = inventory.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStock').textContent = lowStock;
    document.getElementById('normalStock').textContent = normalStock;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getStockStatus(stock, minStock) {
    if (stock === 0) {
        return {
            class: 'stock-critical',
            icon: 'fas fa-times-circle',
            text: 'Sin Stock'
        };
    } else if (stock <= minStock) {
        return {
            class: 'stock-low',
            icon: 'fas fa-exclamation-triangle',
            text: 'Stock Bajo'
        };
    } else {
        return {
            class: 'stock-ok',
            icon: 'fas fa-check-circle',
            text: 'Stock OK'
        };
    }
}

function getCategoryName(category) {
    const categories = {
        jamones: 'Jamones',
        quesos: 'Quesos',
        embutidos: 'Embutidos',
        carnes: 'Carnes Frías',
        gourmet: 'Gourmet',
        pescados: 'Pescados'
    };
    return categories[category] || category;
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 0.8rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
                color: #065f46;
            }
            
            .notification-success i {
                color: #10b981;
                font-size: 1.2rem;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Hacer funciones globales para onclick
window.openModalForEdit = openModalForEdit;
window.deleteProduct = deleteProduct;

console.log('Sistema de Inventario MC cargado correctamente! 📦');
