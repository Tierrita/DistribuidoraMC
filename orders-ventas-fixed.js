// ============================================
// SISTEMA DE PEDIDOS - Distribuidora MC (FIXED)
// ============================================

// Variables globales
let cart = [];
let orders = [];
let currentOrdersTab = 'nuevo-pedido';
let currentStatusFilter = 'todos';
let currentCustomerData = null;
let allClients = [];
let selectedClient = null;

// Elementos del DOM (se inicializarán cuando el DOM esté listo)
let productsOrderGrid, orderSearchInput, emptyOrderState;
let posCartItems, posSubtotal, posTotal, posItemsCount, btnCheckoutPos, btnClearCartPos;
let ordersHistoryGrid, historySearchInput, emptyHistoryState;
let tabButtons, tabNuevoPedido, tabHistorial;
let cartButton, cartBadge, cartModal, cartModalClose;
let cartItems, emptyCart, cartTotal, btnClearCart, btnCheckout;
let checkoutModal, checkoutModalClose, btnCancelCheckout, checkoutForm;
let checkoutItems, checkoutTotal, confirmationModal, orderNumber;
let btnNewOrder, btnViewOrders;

// ============================================
// UTILIDADES PARA MANEJO SEGURO DEL DOM
// ============================================

/**
 * Obtiene un elemento del DOM de forma segura
 * @param {string} id - ID del elemento
 * @param {boolean} required - Si es true, loguea warning si no existe
 * @returns {HTMLElement|null}
 */
function safeGetElement(id, required = false) {
    const element = document.getElementById(id);
    if (!element && required) {
        console.warn(`⚠️ Elemento requerido no encontrado: #${id}`);
    }
    return element;
}

/**
 * Setea textContent de forma segura
 */
