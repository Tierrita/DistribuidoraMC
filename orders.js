// ============================================
// SISTEMA DE PEDIDOS - Distribuidora MC
// ============================================

// Variables globales
let cart = [];
let orders = [];
let currentOrdersTab = 'nuevo-pedido';
let currentStatusFilter = 'todos';

// Elementos del DOM (se inicializarán cuando el DOM esté listo)
let productsOrderGrid;
let orderSearchInput;
let emptyOrderState;
let posCartItems;
let posSubtotal;
let posTotal;
let posItemsCount;
let btnCheckoutPos;
let btnClearCartPos;
let ordersHistoryGrid;
let historySearchInput;
let emptyHistoryState;
let tabButtons;
let tabNuevoPedido;
let tabHistorial;
let cartButton;
let cartBadge;
let cartModal;
let cartModalClose;
let cartItems;
let emptyCart;
let cartTotal;
let btnClearCart;
let btnCheckout;
let checkoutModal;
let checkoutModalClose;
let btnCancelCheckout;
let checkoutForm;
let checkoutItems;
let checkoutTotal;
let confirmationModal;
let orderNumber;
let btnNewOrder;
let btnViewOrders;

// Función para inicializar elementos del DOM
function initializeDOMElements() {
    // Nuevo Pedido
    productsOrderGrid = document.getElementById('productsOrderGrid');
    orderSearchInput = document.getElementById('orderSearchInput');
    emptyOrderState = document.getElementById('emptyOrderState');
    
    // POS Cart
    posCartItems = document.getElementById('posCartItems');
    posSubtotal = document.getElementById('posSubtotal');
    posTotal = document.getElementById('posTotal');
    posItemsCount = document.getElementById('posItemsCount');
    btnCheckoutPos = document.getElementById('btnCheckoutPos');
    btnClearCartPos = document.getElementById('btnClearCartPos');
    
    // Historial
    ordersHistoryGrid = document.getElementById('ordersHistoryGrid');
    historySearchInput = document.getElementById('historySearchInput');
    emptyHistoryState = document.getElementById('emptyHistoryState');
    
    // Tabs
    tabButtons = document.querySelectorAll('.orders-tabs .tab-btn');
    tabNuevoPedido = document.getElementById('tabNuevoPedido');
    tabHistorial = document.getElementById('tabHistorial');
    
    // Cart y Modales
    cartButton = document.getElementById('cartButton');
    cartBadge = document.getElementById('cartBadge');
    cartModal = document.getElementById('cartModal');
    cartModalClose = document.getElementById('cartModalClose');
    cartItems = document.getElementById('cartItems');
    emptyCart = document.getElementById('emptyCart');
    cartTotal = document.getElementById('cartTotal');
    btnClearCart = document.getElementById('btnClearCart');
    btnCheckout = document.getElementById('btnCheckout');
    checkoutModal = document.getElementById('checkoutModal');
    checkoutModalClose = document.getElementById('checkoutModalClose');
    btnCancelCheckout = document.getElementById('btnCancelCheckout');
    checkoutForm = document.getElementById('checkoutForm');
    checkoutItems = document.getElementById('checkoutItems');
    checkoutTotal = document.getElementById('checkoutTotal');
    confirmationModal = document.getElementById('confirmationModal');
    orderNumber = document.getElementById('orderNumber');
    btnNewOrder = document.getElementById('btnNewOrder');
    btnViewOrders = document.getElementById('btnViewOrders');
}

// Función para obtener categorías dinámicas
function getCategoryIcons() {
    const categories = JSON.parse(localStorage.getItem('distributoraMC_categories') || '[]');
    const icons = {};
    categories.forEach(cat => {
        icons[cat.slug] = cat.icon;
    });
    return icons;
}

// ============================================
// GESTIÓN DE STOCK EN PEDIDOS
// ============================================

