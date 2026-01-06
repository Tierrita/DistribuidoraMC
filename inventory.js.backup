// ============================================
// SISTEMA DE INVENTARIO V3 - Distribuidora MC
// Con Gestión Simplificada de Productos + Supabase
// ============================================

// Variables globales
let inventory = [];
let editingProductId = null;

// Contadores autoincrementales (solo para fallback)
let nextProductId = 1;

// Flag para saber si Supabase está disponible
let useSupabase = false;

// Elementos del DOM - Productos
const inventoryTableBody = document.getElementById('inventoryTableBody');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const btnAddProduct = document.getElementById('btnAddProduct');
const modalClose = document.getElementById('modalClose');
const btnCancel = document.getElementById('btnCancel');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const modalTitle = document.getElementById('modalTitle');

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación...');
    
    // Verificar si Supabase está disponible
    if (typeof window.supabaseDB !== 'undefined') {
        try {
            const connected = await window.supabaseDB.verificarConexion();
            if (connected) {
                useSupabase = true;
                console.log('✅ Modo Supabase activado');
                await loadDataFromSupabase();
            } else {
                console.log('⚠️ Supabase no disponible, usando LocalStorage');
                loadDataFromLocalStorage();
            }
        } catch (error) {
            console.log('⚠️ Error con Supabase, usando LocalStorage:', error);
            loadDataFromLocalStorage();
        }
    } else {
        console.log('ℹ️ Usando LocalStorage (Supabase no configurado)');
        loadDataFromLocalStorage();
    }
    
    console.log('📦 Total productos cargados:', inventory.length);
    console.log('📋 Productos:', inventory);
    
    renderInventory();
    updateStats();
    initializeEventListeners();
});

// ============================================
// CARGA DE DATOS
// ============================================

async function loadDataFromSupabase() {
    try {
        // Cargar productos
        const prods = await window.supabaseDB.getProductos();
        
        inventory = prods.map(prod => ({
            id: prod.id,
            name: prod.name,
            brand: prod.brand || '',
            category: prod.category || '',
            weight: parseFloat(prod.weight) || 0,
            pricePerKg: parseFloat(prod.price_per_kg) || 0,
            costPrice: parseFloat(prod.cost_price) || 0,
            salePrice: parseFloat(prod.sale_price) || 0
        }));
        
        // Actualizar variable global para pedidos
        window.inventory = inventory;
        
        console.log(`✅ Cargados ${inventory.length} productos desde Supabase`);
    } catch (error) {
        console.error('Error al cargar datos de Supabase:', error);
        throw error;
    }
}

function loadDataFromLocalStorage() {
    loadInventoryFromStorage();
    
    // Agregar productos de ejemplo si está vacío
    if (inventory.length === 0) {
        addSampleProducts();
    }
}

// ============================================
// ALMACENAMIENTO
// ============================================

function saveInventoryToStorage() {
    localStorage.setItem('distributoraMC_inventory', JSON.stringify(inventory));
    localStorage.setItem('distributoraMC_nextProductId', nextProductId.toString());
    // Actualizar inventario global para pedidos
    window.inventory = inventory;
}

function loadInventoryFromStorage() {
    const stored = localStorage.getItem('distributoraMC_inventory');
    if (stored) {
        inventory = JSON.parse(stored);
        window.inventory = inventory;
    }
    
    // Cargar el siguiente ID o calcularlo
    const storedNextId = localStorage.getItem('distributoraMC_nextProductId');
    if (storedNextId) {
        nextProductId = parseInt(storedNextId);
    } else {
        // Calcular el siguiente ID basado en el máximo existente
        nextProductId = inventory.length > 0 
            ? Math.max(...inventory.map(p => p.id)) + 1 
            : 1;
    }
}

// ============================================
// PRODUCTOS DE EJEMPLO
// ============================================

function addSampleProducts() {
    inventory = [
        {
            id: nextProductId++,
            name: 'Jamón Cocido Premium',
            brand: 'La Serenísima',
            weight: 0.5,
            pricePerKg: 5000,
            costPrice: 2000,
            salePrice: 2500
        },
        {
            id: nextProductId++,
            name: 'Queso Parmesano',
            brand: 'Gallo',
            weight: 0.3,
            pricePerKg: 10000,
            costPrice: 2500,
            salePrice: 3000
        },
        {
            id: nextProductId++,
            name: 'Salame Milano',
            brand: 'Paladini',
            weight: 0.4,
            pricePerKg: 4500,
            costPrice: 1500,
            salePrice: 1800
        },
        {
            id: nextProductId++,
            name: 'Jamón Crudo Serrano',
            brand: 'Cagnoli',
            weight: 0.2,
            pricePerKg: 22500,
            costPrice: 3800,
            salePrice: 4500
        },
        {
            id: nextProductId++,
            name: 'Queso Roquefort',
            brand: 'Milkaut',
            weight: 0.25,
            pricePerKg: 11200,
            costPrice: 2400,
            salePrice: 2800
        },
        {
            id: nextProductId++,
            name: 'Pavita Natural',
            brand: 'Swift',
            weight: 0.6,
            pricePerKg: 2500,
            costPrice: 1200,
            salePrice: 1500
        }
    ];
    saveInventoryToStorage();
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', handleTabChange);
    });