function safeSetText(id, text) {
    const element = safeGetElement(id);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Setea estilo de forma segura
 */
function safeSetStyle(id, property, value) {
    const element = safeGetElement(id);
    if (element) {
        element.style[property] = value;
    }
}

/**
 * Setea disabled de forma segura
 */
function safeSetDisabled(id, disabled) {
    const element = safeGetElement(id);
    if (element) {
        element.disabled = disabled;
    }
}

// ============================================
// DEBOUNCE UTILITY
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// ESCAPE HTML
// ============================================

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// INICIALIZACIÓN DEL DOM
// ============================================

function initializeDOMElements() {
    // Productos y pedidos
    productsOrderGrid = safeGetElement('productsOrderGrid');
    orderSearchInput = safeGetElement('orderSearchInput');
    emptyOrderState = safeGetElement('emptyOrderState');
    
    // POS Cart
    posCartItems = safeGetElement('posCartItems');
    posSubtotal = safeGetElement('posSubtotal');
    posTotal = safeGetElement('posTotal');
    posItemsCount = safeGetElement('posItemsCount');
    btnCheckoutPos = safeGetElement('btnCheckoutPos');
    btnClearCartPos = safeGetElement('btnClearCartPos');
    
    // Historial
    ordersHistoryGrid = safeGetElement('ordersHistoryGrid');
    historySearchInput = safeGetElement('historySearchInput');
    emptyHistoryState = safeGetElement('emptyHistoryState');
    
    // Tabs
    tabButtons = document.querySelectorAll('.orders-tabs .tab-btn');
    tabNuevoPedido = safeGetElement('tabNuevoPedido');
    tabHistorial = safeGetElement('tabHistorial');
    
    // Cart y Modales
    cartButton = safeGetElement('cartButton');
    cartBadge = safeGetElement('cartBadge');
    cartModal = safeGetElement('cartModal');
    cartModalClose = safeGetElement('cartModalClose');
    cartItems = safeGetElement('cartItems');
    emptyCart = safeGetElement('emptyCart');
    cartTotal = safeGetElement('cartTotal');
    btnClearCart = safeGetElement('btnClearCart');
    btnCheckout = safeGetElement('btnCheckout');
    checkoutModal = safeGetElement('checkoutModal');
    checkoutModalClose = safeGetElement('checkoutModalClose');
    btnCancelCheckout = safeGetElement('btnCancelCheckout');
    checkoutForm = safeGetElement('checkoutForm');
    checkoutItems = safeGetElement('checkoutItems');
    checkoutTotal = safeGetElement('checkoutTotal');
    confirmationModal = safeGetElement('confirmationModal');
    orderNumber = safeGetElement('orderNumber');
    btnNewOrder = safeGetElement('btnNewOrder');
    btnViewOrders = safeGetElement('btnViewOrders');
    
    console.log('✅ Elementos del DOM inicializados');
}

// ============================================
// CARGAR CLIENTES
// ============================================

async function loadClientsData() {
    try {
        if (window.supabaseDB && typeof window.supabaseDB.getClientes === 'function') {
            allClients = await window.supabaseDB.getClientes();
            console.log('✅ Clientes cargados desde Supabase:', allClients.length);
            return;
        }
    } catch (error) {
        console.warn('⚠️ Error al cargar desde Supabase:', error.message);
    }
    
    // Fallback a localStorage
    try {
        const stored = localStorage.getItem('distributoraMC_clients');
        allClients = stored ? JSON.parse(stored) : [];
        console.log('📦 Clientes cargados desde localStorage:', allClients.length);
    } catch (error) {
        console.error('❌ Error al cargar clientes:', error);
        allClients = [];
    }
}

// ============================================
// CARGAR PEDIDOS
// ============================================

async function loadOrdersFromStorage() {
    try {
        if (window.supabaseDB && typeof window.supabaseDB.getPedidos === 'function') {
            const pedidos = await window.supabaseDB.getPedidos();
            orders = pedidos.map(p => ({
                id: p.id,
                orderNumber: p.order_number,
                date: p.created_at,
                customer: {
                    name: p.customer_name,
                    phone: p.customer_phone || '',
                    email: p.customer_email || '',
                    address: p.customer_address || ''
                },
                items: p.pedido_items || [],
                total: parseFloat(p.total) || 0,
                notes: p.notes || '',
                status: p.status || 'pendiente'
            }));
            console.log('✅ Pedidos cargados desde Supabase:', orders.length);
            return;
        }
    } catch (error) {
        console.warn('⚠️ Error al cargar pedidos desde Supabase:', error.message);
        if (error.message && error.message.includes('pedido_items')) {
            console.error('💡 SOLUCIÓN: La tabla pedido_items no existe o la relación no está configurada.');
            console.error('💡 Ejecuta el archivo sql/setup_ventas.sql en Supabase SQL Editor');
        }
    }
    
    // Fallback a localStorage
    try {
        const stored = localStorage.getItem('distributoraMC_orders');
        orders = stored ? JSON.parse(stored) : [];
        console.log('📦 Pedidos cargados desde localStorage:', orders.length);
    } catch (error) {
        console.error('❌ Error al cargar pedidos:', error);
        orders = [];
    }
}

// ============================================
// SELECTOR DE CLIENTES (CON PROTECCIÓN)
// ============================================

function initializeClientSelector() {
    const clientSearchInput = safeGetElement('clientSearch');
    const clientSearchResults = safeGetElement('clientSearchResults');
    
    if (!clientSearchInput || !clientSearchResults) {
        console.warn('⚠️ Elementos de búsqueda de clientes no disponibles en esta vista');
        return;
    }
    
    // Focus y click
    clientSearchInput.addEventListener('focus', showAllClients);
    clientSearchInput.addEventListener('click', showAllClients);
    
    // Búsqueda con debounce
    const debouncedSearch = debounce((query) => {
        if (query.length === 0) {
            showAllClients();
            return;
        }
        
        const filtered = allClients.filter(client => {
            const name = client.name.toLowerCase();
            const phone = client.phone || '';
            const address = (client.address || '').toLowerCase();
            
            return name.includes(query) || phone.includes(query) || address.includes(query);
        });
        
        displayClientResults(filtered, query);
    }, 300);
    
    clientSearchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value.toLowerCase().trim());
    });
    
    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!clientSearchInput.contains(e.target) && !clientSearchResults.contains(e.target)) {
            clientSearchResults.classList.remove('active');
        }
    });
    
    console.log('✅ Selector de clientes inicializado');
}

function showAllClients() {
    const clientSearchResults = safeGetElement('clientSearchResults');
    if (!clientSearchResults) return;
    
    if (allClients.length === 0) {
        clientSearchResults.innerHTML = `
            <div class="client-result-empty">
                <i class="fas fa-user-slash"></i>
                <p>No hay clientes registrados</p>
                <a href="clientes.html" style="color: var(--primary-color); margin-top: 0.5rem; display: inline-block;">
                    <i class="fas fa-user-plus"></i> Agregar primer cliente
                </a>
            </div>
        `;
        clientSearchResults.classList.add('active');
        return;
    }
    
    displayClientResults(allClients);
}