async function updateInventoryStock(cartItems) {
    // Descontar stock de cada producto del carrito
    for (const item of cartItems) {
        const product = window.inventory.find(p => p.id === item.productId);
        
        if (product) {
            const newStock = product.stock - item.quantity;
            
            // Actualizar en el array global
            product.stock = newStock;
            
            // Actualizar en Supabase si está disponible
            if (window.supabaseDB && typeof window.supabaseDB.updateProducto === 'function') {
                try {
                    await window.supabaseDB.updateProducto(product.id, {
                        code: product.code,
                        name: product.name,
                        category: product.category,
                        cost_price: product.costPrice || 0,
                        price: product.price,
                        stock: newStock,
                        unit: product.unit || 'kg',
                        min_stock: product.minStock || 0
                    });
                    console.log(`✅ Stock actualizado en Supabase: ${product.name} - Nuevo stock: ${newStock}`);
                } catch (error) {
                    console.error('Error al actualizar stock en Supabase:', error);
                }
            }
        }
    }
    
    // Actualizar en localStorage
    localStorage.setItem('distributoraMC_inventory', JSON.stringify(window.inventory));
    
    // Re-renderizar productos si estamos en la página de pedidos
    if (typeof renderProductsForOrders === 'function') {
        renderProductsForOrders();
    }
    
    console.log('✅ Stock actualizado en inventario local');
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    loadCartFromStorage();
    loadOrdersFromStorage();
    updateCartBadge();
    initializeOrdersEventListeners();
    initializeTabsEventListeners();
    loadDynamicOrderFilters();
    
    // Cargar inventario si no está disponible
    if (!window.inventory || window.inventory.length === 0) {
        const storedInventory = localStorage.getItem('distributoraMC_inventory');
        if (storedInventory) {
            window.inventory = JSON.parse(storedInventory);
            console.log('✅ Inventario cargado desde localStorage:', window.inventory.length, 'productos');
        } else {
            console.warn('⚠️ No hay productos en el inventario. Ve a Inventario para agregar productos.');
        }
    }
    
    // Esperar un momento para que todo se inicialice
    setTimeout(() => {
        renderProductsForOrders();
        renderOrdersHistory();
        renderPosCart();
    }, 100);
});

// ============================================
// CARGAR FILTROS DINÁMICOS EN PEDIDOS
// ============================================

function loadDynamicOrderFilters() {
    const categories = JSON.parse(localStorage.getItem('distributoraMC_categories') || '[]');
    const filterButtonsContainer = document.querySelector('.orders-controls .filter-buttons');
    
    if (!filterButtonsContainer) return;
    
    filterButtonsContainer.innerHTML = `
        <button class="filter-btn active" data-category="todos">
            <i class="fas fa-th"></i> Todos
        </button>
        ${categories.map(cat => `
            <button class="filter-btn" data-category="${cat.slug}">
                <i class="fas ${cat.icon}"></i> ${cat.name}
            </button>
        `).join('')}
    `;
    
    // Agregar event listeners
    const orderFilterButtons = document.querySelectorAll('.orders-controls .filter-btn');
    orderFilterButtons.forEach(btn => {
        btn.addEventListener('click', handleOrderFilter);
    });
}

// ============================================
// ALMACENAMIENTO
// ============================================

function saveCartToStorage() {
    localStorage.setItem('distributoraMC_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const stored = localStorage.getItem('distributoraMC_cart');
    if (stored) {
        cart = JSON.parse(stored);
    }
}

function saveOrdersToStorage() {
    localStorage.setItem('distributoraMC_orders', JSON.stringify(orders));
}

function loadOrdersFromStorage() {
    const stored = localStorage.getItem('distributoraMC_orders');
    if (stored) {
        orders = JSON.parse(stored);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeOrdersEventListeners() {
    // Botón del carrito
    cartButton.addEventListener('click', openCartModal);
    
    // Cerrar modales
    cartModalClose.addEventListener('click', closeCartModal);
    checkoutModalClose.addEventListener('click', closeCheckoutModal);
    btnCancelCheckout.addEventListener('click', closeCheckoutModal);
    
    // Click fuera del modal
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCartModal();
    });
    
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckoutModal();
    });
    
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) closeConfirmationModal();
    });
    
    // Acciones del carrito
    btnClearCart.addEventListener('click', clearCart);
    btnCheckout.addEventListener('click', openCheckoutModal);
    
    // POS Cart Actions
    if (btnCheckoutPos) {
        btnCheckoutPos.addEventListener('click', openCheckoutModal);
    }
    
    // Formulario de checkout
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    
    // Confirmación
    btnNewOrder.addEventListener('click', () => {
        closeConfirmationModal();
        // Cambiar al tab de nuevo pedido
        tabButtons[0].click();
    });
    
    btnViewOrders.addEventListener('click', () => {
        closeConfirmationModal();
        // Cambiar al tab de historial
        tabButtons[1].click();
    });
    
    // Búsqueda en pedidos
    orderSearchInput.addEventListener('input', handleOrderSearch);
}

