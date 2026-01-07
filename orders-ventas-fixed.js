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
let allClientes = []; // Lista de clientes desde Supabase

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

// Búsqueda de clientes
let customerSearchInput;
let customerSearchResults;
let btnNewCustomer;
let newCustomerForm;
let btnCancelNewCustomer;
let btnCancelCustomerForm;

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
    await loadClientesFromSupabase();
    renderProductsForOrders();
    loadCategoryFilters();
    renderCart();
    renderClientesList(); // Mostrar todos los clientes al inicio
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
    
    // Búsqueda de clientes
    customerSearchInput = document.getElementById('customerSearchInput');
    customerSearchResults = document.getElementById('customerSearchResults');
    btnNewCustomer = document.getElementById('btnNewCustomer');
    newCustomerForm = document.getElementById('newCustomerForm');
    btnCancelNewCustomer = document.getElementById('btnCancelNewCustomer');
    btnCancelCustomerForm = document.getElementById('btnCancelCustomerForm');
    
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
    // Customer Search
    if (customerSearchInput) {
        customerSearchInput.addEventListener('input', handleCustomerSearch);
    }
    if (btnNewCustomer) {
        btnNewCustomer.addEventListener('click', showNewCustomerForm);
    }
    if (btnCancelNewCustomer) {
        btnCancelNewCustomer.addEventListener('click', hideNewCustomerForm);
    }
    if (btnCancelCustomerForm) {
        btnCancelCustomerForm.addEventListener('click', hideNewCustomerForm);
    }
    
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

async function loadClientesFromSupabase() {
    if (!useSupabase) return;
    
    try {
        const clientes = await window.supabaseDB.getClientes();
        allClientes = clientes.map(c => ({
            id: c.id,
            name: c.name,
            phone: c.phone || '',
            address: c.address || '',
            email: c.email || '',
            cuit: c.cuit || '',
            notes: c.notes || ''
        }));
        console.log(`✅ ${allClientes.length} clientes cargados`);
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

// ============================================
// BÚSQUEDA Y SELECCIÓN DE CLIENTES
// ============================================

function renderClientesList(clientesToShow = null) {
    const clientes = clientesToShow || allClientes;
    
    if (clientes.length === 0) {
        customerSearchResults.innerHTML = `
            <div class="empty-search-state">
                <i class="fas fa-user-slash"></i>
                <p>No se encontraron clientes</p>
                ${!clientesToShow ? '<small>Crea tu primer cliente para comenzar</small>' : ''}
            </div>
        `;
        return;
    }
    
    customerSearchResults.innerHTML = clientes.map(cliente => `
        <div class="customer-result-card" onclick="selectCustomer(${cliente.id})">
            <div class="customer-result-header">
                <div class="customer-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="customer-result-info">
                    <h4>${cliente.name}</h4>
                    <div class="customer-details">
                        ${cliente.phone ? `<span><i class="fas fa-phone"></i> ${cliente.phone}</span>` : ''}
                        ${cliente.cuit ? `<span><i class="fas fa-id-card"></i> ${cliente.cuit}</span>` : ''}
                    </div>
                    ${cliente.address ? `<p class="customer-address"><i class="fas fa-map-marker-alt"></i> ${cliente.address}</p>` : ''}
                </div>
            </div>
            <div class="customer-result-action">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>
    `).join('');
}

function handleCustomerSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderClientesList();
        return;
    }
    
    const filtered = allClientes.filter(cliente => 
        cliente.name.toLowerCase().includes(searchTerm) ||
        cliente.phone.toLowerCase().includes(searchTerm) ||
        cliente.cuit.toLowerCase().includes(searchTerm) ||
        cliente.address.toLowerCase().includes(searchTerm)
    );
    
    renderClientesList(filtered);
}

window.selectCustomer = function(clienteId) {
    const cliente = allClientes.find(c => c.id === clienteId);
    if (!cliente) return;
    
    currentCustomerData = {
        id: cliente.id,
        name: cliente.name,
        phone: cliente.phone,
        address: cliente.address,
        email: cliente.email,
        cuit: cliente.cuit,
        notes: cliente.notes
    };
    
    // Ir a armar pedido
    customerDataSection.style.display = 'none';
    orderBuildSection.style.display = 'block';
    
    // Actualizar display
    displayCustomerName.textContent = currentCustomerData.name;
    displayCustomerAddress.textContent = currentCustomerData.address || currentCustomerData.phone;
}

function showNewCustomerForm() {
    document.querySelector('.customer-search-section').style.display = 'none';
    newCustomerForm.style.display = 'block';
}

