// ============================================
// SISTEMA DE PEDIDOS CON PESO - Distribuidora MC
// Versión mejorada con Supabase
// ============================================

// Variables globales
let cart = [];
let orders = [];
let currentCustomerData = null;
let selectedProduct = null; // Producto seleccionado para agregar
let useSupabase = false;

// Elementos del DOM
let productsOrderGrid;
let orderSearchInput;
let emptyOrderState;
let posCartItems;
let posSubtotal;
let posTotal;
let posItemsCount;
let btnCheckoutPos;
let ordersHistoryGrid;
let customerDataSection;
let orderBuildSection;
let customerDataForm;
let displayCustomerName;
let displayCustomerAddress;

// Modal Agregar Producto
let addProductModal;
let addProductModalClose;
let btnCancelAddProduct;
let addProductForm;
let productWeightInput;
let modalProductName;
let modalProductBrand;
let modalProductPrice;
let modalProductWeight;
let modalSubtotal;

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    initializeDOMElements();
    initializeEventListeners();
    await checkSupabaseConnection();
    await loadDataFromSupabase();
    renderProductsForOrders();
    loadCategoryFilters();
    renderCart();
});

function initializeDOMElements() {
    // Grid de productos
    productsOrderGrid = document.getElementById('productsOrderGrid');
    orderSearchInput = document.getElementById('orderSearchInput');
    emptyOrderState = document.getElementById('emptyOrderState');
    
    // Carrito POS
    posCartItems = document.getElementById('posCartItems');
    posSubtotal = document.getElementById('posSubtotal');
    posTotal = document.getElementById('posTotal');
    posItemsCount = document.getElementById('posItemsCount');
    btnCheckoutPos = document.getElementById('btnCheckoutPos');
    
    // Historial
    ordersHistoryGrid = document.getElementById('ordersHistoryGrid');
    
    // Customer Data
    customerDataSection = document.getElementById('customerDataSection');
    orderBuildSection = document.getElementById('orderBuildSection');
    customerDataForm = document.getElementById('customerDataForm');
    displayCustomerName = document.getElementById('displayCustomerName');
    displayCustomerAddress = document.getElementById('displayCustomerAddress');
    
    // Modal Agregar Producto
    addProductModal = document.getElementById('addProductModal');
    addProductModalClose = document.getElementById('addProductModalClose');
    btnCancelAddProduct = document.getElementById('btnCancelAddProduct');
    addProductForm = document.getElementById('addProductForm');
    productWeightInput = document.getElementById('productWeightInput');
    modalProductName = document.getElementById('modalProductName');
    modalProductBrand = document.getElementById('modalProductBrand');
    modalProductPrice = document.getElementById('modalProductPrice');
    modalProductWeight = document.getElementById('modalProductWeight');
    modalSubtotal = document.getElementById('modalSubtotal');
}

function initializeEventListeners() {
    // Customer Data Form
    if (customerDataForm) {
        customerDataForm.addEventListener('submit', handleCustomerDataSubmit);
    }
    
    // Búsqueda de productos
    if (orderSearchInput) {
        orderSearchInput.addEventListener('input', handleProductSearch);
    }
    
    // Modal Agregar Producto
    if (addProductModalClose) {
        addProductModalClose.addEventListener('click', closeAddProductModal);
    }
    if (btnCancelAddProduct) {
        btnCancelAddProduct.addEventListener('click', closeAddProductModal);
    }
    if (addProductModal) {
        addProductModal.addEventListener('click', (e) => {
            if (e.target === addProductModal) closeAddProductModal();
        });
    }
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProductSubmit);
    }
    if (productWeightInput) {
        productWeightInput.addEventListener('input', updateModalSubtotal);
    }
    
    // Checkout
    if (btnCheckoutPos) {
        btnCheckoutPos.addEventListener('click', confirmNewOrder);
    }
}

// ============================================
// SUPABASE CONNECTION
// ============================================