// ============================================
// RENDERIZAR PRODUCTOS PARA PEDIDOS
// ============================================

function renderProductsForOrders(productsToRender = null) {
    // Obtener productos del inventario
    const products = productsToRender || (window.inventory || []);
    const categoryIcons = getCategoryIcons();
    
    if (products.length === 0) {
        productsOrderGrid.innerHTML = '';
        emptyOrderState.style.display = 'flex';
        return;
    }
    
    emptyOrderState.style.display = 'none';
    
    productsOrderGrid.innerHTML = products.map(product => {
        const icon = categoryIcons[product.category] || 'fa-box';
        const stockStatus = getProductStockStatus(product);
        const isAvailable = product.stock > 0;
        
        // Verificar si ya está en el carrito
        const inCart = cart.find(item => item.productId === product.id);
        const cartQuantity = inCart ? inCart.quantity : 0;
        
        return `
            <div class="product-order-card ${cartQuantity > 0 ? 'in-cart' : ''}" data-product-id="${product.id}">
                ${cartQuantity > 0 ? `<div class="cart-badge"><i class="fas fa-shopping-cart"></i> ${cartQuantity} en carrito</div>` : ''}
                <div class="product-order-image">
                    <i class="fas ${icon}"></i>
                    <span class="stock-indicator ${stockStatus.class}">${stockStatus.text}</span>
                </div>
                <div class="product-order-info">
                    <div class="product-order-header">
                        <h3>${product.name}</h3>
                        <span class="product-code">${product.code}</span>
                    </div>
                    <div class="product-order-details">
                        <div class="product-price-large">$${product.price.toFixed(2)}</div>
                        <div class="product-stock-info">
                            <strong>${product.stock}</strong> disponibles
                        </div>
                    </div>
                    <div class="product-order-actions">
                        <div class="quantity-controls-wrapper">
                            <div class="quantity-selector">
                                <button class="quantity-btn" onclick="decreaseQuantity(${product.id})" ${!isAvailable ? 'disabled' : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1" max="${product.stock}" ${!isAvailable ? 'disabled' : ''}>
                                <button class="quantity-btn" onclick="increaseQuantity(${product.id})" ${!isAvailable ? 'disabled' : ''}>
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="btn-quick-add" onclick="quickAddToCart(${product.id})" ${!isAvailable ? 'disabled' : ''} title="Agregar 1 unidad rápidamente">
                                <i class="fas fa-bolt"></i>
                            </button>
                        </div>
                        <button class="btn-add-to-cart" onclick="addToCart(${product.id})" ${!isAvailable ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i>
                            ${isAvailable ? 'Agregar' : 'Sin Stock'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getProductStockStatus(product) {
    if (product.stock === 0) {
        return { class: 'unavailable', text: 'Sin Stock' };
    } else if (product.stock <= product.minStock) {
        return { class: 'low', text: `Últimas ${product.stock} unidades` };
    } else {
        return { class: 'available', text: 'Disponible' };
    }
}

// ============================================
// QUANTITY CONTROLS
// ============================================

function increaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    const product = window.inventory.find(p => p.id === productId);
    if (product && parseInt(input.value) < product.stock) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// ============================================
// CARRITO
// ============================================

function quickAddToCart(productId) {
    const product = window.inventory.find(p => p.id === productId);
    
    if (!product || product.stock <= 0) {
        showNotification('Producto sin stock', 'error');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > product.stock) {
            showNotification('No hay más stock disponible', 'error');
            return;
        }
        existingItem.quantity = newQuantity;
        showNotification(`+1 ${product.name} (Total: ${newQuantity})`, 'success');
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            code: product.code,
            price: product.price,
            quantity: 1,
            category: product.category
        });
        showNotification(`✓ ${product.name} agregado`, 'success');
    }
    
    saveCartToStorage();
    updateCartBadge();
    renderPosCart(); // Actualizar POS cart
    
    // Re-renderizar productos para actualizar badges
    renderProductsForOrders();
    
    // Efecto visual en el botón
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (card) {
        card.classList.add('product-added');
        setTimeout(() => card.classList.remove('product-added'), 600);
    }
}

function addToCart(productId) {
    const product = window.inventory.find(p => p.id === productId);
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(quantityInput.value);
    
    if (!product || quantity <= 0 || quantity > product.stock) {
        showNotification('Cantidad inválida', 'error');
        return;
    }
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
            showNotification('No hay suficiente stock disponible', 'error');
            return;
        }
        existingItem.quantity = newQuantity;
        showNotification(`${product.name} x${quantity} agregado (Total: ${newQuantity})`, 'success');
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            code: product.code,
            price: product.price,
            quantity: quantity,
            category: product.category
        });
        showNotification(`${product.name} x${quantity} agregado al carrito`, 'success');
    }
    
    saveCartToStorage();
    updateCartBadge();
    quantityInput.value = 1;
    renderPosCart(); // Actualizar POS cart
    
    // Re-renderizar productos para actualizar badges
    renderProductsForOrders();
    
    // Efecto visual en el botón
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (card) {
        card.classList.add('product-added');
        setTimeout(() => card.classList.remove('product-added'), 600);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCartToStorage();
    updateCartBadge();
    renderCart();
    renderPosCart(); // Actualizar POS cart
    renderProductsForOrders(); // Actualizar badges
    showNotification('Producto eliminado del carrito', 'success');
}

function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.productId === productId);
    const product = window.inventory.find(p => p.id === productId);
    
    if (item && product) {
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        if (newQuantity > product.stock) {
            showNotification('No hay suficiente stock', 'error');
            return;
        }
        
        item.quantity = newQuantity;
        saveCartToStorage();
        renderCart();
        renderPosCart(); // Actualizar POS cart
        renderProductsForOrders(); // Actualizar badges
    }
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
        cart = [];
        saveCartToStorage();
        updateCartBadge();
        renderCart();
        renderPosCart(); // Actualizar POS cart
        renderProductsForOrders(); // Actualizar badges
        showNotification('Carrito vaciado', 'success');
    }
}

function clearCartFromPos() {
    clearCart();
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    if (totalItems > 0) {
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ============================================
// MODALES
// ============================================

function openCartModal() {
    renderCart();
    cartModal.classList.add('active');
}

function closeCartModal() {
    cartModal.classList.remove('active');
}

function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    
    closeCartModal();
    renderCheckout();
    checkoutModal.classList.add('active');
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
}

function openConfirmationModal(orderNum) {
    orderNumber.textContent = `#${orderNum}`;
    confirmationModal.classList.add('active');
}

function closeConfirmationModal() {
    confirmationModal.classList.remove('active');
}

// ============================================
// RENDERIZAR CARRITO
// ============================================

function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        emptyCart.style.display = 'flex';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    emptyCart.style.display = 'none';
    const categoryIcons = getCategoryIcons();
    
    cartItems.innerHTML = cart.map(item => {
        const icon = categoryIcons[item.category] || 'fa-box';
        const subtotal = item.price * item.quantity;
        
        return `
            <div class="cart-item">
                <div class="cart-item-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-details">${item.code} - $${item.price.toFixed(2)} c/u</div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-quantity-control">
                        <button class="cart-quantity-btn" onclick="updateCartItemQuantity(${item.productId}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="cart-quantity-display">${item.quantity}</span>
                        <button class="cart-quantity-btn" onclick="updateCartItemQuantity(${item.productId}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">$${subtotal.toFixed(2)}</div>
                    <button class="btn-remove-item" onclick="removeFromCart(${item.productId})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
}

// ============================================
// RENDERIZAR POS CART (Carrito en Tiempo Real)
// ============================================

function renderPosCart() {
    if (!posCartItems) return;
    
    if (cart.length === 0) {
        posCartItems.innerHTML = `
            <div class="pos-empty-cart">
                <i class="fas fa-cart-arrow-down"></i>
                <p>Agrega productos para comenzar</p>
            </div>
        `;
        posSubtotal.textContent = '$0.00';
        posTotal.textContent = '$0.00';
        posItemsCount.textContent = '0 productos';
        btnCheckoutPos.disabled = true;
        return;
    }
    
    posCartItems.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        return `
            <div class="pos-cart-item">
                <div class="pos-item-info">
                    <div class="pos-item-name">${item.name}</div>
                    <div class="pos-item-price">$${item.price.toFixed(2)} c/u</div>
                </div>
                <div class="pos-item-controls">
                    <button class="pos-qty-btn" onclick="updateCartItemQuantity(${item.productId}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="pos-qty-display">${item.quantity}</span>
                    <button class="pos-qty-btn" onclick="updateCartItemQuantity(${item.productId}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="pos-item-remove" onclick="removeFromCart(${item.productId})" title="Eliminar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    const total = getCartTotal();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    posSubtotal.textContent = `$${total.toFixed(2)}`;
    posTotal.textContent = `$${total.toFixed(2)}`;
    posItemsCount.textContent = `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`;
    btnCheckoutPos.disabled = false;
}

// ============================================
// RENDERIZAR CHECKOUT
// ============================================

function renderCheckout() {
    checkoutItems.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        return `
            <div class="checkout-item">
                <div>
                    <div class="checkout-item-name">${item.name}</div>
                    <div class="checkout-item-quantity">Cantidad: ${item.quantity} x $${item.price.toFixed(2)}</div>
                </div>
                <div class="checkout-item-price">$${subtotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');
    
    checkoutTotal.textContent = `$${getCartTotal().toFixed(2)}`;
}

// ============================================
// PROCESAR PEDIDO
// ============================================

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // ===== VALIDACIONES =====
    
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    
    // 1. Validar carrito no vacío (doble verificación)
    if (cart.length === 0) {
        showNotification('El carrito está vacío', 'error');
        return;
    }
    
    // 2. Validar nombre
    if (name.length < 3) {
        showNotification('El nombre debe tener al menos 3 caracteres', 'error');
        document.getElementById('customerName').focus();
        return;
    }
    
    if (name.length > 100) {
        showNotification('El nombre es demasiado largo', 'error');
        document.getElementById('customerName').focus();
        return;
    }
    
    // 3. Validar teléfono argentino (formato flexible)
    const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
    if (!phoneRegex.test(phone)) {
        showNotification('El teléfono debe tener entre 7 y 20 dígitos', 'error');
        document.getElementById('customerPhone').focus();
        return;
    }
    
    // 4. Validar email si está presente
    if (email.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('El email no es válido', 'error');
            document.getElementById('customerEmail').focus();
            return;
        }
    }
    
    // 5. Validar dirección
    if (address.length < 5) {
        showNotification('La dirección debe tener al menos 5 caracteres', 'error');
        document.getElementById('customerAddress').focus();
        return;
    }
    
    if (address.length > 150) {
        showNotification('La dirección es demasiado larga', 'error');
        document.getElementById('customerAddress').focus();
        return;
    }
    
    // 6. Validar que todos los productos tengan stock disponible
    for (const item of cart) {
        const product = window.inventory.find(p => p.id === item.productId);
        if (!product) {
            showNotification(`El producto "${item.name}" ya no está disponible`, 'error');
            return;
        }
        if (product.stock < item.quantity) {
            showNotification(`Stock insuficiente para "${item.name}". Disponible: ${product.stock}`, 'error');
            return;
        }
    }
            return;
        }
    }
    
    // ===== FIN VALIDACIONES =====
    
    const orderData = {
        id: Date.now(),
        orderNumber: generateOrderNumber(),
        date: new Date().toISOString(),
        customer: {
            name: name,
            phone: phone,
            email: email,
            address: address
        },
        items: [...cart],
        total: getCartTotal(),
        notes: document.getElementById('orderNotes').value.trim(),
        status: 'pending'
    };
    
    orders.push(orderData);
    saveOrdersToStorage();
    
    // ===== DESCONTAR STOCK DEL INVENTARIO =====
    updateInventoryStock(cart);
    
    // Limpiar carrito
    cart = [];
    saveCartToStorage();
    updateCartBadge();
    
    // Cerrar checkout y mostrar confirmación
    closeCheckoutModal();
    checkoutForm.reset();
    openConfirmationModal(orderData.orderNumber);
    
    console.log('Pedido confirmado:', orderData);
    showNotification('Stock actualizado correctamente', 'success');
}

function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}${day}${random}`;
}

// ============================================
// BÚSQUEDA Y FILTROS
// ============================================

function handleOrderSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = window.inventory.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.code.toLowerCase().includes(searchTerm)
    );
    renderProductsForOrders(filtered);
}

function handleOrderFilter(e) {
    const category = e.currentTarget.dataset.category;
    
    // Update active button
    const orderFilterButtons = document.querySelectorAll('.orders-controls .filter-btn');
    orderFilterButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Filter products
    if (category === 'todos') {
        renderProductsForOrders(window.inventory);
    } else {
        const filtered = window.inventory.filter(p => p.category === category);
        renderProductsForOrders(filtered);
    }
}

function renderOrderCategoryFilters() {
    const orderFilterButtonsContainer = document.getElementById('orderFilterButtons');
    if (!orderFilterButtonsContainer) return;
    
    // Obtener categorías únicas del inventario
    const products = window.inventory || [];
    const categories = [...new Set(products.map(p => p.category))];
    const categoryIcons = getCategoryIcons();
    
    // Crear botones de filtro
    let filtersHTML = `
        <button class="filter-btn active" data-category="todos">
            <i class="fas fa-th"></i> Todos
        </button>
    `;
    
    categories.forEach(cat => {
        const icon = categoryIcons[cat] || 'fa-box';
        const displayName = cat.charAt(0).toUpperCase() + cat.slice(1);
        filtersHTML += `
            <button class="filter-btn" data-category="${cat}">
                <i class="fas ${icon}"></i> ${displayName}
            </button>
        `;
    });
    
    orderFilterButtonsContainer.innerHTML = filtersHTML;
    
    // Agregar event listeners
    const filterButtons = orderFilterButtonsContainer.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleOrderFilter);
    });
}