function initializeEventListeners() {
    // Productos
    btnAddProduct.addEventListener('click', openModalForAdd);
    modalClose.addEventListener('click', closeProductModal);
    btnCancel.addEventListener('click', closeProductModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });
    productForm.addEventListener('submit', handleProductFormSubmit);
    searchInput.addEventListener('input', handleSearch);
}

// ============================================
// GESTIÓN DE PRODUCTOS
// ============================================
        return `
            <div class="category-card" style="border-left: 4px solid ${cat.color}">
                <div class="category-card-header">
                    <div class="category-icon" style="background: ${cat.color}20; color: ${cat.color}">
                        <i class="fas ${cat.icon}"></i>
                    </div>
                    <div class="category-info">
                        <h3>${cat.name}</h3>
                        <p class="category-slug">${cat.slug}</p>
                    </div>
                </div>
                <p class="category-description">${cat.description || 'Sin descripción'}</p>
                <div class="category-stats">
                    <div class="category-stat">
                        <i class="fas fa-box"></i>
                        <span><strong>${productCount}</strong> productos</span>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="btn-icon btn-edit" onclick="openCategoryModalForEdit(${cat.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteCategory(${cat.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
// ============================================
// GESTIÓN DE PRODUCTOS
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
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand || '';
        document.getElementById('productCategory').value = product.category || '';
        document.getElementById('productWeight').value = product.weight || 0;
        document.getElementById('productPricePerKg').value = product.pricePerKg || 0;
        document.getElementById('productCostPrice').value = product.costPrice || 0;
        document.getElementById('productSalePrice').value = product.salePrice || 0;
    }
    
    productModal.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
    productForm.reset();
    editingProductId = null;
}

async function handleProductFormSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value.trim(),
        brand: document.getElementById('productBrand').value.trim(),
        category: document.getElementById('productCategory').value,
        weight: parseFloat(document.getElementById('productWeight').value),
        pricePerKg: parseFloat(document.getElementById('productPricePerKg').value),
        costPrice: parseFloat(document.getElementById('productCostPrice').value),
        salePrice: parseFloat(document.getElementById('productSalePrice').value)
    };
    
    // ===== VALIDACIONES =====
    
    // 1. Validar nombre no vacío y longitud máxima
    if (productData.name.length === 0) {
        alert('El nombre del producto no puede estar vacío');
        document.getElementById('productName').focus();
        return;
    }
    
    if (productData.name.length > 100) {
        alert('El nombre del producto es demasiado largo (máximo 100 caracteres)');
        document.getElementById('productName').focus();
        return;
    }
    
    // 2. Validar marca no vacía
    if (productData.brand.length === 0) {
        alert('La marca del producto no puede estar vacía');
        document.getElementById('productBrand').focus();
        return;
    }
    
    // 2b. Validar categoría seleccionada
    if (!productData.category || productData.category === '') {
        alert('Debes seleccionar una categoría');
        document.getElementById('productCategory').focus();
        return;
    }
    
    // 3. Validar peso mayor a 0
    if (productData.weight <= 0 || isNaN(productData.weight)) {
        alert('El peso debe ser mayor a 0');
        document.getElementById('productWeight').focus();
        return;
    }
    
    // 4. Validar precio por kg mayor a 0
    if (productData.pricePerKg <= 0 || isNaN(productData.pricePerKg)) {
        alert('El precio por kg debe ser mayor a 0');
        document.getElementById('productPricePerKg').focus();
        return;
    }
    
    // 5. Validar precio de costo mayor a 0
    if (productData.costPrice <= 0 || isNaN(productData.costPrice)) {
        alert('El precio de costo debe ser mayor a 0');
        document.getElementById('productCostPrice').focus();
        return;
    }
    
    // 6. Validar precio de venta mayor a 0
    if (productData.salePrice <= 0 || isNaN(productData.salePrice)) {
        alert('El precio de venta debe ser mayor a 0');
        document.getElementById('productSalePrice').focus();
        return;
    }
    
    // 7. Validar precio máximo razonable
    if (productData.pricePerKg > 9999999 || productData.costPrice > 9999999 || productData.salePrice > 9999999) {
        alert('Uno de los precios es demasiado alto');
        return;
    }
    
    // 8. Validar peso máximo razonable
    if (productData.weight > 999) {
        alert('El peso es demasiado alto (máximo 999 kg)');
        document.getElementById('productWeight').focus();
        return;
    }
    
    // 9. Advertir si precio de venta es menor al precio de costo
    if (productData.salePrice < productData.costPrice) {
        if (!confirm('El precio de venta es menor al precio de costo. ¿Deseas continuar de todos modos?')) {
            return;
        }
    }
    
    // ===== FIN VALIDACIONES =====
    
    try {
        if (editingProductId) {
            // Editar producto existente
            if (useSupabase) {
                await window.supabaseDB.updateProducto(editingProductId, productData);
                await loadDataFromSupabase();
            } else {
                const index = inventory.findIndex(p => p.id === editingProductId);
                if (index !== -1) {
                    inventory[index] = { ...inventory[index], ...productData };
                    saveInventoryToStorage();
                }
            }
            alert('Producto actualizado correctamente');
        } else {
            // Agregar nuevo producto
            if (useSupabase) {
                await window.supabaseDB.addProducto(productData);
                await loadDataFromSupabase();
            } else {
                const newProduct = {
                    id: nextProductId++,
                    ...productData
                };
                inventory.push(newProduct);
                saveInventoryToStorage();
            }
            alert('Producto agregado correctamente');
        }
        
        renderInventory();
        updateStats();
        closeProductModal();
    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert('Error al guardar el producto');
    }
}

async function deleteProduct(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
        try {
            if (useSupabase) {
                await window.supabaseDB.deleteProducto(productId);
                await loadDataFromSupabase();
            } else {
                inventory = inventory.filter(p => p.id !== productId);
                saveInventoryToStorage();
            }
            
            renderInventory();
            updateStats();
            alert('Producto eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar el producto');
        }
    }
}

function renderInventory(productsToRender = inventory) {
    if (productsToRender.length === 0) {
        inventoryTableBody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const categoryLabels = {
        'quesos': 'Quesos',
        'fiambres': 'Fiambres',
        'embutidos': 'Embutidos',
        'conservas': 'Conservas',
        'aceitunas': 'Aceitunas'
    };
    
    inventoryTableBody.innerHTML = productsToRender.map(product => {
        const categoryDisplay = categoryLabels[product.category] || product.category || 'Sin categoría';
        return `
            <tr data-id="${product.id}">
                <td><span class="product-code">${product.id}</span></td>
                <td><strong>${product.name}</strong></td>
                <td>${product.brand || 'Sin marca'}</td>
                <td><span class="category-badge">${categoryDisplay}</span></td>
                <td>${product.weight ? product.weight.toFixed(3) : '0.000'} kg</td>
                <td class="price">$${product.pricePerKg ? product.pricePerKg.toFixed(2) : '0.00'}</td>
                <td class="price">$${product.costPrice ? product.costPrice.toFixed(2) : '0.00'}</td>
                <td class="price">$${product.salePrice ? product.salePrice.toFixed(2) : '0.00'}</td>
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
// FUNCIONES AUXILIARES
// ============================================