function hideNewCustomerForm() {
    newCustomerForm.style.display = 'none';
    document.querySelector('.customer-search-section').style.display = 'block';
    customerDataForm.reset();
}

// ============================================
// CUSTOMER DATA
// ============================================

async function handleCustomerDataSubmit(e) {
    e.preventDefault();
    
    const newCustomer = {
        name: document.getElementById('newOrderCustomerName').value.trim(),
        phone: document.getElementById('newOrderCustomerPhone').value.trim(),
        address: document.getElementById('newOrderCustomerAddress').value.trim(),
        email: document.getElementById('newOrderCustomerEmail').value.trim() || '',
        cuit: document.getElementById('newOrderCustomerCuit').value.trim() || '',
        notes: document.getElementById('newOrderNotes').value.trim() || ''
    };
    
    try {
        // Guardar cliente en Supabase
        if (useSupabase) {
            const savedCustomer = await window.supabaseDB.addCliente(newCustomer);
            console.log('✅ Cliente guardado:', savedCustomer);
            
            currentCustomerData = savedCustomer;
            
            // Recargar lista de clientes
            await loadClientesFromSupabase();
        } else {
            currentCustomerData = newCustomer;
        }
        
        // Mostrar sección de armado de pedido
        customerDataSection.style.display = 'none';
        orderBuildSection.style.display = 'block';
        
        // Actualizar display
        displayCustomerName.textContent = currentCustomerData.name;
        displayCustomerAddress.textContent = currentCustomerData.address || currentCustomerData.phone;
        
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        alert('Error al guardar el cliente: ' + error.message);
    }
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
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Sumar peso
        existingItem.weight += weight;
    } else {
        // Agregar nuevo item
        cart.push({
            id: product.id,  // ✅ Cambiado de productId a id
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

async function confirmNewOrder() {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    if (!currentCustomerData) {
        alert('Faltan datos del cliente');
        return;
    }
    
    // Deshabilitar botón para evitar doble click
    btnCheckoutPos.disabled = true;
    btnCheckoutPos.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    
    try {
        // Validar que todos los productos tengan ID
        for (const item of cart) {
            if (!item.id) {
                throw new Error(`Producto sin ID: ${item.name}`);
            }
        }
        
        // Crear pedido
        const order = {
            orderNumber: `PED-${String(Date.now()).slice(-6)}`,
            customer: {
                name: currentCustomerData.name,
                phone: currentCustomerData.phone || '',
                email: currentCustomerData.email || '',
                address: currentCustomerData.address || ''
            },
            items: cart.map(item => ({
                id: item.id,
                code: item.code,
                name: item.name,
                brand: item.brand || '',
                pricePerKg: item.pricePerKg,
                weight: item.weight
            })),
            subtotal: cart.reduce((sum, item) => sum + (item.pricePerKg * item.weight), 0),
            discount: 0,
            total: cart.reduce((sum, item) => sum + (item.pricePerKg * item.weight), 0),
            status: 'pendiente',
            notes: ''
        };
        
        console.log('🔄 Creando pedido:', order);
        
        // Guardar en Supabase
        if (useSupabase) {
            const savedOrder = await window.supabaseDB.addPedido(order);
            console.log('✅ Pedido guardado:', savedOrder);
            
            // Verificar si hubo warnings de stock
            let message = `✅ Pedido ${order.orderNumber} creado exitosamente!\n\n` +
                  `Cliente: ${order.customer.name}\n` +
                  `Total: $${order.total.toLocaleString('es-AR', {minimumFractionDigits: 2})}\n` +
                  `Productos: ${order.items.length}`;
            
            if (savedOrder._stockWarnings && savedOrder._stockWarnings.length > 0) {
                message += '\n\n⚠️ Advertencias de stock:\n';
                savedOrder._stockWarnings.forEach(w => {
                    message += `- ${w.product}: ${w.error}\n`;
                });
            } else {
                message += '\n\n✅ Stock actualizado correctamente.';
            }
            
            alert(message);
        } else {
            // Guardar local si Supabase no está disponible
            orders.push(order);
            alert(`✅ Pedido ${order.orderNumber} creado localmente!`);
        }
        
        // Limpiar carrito
        cart = [];
        currentCustomerData = null;
        
        // Volver a paso 1
        orderBuildSection.style.display = 'none';
        customerDataSection.style.display = 'block';
        
        // Recargar datos actualizados
        await loadDataFromSupabase();
        await loadClientesFromSupabase();
        
        renderCart();
        renderProductsForOrders();
        renderClientesList();
        
    } catch (error) {
        console.error('❌ Error al crear pedido:', {
            error: error.message,
            stack: error.stack,
            cart: cart,
            customer: currentCustomerData
        });
        alert(`❌ Error al crear el pedido:\n\n${error.message}\n\nRevisa la consola para más detalles.`);
    } finally {
        // Rehabilitar botón
        btnCheckoutPos.disabled = false;
        btnCheckoutPos.innerHTML = '<i class="fas fa-check-circle"></i> Confirmar Pedido';
    }
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

// ============================================
// TABS - NUEVO PEDIDO / HISTORIAL
// ============================================

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Desactivar todos los tabs
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Activar el tab seleccionado
            btn.classList.add('active');
            const targetTab = document.getElementById(`tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
            if (targetTab) {
                targetTab.classList.add('active');
                
                // Si es el tab de historial, cargar pedidos
                if (tabName === 'historial') {
                    loadOrdersHistory();
                }
            }
        });
    });
}

// ============================================
// HISTORIAL DE PEDIDOS
// ============================================

let allOrders = [];
let filteredOrders = [];

async function loadOrdersHistory() {
    if (!useSupabase) {
        console.log('Supabase no disponible');
        return;
    }
    
    try {
        console.log('🔄 Cargando historial de pedidos...');
        const pedidos = await window.supabaseDB.getPedidos();
        allOrders = pedidos;
        filteredOrders = pedidos;
        
        console.log(`✅ ${pedidos.length} pedidos cargados`);
        renderOrdersHistory(filteredOrders);
    } catch (error) {
        console.error('Error al cargar historial:', error);
        document.getElementById('ordersHistoryGrid').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error al cargar el historial de pedidos</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}

function renderOrdersHistory(pedidos) {
    const grid = document.getElementById('ordersHistoryGrid');
    const emptyState = document.getElementById('emptyHistoryState');
    
    if (!pedidos || pedidos.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    grid.innerHTML = pedidos.map(pedido => {
        const statusMap = {
            'pendiente': { icon: 'fa-clock', color: '#ffa500', text: 'Pendiente' },
            'en_proceso': { icon: 'fa-spinner', color: '#2196F3', text: 'En Proceso' },
            'completado': { icon: 'fa-check-circle', color: '#4caf50', text: 'Completado' },
            'cancelado': { icon: 'fa-times-circle', color: '#f44336', text: 'Cancelado' }
        };
        
        const status = statusMap[pedido.status] || statusMap['pendiente'];
        const fecha = new Date(pedido.created_at).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Parsear items si es string JSON
        let items = [];
        try {
            items = typeof pedido.items === 'string' ? JSON.parse(pedido.items) : pedido.items;
        } catch (e) {
            items = [];
        }
        
        const itemsCount = items.length;
        const totalKg = items.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);
        
        return `
            <div class="order-history-card" data-order-id="${pedido.id}">
                <div class="order-header">
                    <div class="order-number">
                        <i class="fas fa-receipt"></i>
                        <strong>${pedido.order_number}</strong>
                    </div>
                    <div class="order-status" style="background-color: ${status.color}15; color: ${status.color};">
                        <i class="fas ${status.icon}"></i>
                        ${status.text}
                    </div>
                </div>
                
                <div class="order-customer">
                    <i class="fas fa-user"></i>
                    <div>
                        <strong>${pedido.customer_name}</strong>
                        ${pedido.customer_phone ? `<span>${pedido.customer_phone}</span>` : ''}
                    </div>
                </div>
                
                ${pedido.customer_address ? `
                    <div class="order-address">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${pedido.customer_address}</span>
                    </div>
                ` : ''}
                
                <div class="order-items-summary">
                    <div class="summary-item">
                        <i class="fas fa-box"></i>
                        <span>${itemsCount} producto${itemsCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="summary-item">
                        <i class="fas fa-weight"></i>
                        <span>${totalKg.toFixed(2)} kg</span>
                    </div>
                </div>
                
                <div class="order-footer">
                    <div class="order-date">
                        <i class="fas fa-calendar"></i>
                        ${fecha}
                    </div>
                    <div class="order-total">
                        <strong>$${parseFloat(pedido.total).toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong>
                    </div>
                </div>
                
                <div class="order-actions">
                    <button class="btn-icon" onclick="viewOrderDetails(${pedido.id})" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${pedido.status === 'pendiente' ? `
                        <button class="btn-icon btn-success" onclick="markOrderAsCompleted(${pedido.id})" title="Marcar como completado">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    ${pedido.status === 'pendiente' ? `
                        <button class="btn-icon btn-danger" onclick="cancelOrder(${pedido.id})" title="Cancelar pedido">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Ver detalles del pedido
window.viewOrderDetails = async function(orderId) {
    const pedido = allOrders.find(p => p.id === orderId);
    if (!pedido) return;
    
    let items = [];
    try {
        items = typeof pedido.items === 'string' ? JSON.parse(pedido.items) : pedido.items;
    } catch (e) {
        items = [];
    }
    
    const itemsHTML = items.map(item => `
        <tr>
            <td>${item.product_name}</td>
            <td>${item.brand || '-'}</td>
            <td>${item.weight} kg</td>
            <td>$${parseFloat(item.price_per_kg).toLocaleString('es-AR', {minimumFractionDigits: 2})}</td>
            <td><strong>$${parseFloat(item.subtotal).toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong></td>
        </tr>
    `).join('');
    
    const modal = `
        <div class="modal active" id="orderDetailsModal" style="display: flex;">
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2><i class="fas fa-receipt"></i> Detalle del Pedido ${pedido.order_number}</h2>
                    <button class="modal-close" onclick="closeOrderDetailsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="order-details-info">
                        <div class="info-group">
                            <label><i class="fas fa-user"></i> Cliente:</label>
                            <p>${pedido.customer_name}</p>
                        </div>
                        ${pedido.customer_phone ? `
                            <div class="info-group">
                                <label><i class="fas fa-phone"></i> Teléfono:</label>
                                <p>${pedido.customer_phone}</p>
                            </div>
                        ` : ''}
                        ${pedido.customer_address ? `
                            <div class="info-group">
                                <label><i class="fas fa-map-marker-alt"></i> Dirección:</label>
                                <p>${pedido.customer_address}</p>
                            </div>
                        ` : ''}
                        <div class="info-group">
                            <label><i class="fas fa-calendar"></i> Fecha:</label>
                            <p>${new Date(pedido.created_at).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                    </div>
                    
                    <h3>Productos</h3>
                    <table class="order-details-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Marca</th>
                                <th>Peso</th>
                                <th>Precio/kg</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHTML}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                                <td><strong>$${parseFloat(pedido.total).toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
}

window.closeOrderDetailsModal = function() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) modal.remove();
}

// Marcar como completado
window.markOrderAsCompleted = async function(orderId) {
    if (!confirm('¿Marcar este pedido como completado?')) return;
    
    try {
        console.log('🔄 Marcando pedido como completado:', orderId);
        const updated = await window.supabaseDB.updatePedidoStatus(orderId, 'completado');
        console.log('✅ Pedido actualizado:', updated);
        alert('✅ Pedido marcado como completado');
        await loadOrdersHistory();
    } catch (error) {
        console.error('❌ Error al completar pedido:', {
            orderId: orderId,
            error: error.message,
            stack: error.stack
        });
        alert(`❌ Error al actualizar el pedido:\n\n${error.message}`);
    }
}

// Cancelar pedido
window.cancelOrder = async function(orderId) {
    if (!confirm('¿Cancelar este pedido? Esta acción no se puede deshacer.')) return;
    
    try {
        console.log('🔄 Cancelando pedido:', orderId);
        const updated = await window.supabaseDB.updatePedidoStatus(orderId, 'cancelado');
        console.log('✅ Pedido cancelado:', updated);
        alert('✅ Pedido cancelado correctamente');
        await loadOrdersHistory();
    } catch (error) {
        console.error('❌ Error al cancelar pedido:', {
            orderId: orderId,
            error: error.message,
            stack: error.stack
        });
        alert(`❌ Error al cancelar el pedido:\n\n${error.message}`);
    }
}

// Filtrar por búsqueda
function initializeHistoryFilters() {
    const searchInput = document.getElementById('historySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            filteredOrders = allOrders.filter(p => 
                p.order_number.toLowerCase().includes(term) ||
                p.customer_name.toLowerCase().includes(term) ||
                (p.customer_phone && p.customer_phone.includes(term))
            );
            renderOrdersHistory(filteredOrders);
        });
    }
    
    // Filtros por estado
    const filterButtons = document.querySelectorAll('.orders-history-controls .filter-btn[data-status]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const status = btn.getAttribute('data-status');
            if (status === 'todos') {
                filteredOrders = allOrders;
            } else {
                const statusMap = {
                    'pending': 'pendiente',
                    'completed': 'completado',
                    'cancelled': 'cancelado'
                };
                filteredOrders = allOrders.filter(p => p.status === statusMap[status]);
            }
            renderOrdersHistory(filteredOrders);
        });
    });
}

// Inicializar todo al cargar
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeHistoryFilters();
});