// ============================================
// FUNCIONES GLOBALES
// ============================================

window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.quickAddToCart = quickAddToCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.clearCartFromPos = clearCartFromPos;
window.changeOrderStatus = changeOrderStatus;
window.deleteOrder = deleteOrder;
window.viewOrderDetails = viewOrderDetails;

// ============================================
// TABS DE PEDIDOS
// ============================================

function initializeTabsEventListeners() {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', handleTabChange);
    });
    
    // Filtros de historial
    const historyFilterButtons = document.querySelectorAll('.orders-history-controls .filter-btn');
    historyFilterButtons.forEach(btn => {
        btn.addEventListener('click', handleStatusFilter);
    });
    
    // Búsqueda de historial
    if (historySearchInput) {
        historySearchInput.addEventListener('input', handleHistorySearch);
    }
    
    // Botón de exportar todo
    const exportAllOrdersBtn = document.getElementById('exportAllOrdersBtn');
    if (exportAllOrdersBtn) {
        exportAllOrdersBtn.addEventListener('click', exportAllOrdersToExcel);
    }
}

function handleTabChange(e) {
    const targetTab = e.currentTarget.dataset.tab;
    
    // Actualizar botones
    tabButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Actualizar contenido
    tabNuevoPedido.classList.remove('active');
    tabHistorial.classList.remove('active');
    
    if (targetTab === 'nuevo-pedido') {
        tabNuevoPedido.classList.add('active');
    } else {
        tabHistorial.classList.add('active');
        renderOrdersHistory();
    }
    
    currentOrdersTab = targetTab;
}