function displayClientResults(clients, query = '') {
    const clientSearchResults = safeGetElement('clientSearchResults');
    if (!clientSearchResults) return;
    
    if (clients.length > 0) {
        const maxResults = 10;
        const clientsToShow = clients.slice(0, maxResults);
        
        clientSearchResults.innerHTML = clientsToShow.map(client => {
            let displayName = escapeHtml(client.name);
            if (query) {
                const regex = new RegExp(`(${query})`, 'gi');
                displayName = displayName.replace(regex, '<mark>$1</mark>');
            }
            
            return `
                <div class="client-result-item" onclick="selectClient(${client.id})">
                    <div class="client-result-name">${displayName}</div>
                    <div class="client-result-info">
                        <span><i class="fas fa-phone"></i> ${escapeHtml(client.phone || 'Sin teléfono')}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(client.address || 'Sin dirección')}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        if (clients.length > maxResults) {
            clientSearchResults.innerHTML += `
                <div class="client-result-more">
                    <i class="fas fa-info-circle"></i>
                    Y ${clients.length - maxResults} cliente(s) más... Sigue escribiendo para filtrar
                </div>
            `;
        }
        
        clientSearchResults.classList.add('active');
    } else {
        clientSearchResults.innerHTML = `
            <div class="client-result-empty">
                <i class="fas fa-user-slash"></i>
                <p>No se encontraron clientes con "${query}"</p>
                <a href="clientes.html" style="color: var(--primary-color); margin-top: 0.5rem; display: inline-block;">
                    <i class="fas fa-user-plus"></i> Agregar nuevo cliente
                </a>
            </div>
        `;
        clientSearchResults.classList.add('active');
    }
}

function selectClient(clientId) {
    selectedClient = allClients.find(c => c.id === clientId);
    
    if (!selectedClient) return;
    
    // Limpiar búsqueda
    const clientSearch = safeGetElement('clientSearch');
    if (clientSearch) clientSearch.value = '';
    
    const clientSearchResults = safeGetElement('clientSearchResults');
    if (clientSearchResults) {
        clientSearchResults.classList.remove('active');
        clientSearchResults.innerHTML = '';
    }
    
    // Actualizar info (de forma segura)
    safeSetText('selectedClientName', selectedClient.name);
    safeSetText('selectedClientPhone', selectedClient.phone);
    safeSetText('selectedClientAddress', selectedClient.address || 'Sin dirección');
    
    if (selectedClient.email) {
        safeSetText('selectedClientEmail', selectedClient.email);
        safeSetStyle('selectedClientEmailWrapper', 'display', 'block');
    } else {
        safeSetStyle('selectedClientEmailWrapper', 'display', 'none');
    }
    
    safeSetStyle('selectedClientInfo', 'display', 'block');
    safeSetDisabled('btnContinueOrder', false);
    
    console.log('✅ Cliente seleccionado:', selectedClient.name);
}

// Exponer funciones globales necesarias
window.selectClient = selectClient;
window.changeSelectedClient = function() {
    selectedClient = null;
    safeSetStyle('selectedClientInfo', 'display', 'none');
    const clientSearch = safeGetElement('clientSearch');
    if (clientSearch) {
        clientSearch.value = '';
        clientSearch.focus();
    }
    safeSetDisabled('btnContinueOrder', true);
};

// ============================================
// INICIALIZACIÓN PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Sistema de Ventas MC...');
    
    try {
        // 1. Inicializar DOM
        initializeDOMElements();
        
        // 2. Cargar datos básicos
        loadCartFromStorage();
        
        // 3. Cargar datos async en paralelo
        await Promise.allSettled([
            loadClientsData(),
            loadOrdersFromStorage()
        ]);
        
        // 4. Inicializar componentes
        initializeClientSelector();
        
        // 5. Actualizar UI
        updateCartBadge();
        
        console.log('✅ Sistema de Ventas MC cargado correctamente');
        
    } catch (error) {
        console.error('❌ Error crítico al inicializar:', error);
    }
});

// Funciones auxiliares simples
function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem('distributoraMC_cart');
        cart = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        cart = [];
    }
}

function updateCartBadge() {
    if (!cartBadge) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
}