function getStockStatus(stock, minStock) {
    if (stock === 0) {
        return {
            class: 'out-of-stock',
            icon: 'fas fa-times-circle',
            text: 'Sin Stock'
        };
    } else if (stock <= minStock) {
        return {
            class: 'low-stock',
            icon: 'fas fa-exclamation-triangle',
            text: 'Stock Bajo'
        };
    } else {
        return {
            class: 'in-stock',
            icon: 'fas fa-check-circle',
            text: 'Disponible'
        };
    }
}

function updateStats() {
    const totalProducts = inventory.length;
    const totalValue = inventory.reduce((sum, p) => sum + (p.pricePerKg * p.weight), 0);
    
    const totalProductsEl = document.getElementById('totalProducts');
    const totalValueEl = document.getElementById('totalValue');
    
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (totalValueEl) totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = inventory.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.id.toString().includes(searchTerm)
    );
    renderInventory(filtered);
}

// ============================================
// FUNCIONES GLOBALES
// ============================================

window.openModalForEdit = openModalForEdit;
window.deleteProduct = deleteProduct;

// ============================================
// BÚSQUEDA Y ESTADÍSTICAS
// ============================================
    
    if (product.stock <= 0) {
        showNotification('Producto sin stock', 'error');
        return;
    }
    
    // Obtener o inicializar el carrito
    let cart = JSON.parse(localStorage.getItem('distributoraMC_cart') || '[]');
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > product.stock) {
            showNotification('No hay más stock disponible', 'error');
            return;
        }
        existingItem.quantity = newQuantity;
        showNotification(`+1 ${product.name} al pedido (Total: ${newQuantity})`, 'success');
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            code: product.code,
            price: product.price,
            quantity: 1,
            category: product.category
        });
        showNotification(`✓ ${product.name} agregado al pedido`, 'success');
    }
    
    // Guardar carrito
    localStorage.setItem('distributoraMC_cart', JSON.stringify(cart));
    
    // Actualizar badge del carrito
    updateCartBadgeFromInventory(cart);
    
    // Efecto visual en la fila
    const row = document.querySelector(`tr[data-id="${productId}"]`);
    if (row) {
        row.classList.add('row-added');
        setTimeout(() => row.classList.remove('row-added'), 600);
    }
}

function updateCartBadgeFromInventory(cart) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

window.quickAddToOrder = quickAddToOrder;

// ============================================
// INICIALIZACIÓN
// ============================================
// UTILIDADES DE DEBUGGING
// ============================================

// Función para ver el estado actual de los IDs
window.showIdStatus = function() {
    console.log('=== ESTADO DE IDS ===');
    console.log('Próximo ID de Producto:', nextProductId);
    console.log('Total de Productos:', inventory.length);
    console.log('IDs de Productos:', inventory.map(p => p.id).sort((a, b) => a - b));
};