// ============================================
// RENDERIZAR HISTORIAL DE PEDIDOS
// ============================================

function renderOrdersHistory(ordersToRender = null) {
    const filteredOrders = ordersToRender || orders;
    
    if (filteredOrders.length === 0) {
        ordersHistoryGrid.innerHTML = '';
        emptyHistoryState.style.display = 'flex';
        return;
    }
    
    emptyHistoryState.style.display = 'none';
    
    // Ordenar por fecha (más recientes primero)
    const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    ordersHistoryGrid.innerHTML = sortedOrders.map(order => {
        const statusInfo = getOrderStatusInfo(order.status);
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('es-AR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="order-history-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-number">
                        <i class="fas fa-receipt"></i>
                        <span>Pedido #${order.orderNumber}</span>
                    </div>
                    <span class="order-status ${statusInfo.class}">
                        <i class="${statusInfo.icon}"></i>
                        ${statusInfo.text}
                    </span>
                </div>
                
                <div class="order-customer-info">
                    <div class="info-item">
                        <i class="fas fa-user"></i>
                        <span>${order.customer.name}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-phone"></i>
                        <span>${order.customer.phone}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formattedDate}</span>
                    </div>
                </div>
                
                <div class="order-items-summary">
                    <strong>${order.items.length}</strong> producto${order.items.length !== 1 ? 's' : ''} 
                    (${order.items.reduce((sum, item) => sum + item.quantity, 0)} unidades)
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        Total: <strong>$${order.total.toFixed(2)}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn-icon" onclick="viewOrderDetails(${order.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-success" onclick="exportSingleOrder(${order.id})" title="Exportar a Excel">
                            <i class="fas fa-file-excel"></i>
                        </button>
                        <select class="order-status-select" onchange="changeOrderStatus(${order.id}, this.value)">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completado</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                        </select>
                        <button class="btn-icon btn-delete" onclick="deleteOrder(${order.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getOrderStatusInfo(status) {
    const statusMap = {
        pending: {
            class: 'status-pending',
            icon: 'fas fa-clock',
            text: 'Pendiente'
        },
        completed: {
            class: 'status-completed',
            icon: 'fas fa-check-circle',
            text: 'Completado'
        },
        cancelled: {
            class: 'status-cancelled',
            icon: 'fas fa-times-circle',
            text: 'Cancelado'
        }
    };
    return statusMap[status] || statusMap.pending;
}

// ============================================
// ACCIONES DEL HISTORIAL
// ============================================

function changeOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        saveOrdersToStorage();
        renderOrdersHistory();
        showNotification(`Estado del pedido actualizado a ${getOrderStatusInfo(newStatus).text}`, 'success');
    }
}

function deleteOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    if (confirm(`¿Estás seguro de eliminar el pedido #${order.orderNumber}?`)) {
        orders = orders.filter(o => o.id !== orderId);
        saveOrdersToStorage();
        renderOrdersHistory();
        showNotification('Pedido eliminado correctamente', 'success');
    }
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const orderDate = new Date(order.date).toLocaleDateString('es-AR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const itemsList = order.items.map(item => 
        `• ${item.name} (${item.code}) - ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`
    ).join('\n');
    
    const details = `
PEDIDO #${order.orderNumber}
Estado: ${getOrderStatusInfo(order.status).text}
Fecha: ${orderDate}

CLIENTE:
${order.customer.name}
${order.customer.phone}
${order.customer.email}
${order.customer.address}

PRODUCTOS:
${itemsList}

${order.notes ? `NOTAS:\n${order.notes}\n\n` : ''}TOTAL: $${order.total.toFixed(2)}
    `.trim();
    
    alert(details);
}

// ============================================
// FILTROS DEL HISTORIAL
// ============================================

function handleStatusFilter(e) {
    const status = e.currentTarget.dataset.status;
    currentStatusFilter = status;
    
    // Actualizar botón activo
    const historyFilterButtons = document.querySelectorAll('.orders-history-controls .filter-btn');
    historyFilterButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Filtrar pedidos
    if (status === 'todos') {
        renderOrdersHistory(orders);
    } else {
        const filtered = orders.filter(o => o.status === status);
        renderOrdersHistory(filtered);
    }
}

function handleHistorySearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = orders.filter(order => 
        order.orderNumber.toString().includes(searchTerm) ||
        order.customer.name.toLowerCase().includes(searchTerm) ||
        order.customer.phone.includes(searchTerm) ||
        order.customer.email.toLowerCase().includes(searchTerm)
    );
    
    // Aplicar también el filtro de estado si no es "todos"
    const finalFiltered = currentStatusFilter === 'todos' 
        ? filtered 
        : filtered.filter(o => o.status === currentStatusFilter);
    
    renderOrdersHistory(finalFiltered);
}