async function checkSupabaseConnection() {
    if (typeof window.supabaseDB !== 'undefined') {
        useSupabase = true;
        console.log('✅ Modo Supabase activado');
    } else {
        console.warn('⚠️ Supabase no disponible');
    }
}

async function loadDataFromSupabase() {
    if (!useSupabase) return;
    
    try {
        const productos = await window.supabaseDB.getProductos();
        window.inventory = productos.map(prod => ({
            id: prod.id,
            code: prod.code,
            name: prod.name,
            brand: prod.brand || 'Sin marca',
            weight: prod.weight || null,
            category: prod.category,
            price: parseFloat(prod.price) || 0,
            stock: prod.stock || 0,
            minStock: prod.min_stock || 0,
            unit: prod.unit || 'kg'
        }));
        console.log(`✅ ${window.inventory.length} productos cargados`);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// ============================================
// CUSTOMER DATA
// ============================================

function handleCustomerDataSubmit(e) {
    e.preventDefault();
    
    currentCustomerData = {
        name: document.getElementById('newOrderCustomerName').value.trim(),
        phone: document.getElementById('newOrderCustomerPhone').value.trim(),
        address: document.getElementById('newOrderCustomerAddress').value.trim(),
        email: document.getElementById('newOrderCustomerEmail').value.trim() || null,
        notes: document.getElementById('newOrderNotes').value.trim() || null
    };
    
    // Mostrar sección de armado de pedido
    customerDataSection.style.display = 'none';
    orderBuildSection.style.display = 'block';
    
    // Actualizar display
    displayCustomerName.textContent = currentCustomerData.name;
    displayCustomerAddress.textContent = currentCustomerData.address;
}

window.editCustomerData = function() {
    orderBuildSection.style.display = 'none';
    customerDataSection.style.display = 'block';
}

// ============================================
// RENDER PRODUCTOS
// ============================================

function renderProductsForOrders(productsToRender = null) {
    const products = productsToRender || (window.inventory || []);
    
    if (products.length === 0) {
        productsOrderGrid.innerHTML = '';
        emptyOrderState.style.display = 'flex';
        return;
    }
    
    emptyOrderState.style.display = 'none';
    
    productsOrderGrid.innerHTML = products.map(product => {
        const icon = getCategoryIcon(product.category);
        const isAvailable = product.stock > 0;
        
        // Verificar si ya está en el carrito
        const cartItem = cart.find(item => item.productId === product.id);
        const inCart = !!cartItem;
        const totalKg = cartItem ? cartItem.weight : 0;
        
        return `
            <div class="product-order-card ${inCart ? 'in-cart' : ''}" data-product-id="${product.id}">
                ${inCart ? `<div class="cart-badge"><i class="fas fa-shopping-cart"></i> ${totalKg} kg</div>` : ''}
                <div class="product-order-image">
                    <i class="fas ${icon}"></i>
                    ${product.stock <= product.minStock ? '<span class="stock-indicator low-stock">Stock Bajo</span>' : ''}
                </div>
                <div class="product-order-info">
                    <div class="product-order-header">
                        <h3>${product.name}</h3>
                        <span class="product-code">${product.code}</span>
                    </div>
                    <p class="product-brand"><i class="fas fa-tag"></i> ${product.brand}</p>
                    ${product.weight ? `<p class="product-weight"><i class="fas fa-balance-scale"></i> Peso: ${product.weight} kg</p>` : ''}
                    <div class="product-order-details">
                        <div class="product-price-large">$${product.price.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} /kg</div>
                        <div class="product-stock-info">
                            <strong>${product.stock}</strong> disponibles
                        </div>
                    </div>
                    <button class="btn-add-to-cart" onclick="openAddProductModal(${product.id})" ${!isAvailable ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i>
                        ${isAvailable ? 'Agregar' : 'Sin Stock'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function getCategoryIcon(category) {
    const icons = {
        'quesos': 'fa-cheese',
        'jamones': 'fa-bacon',
        'carnes': 'fa-drumstick-bite',
        'conservas': 'fa-jar',
        'lacteos': 'fa-milk-alt',
        'condimentos': 'fa-pepper-hot',
        'especias': 'fa-mortar-pestle',
        'aceites': 'fa-oil-can',
        'congelados': 'fa-snowflake'
    };
    return icons[category] || 'fa-box';
}

// ============================================
// MODAL AGREGAR PRODUCTO
// ============================================

window.openAddProductModal = function(productId) {
    const product = window.inventory.find(p => p.id === productId);
    if (!product) return;
    
    selectedProduct = product;
    
    // Llenar datos del modal
    modalProductName.textContent = product.name;
    modalProductBrand.textContent = product.brand;
    modalProductPrice.textContent = `$${product.price.toLocaleString('es-AR', {minimumFractionDigits: 2})} /kg`;
    modalProductWeight.textContent = product.weight ? `${product.weight} kg` : 'Variable';
    
    // Pre-llenar peso sugerido
    productWeightInput.value = product.weight || '';
    productWeightInput.focus();
    
    // Calcular subtotal
    updateModalSubtotal();
    
    // Mostrar modal
    addProductModal.classList.add('active');
}

function closeAddProductModal() {
    addProductModal.classList.remove('active');
    selectedProduct = null;
    addProductForm.reset();
}

function updateModalSubtotal() {
    if (!selectedProduct) return;
    
    const weight = parseFloat(productWeightInput.value) || 0;
    const subtotal = selectedProduct.price * weight;
    modalSubtotal.textContent = `$${subtotal.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

function handleAddProductSubmit(e) {
    e.preventDefault();
    
    if (!selectedProduct) return;
    
    const weight = parseFloat(productWeightInput.value);
    
    if (weight <= 0) {
        alert('El peso debe ser mayor a 0');
        return;
    }
    
    // Agregar al carrito
    addProductToCart(selectedProduct.id, weight);
    
    // Cerrar modal
    closeAddProductModal();
}

// ============================================
// CARRITO
// ============================================

function addProductToCart(productId, weight) {
    const product = window.inventory.find(p => p.id === productId);
    if (!product) return;
    
    // Verificar si ya existe en el carrito
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        // Sumar peso
        existingItem.weight += weight;
    } else {
        // Agregar nuevo item
        cart.push({
            productId: product.id,
            name: product.name,
            brand: product.brand,
            code: product.code,
            pricePerKg: product.price,
            weight: weight
        });
    }
    
    renderCart();
    renderProductsForOrders(); // Actualizar badges
}

function renderCart() {
    if (cart.length === 0) {
        posCartItems.innerHTML = `
            <div class="pos-empty-cart">
                <i class="fas fa-cart-arrow-down"></i>
                <p>Agrega productos al pedido</p>
            </div>
        `;
        btnCheckoutPos.disabled = true;
        updateCartTotals();
        return;
    }
    
    posCartItems.innerHTML = cart.map((item, index) => {
        const subtotal = item.pricePerKg * item.weight;
        return `
            <div class="pos-cart-item">
                <div class="pos-item-header">
                    <strong>${item.name}</strong>
                    <button class="btn-remove-item" onclick="removeFromCart(${index})" title="Eliminar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="pos-item-details">
                    <span class="item-brand">${item.brand}</span>
                    <span class="item-code">${item.code}</span>
                </div>
                <div class="pos-item-price-row">
                    <span>$${item.pricePerKg.toLocaleString('es-AR', {minimumFractionDigits: 2})} /kg</span>
                </div>
                <div class="pos-item-weight">
                    <label>Peso (kg):</label>
                    <input type="number" class="weight-input" step="0.001" min="0.001" 
                           value="${item.weight}" onchange="updateItemWeight(${index}, this.value)">
                </div>
                <div class="pos-item-subtotal">
                    <strong>Subtotal:</strong>
                    <strong class="price-highlight">$${subtotal.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                </div>
            </div>
        `;
    }).join('');
    
    btnCheckoutPos.disabled = false;
    updateCartTotals();
}

window.updateItemWeight = function(index, newWeight) {
    const weight = parseFloat(newWeight);
    if (weight <= 0) {
        alert('El peso debe ser mayor a 0');
        renderCart();
        return;
    }
    
    cart[index].weight = weight;
    renderCart();
    renderProductsForOrders(); // Actualizar badges
}

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    renderCart();
    renderProductsForOrders(); // Actualizar badges
}

window.clearCartFromPos = function() {
    if (cart.length === 0) return;
    
    if (confirm('¿Vaciar el carrito?')) {
        cart = [];
        renderCart();
        renderProductsForOrders();
    }
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.pricePerKg * item.weight), 0);
    const total = subtotal; // Por ahora sin descuentos ni impuestos
    const itemCount = cart.length;
    const totalKg = cart.reduce((sum, item) => sum + item.weight, 0);
    
    if (posSubtotal) posSubtotal.textContent = `$${subtotal.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (posTotal) posTotal.textContent = `$${total.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (posItemsCount) posItemsCount.textContent = `${itemCount} productos (${totalKg.toFixed(2)} kg)`;
}

// ============================================
// CHECKOUT
// ============================================

function confirmNewOrder() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    if (!currentCustomerData) {
        alert('Faltan datos del cliente');
        return;
    }
    
    // Crear pedido
    const order = {
        id: Date.now(),
        orderNumber: `PED-${String(orders.length + 1).padStart(4, '0')}`,
        customer: currentCustomerData,
        items: cart.map(item => ({...item})),
        subtotal: cart.reduce((sum, item) => sum + (item.pricePerKg * item.weight), 0),
        total: cart.reduce((sum, item) => sum + (item.pricePerKg * item.weight), 0),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    orders.push(order);
    
    // Limpiar
    cart = [];
    currentCustomerData = null;
    
    // Volver a paso 1
    orderBuildSection.style.display = 'none';
    customerDataSection.style.display = 'block';
    customerDataForm.reset();
    
    renderCart();
    renderProductsForOrders();
    
    alert(`✅ Pedido ${order.orderNumber} creado exitosamente!`);
}

// ============================================
// BÚSQUEDA Y FILTROS
// ============================================

function handleProductSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderProductsForOrders();
        return;
    }
    
    const filtered = window.inventory.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
    
    renderProductsForOrders(filtered);
}

function loadCategoryFilters() {
    // Por ahora simple, después podemos mejorar
    const filterButtons = document.getElementById('orderFilterButtons');
    if (!filterButtons) return;
    
    const categories = [...new Set(window.inventory.map(p => p.category))];
    
    const categoryIcons = {
        'quesos': 'fa-cheese',
        'jamones': 'fa-bacon',
        'carnes': 'fa-drumstick-bite',
        'conservas': 'fa-jar',
        'lacteos': 'fa-milk-alt',
        'condimentos': 'fa-pepper-hot',
        'especias': 'fa-mortar-pestle',
        'aceites': 'fa-oil-can',
        'congelados': 'fa-snowflake'
    };
    
    const buttonsHTML = categories.map(cat => {
        const icon = categoryIcons[cat] || 'fa-box';
        const count = window.inventory.filter(p => p.category === cat).length;
        return `
            <button class="filter-btn" data-category="${cat}" onclick="filterByCategory('${cat}')">
                <i class="fas ${icon}"></i> ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${count})
            </button>
        `;
    }).join('');
    
    filterButtons.innerHTML = `
        <button class="filter-btn active" data-category="todos" onclick="filterByCategory('todos')">
            <i class="fas fa-th"></i> Todos (${window.inventory.length})
        </button>
        ${buttonsHTML}
    `;
}

window.filterByCategory = function(category) {
    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.filter-btn').classList.add('active');
    
    if (category === 'todos') {
        renderProductsForOrders();
    } else {
        const filtered = window.inventory.filter(p => p.category === category);
        renderProductsForOrders(filtered);
    }
}