// ============================================
// EXPORTACIÓN A EXCEL
// ============================================

function exportAllOrdersToExcel() {
    if (orders.length === 0) {
        alert('No hay pedidos para exportar');
        return;
    }

    // Preparar datos para el Excel
    const data = [];
    
    // Encabezados
    data.push(['Pedido', 'Fecha', 'Cliente', 'Teléfono', 'Email', 'Items', 'Total', 'Estado']);
    
    // Agregar cada pedido
    orders.forEach(order => {
        const statusText = {
            'pending': 'Pendiente',
            'completed': 'Completado',
            'cancelled': 'Cancelado'
        }[order.status] || order.status;
        
        data.push([
            order.orderNumber,
            new Date(order.date).toLocaleDateString('es-AR'),
            order.customer.name,
            order.customer.phone,
            order.customer.email,
            order.items.length,
            `$${order.total.toLocaleString('es-AR', {minimumFractionDigits: 2})}`,
            statusText
        ]);
    });
    
    // Crear el libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
        { wch: 10 },  // Pedido
        { wch: 12 },  // Fecha
        { wch: 25 },  // Cliente
        { wch: 15 },  // Teléfono
        { wch: 30 },  // Email
        { wch: 8 },   // Items
        { wch: 15 },  // Total
        { wch: 12 }   // Estado
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    
    // Descargar el archivo
    const date = new Date().toLocaleDateString('es-AR').replace(/\//g, '-');
    XLSX.writeFile(wb, `Pedidos_Distribuidora_MC_${date}.xlsx`);
}

function exportSingleOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        alert('Pedido no encontrado');
        return;
    }

    // Preparar datos para el Excel
    const data = [];
    
    // Información del pedido
    data.push(['DISTRIBUIDORA MC - DETALLE DE PEDIDO']);
    data.push([]);
    data.push(['Número de Pedido:', order.orderNumber]);
    data.push(['Fecha:', new Date(order.date).toLocaleDateString('es-AR')]);
    data.push(['Estado:', {
        'pending': 'Pendiente',
        'completed': 'Completado',
        'cancelled': 'Cancelado'
    }[order.status]]);
    data.push([]);
    
    // Información del cliente
    data.push(['DATOS DEL CLIENTE']);
    data.push(['Nombre:', order.customer.name]);
    data.push(['Teléfono:', order.customer.phone]);
    data.push(['Email:', order.customer.email]);
    if (order.customer.address) {
        data.push(['Dirección:', order.customer.address]);
    }
    data.push([]);
    
    // Productos
    data.push(['PRODUCTOS']);
    data.push(['Producto', 'Precio Unitario', 'Cantidad', 'Subtotal']);
    
    order.items.forEach(item => {
        data.push([
            item.name,
            `$${item.price.toLocaleString('es-AR', {minimumFractionDigits: 2})}`,
            item.quantity,
            `$${(item.price * item.quantity).toLocaleString('es-AR', {minimumFractionDigits: 2})}`
        ]);
    });
    
    data.push([]);
    data.push(['', '', 'TOTAL:', `$${order.total.toLocaleString('es-AR', {minimumFractionDigits: 2})}`]);
    
    // Crear el libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
        { wch: 30 },
        { wch: 18 },
        { wch: 12 },
        { wch: 18 }
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, `Pedido ${order.orderNumber}`);
    
    // Descargar el archivo
    XLSX.writeFile(wb, `Pedido_${order.orderNumber}.xlsx`);
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Sistema de Pedidos MC...');
    
    // PRIMERO: Inicializar elementos del DOM
    initializeDOMElements();
    
    // SEGUNDO: Cargar datos desde localStorage
    loadCartFromStorage();
    loadOrdersFromStorage();
    
    // TERCERO: Inicializar event listeners (antes de renderizar)
    initializeOrdersEventListeners();
    initializeTabsEventListeners();
    
    // CUARTO: Esperar a que el inventario esté disponible
    const waitForInventory = setInterval(() => {
        if (window.inventory && window.inventory.length >= 0) {
            clearInterval(waitForInventory);
            
            console.log(`📦 Inventario cargado: ${window.inventory.length} productos`);
            
            // Renderizar productos
            renderProductsForOrders();
            
            // Renderizar filtros de categorías
            renderOrderCategoryFilters();
            
            // Renderizar carrito POS
            renderPosCart();
            
            // Actualizar badge del carrito
            updateCartBadge();
            
            console.log('✅ Sistema de Pedidos MC cargado correctamente! 🛒');
        }
    }, 50);
    
    // Timeout de seguridad (5 segundos)
    setTimeout(() => {
        clearInterval(waitForInventory);
        if (!window.inventory) {
            console.warn('⚠️ No se pudo cargar el inventario');
            window.inventory = [];
            renderProductsForOrders();
            renderOrderCategoryFilters();
        }
    }, 5000);
});

