// ============================================
// DASHBOARD ADMINISTRATIVO
// ============================================

let salesByDayChart, monthlyRevenueChart, categoriesChart;

// ============================================
// DATOS DE DEMOSTRACIÓN 2025 (+30% CRECIMIENTO)
// ============================================

function generateMockData2025() {
    // Productos de demostración
    const productos = [
        { id: 1, name: 'Jamón Cocido Premium', code: 'JAM-001', category: 'Jamones', price: 3500, stock: 45, minStock: 20 },
        { id: 2, name: 'Salame Italiano', code: 'SAL-002', category: 'Embutidos', price: 4200, stock: 38, minStock: 15 },
        { id: 3, name: 'Queso Muzzarella', code: 'QUE-003', category: 'Quesos', price: 2800, stock: 52, minStock: 25 },
        { id: 4, name: 'Mortadela con Aceitunas', code: 'MOR-004', category: 'Embutidos', price: 2200, stock: 8, minStock: 15 },
        { id: 5, name: 'Jamón Crudo', code: 'JAM-005', category: 'Jamones', price: 5500, stock: 28, minStock: 10 },
        { id: 6, name: 'Queso Provolone', code: 'QUE-006', category: 'Quesos', price: 3800, stock: 6, minStock: 12 },
        { id: 7, name: 'Salchichón', code: 'SAL-007', category: 'Embutidos', price: 3200, stock: 41, minStock: 18 },
        { id: 8, name: 'Pavita al Roquefort', code: 'PAV-008', category: 'Carnes Frías', price: 4800, stock: 22, minStock: 15 },
    ];
    
    // Clientes de demostración
    const clientes = [
        { id: 1, name: 'Carnicería El Buen Sabor', phone: '2475-123456' },
        { id: 2, name: 'Supermercado La Esquina', phone: '2475-234567' },
        { id: 3, name: 'Fiambrería Don José', phone: '2475-345678' },
        { id: 4, name: 'Almacén Los Tres Hermanos', phone: '2475-456789' },
        { id: 5, name: 'Rotisería El Buen Gusto', phone: '2475-567890' },
        { id: 6, name: 'Parrilla La Estancia', phone: '2475-678901' },
        { id: 7, name: 'Comercio La Familia', phone: '2475-789012' },
    ];
    
    // Generar pedidos del 2025 (último año completo + enero 2026)
    const pedidos = [];
    let pedidoId = 1;
    
    // Base mensual (con crecimiento del 30% vs 2024)
    const baseMonthly2024 = 180000; // Base 2024
    const baseMonthly2025 = baseMonthly2024 * 1.3; // +30% en 2025
    
    // Generar pedidos para 2025 (12 meses) + enero 2026
    for (let mes = 0; mes < 13; mes++) {
        const fecha = new Date(2025, mes, 1);
        const diasEnMes = new Date(2025, mes + 1, 0).getDate();
        
        // Variación estacional (+20% dic, +15% jun/jul)
        let factorEstacional = 1;
        if (mes === 11) factorEstacional = 1.2; // Diciembre
        if (mes === 5 || mes === 6) factorEstacional = 1.15; // Jun/Jul
        
        const ingresoMensual = baseMonthly2025 * factorEstacional;
        const pedidosPorMes = 18 + Math.floor(Math.random() * 8); // 18-25 pedidos/mes
        
        for (let p = 0; p < pedidosPorMes; p++) {
            const dia = Math.floor(Math.random() * diasEnMes) + 1;
            const fechaPedido = new Date(2025, mes, dia);
            
            // Si es enero 2026, ajustar año
            if (mes === 12) {
                fechaPedido.setFullYear(2026);
            }
            
            const cliente = clientes[Math.floor(Math.random() * clientes.length)];
            const numItems = 2 + Math.floor(Math.random() * 5); // 2-6 items por pedido
            const items = [];
            let total = 0;
            
            for (let i = 0; i < numItems; i++) {
                const producto = productos[Math.floor(Math.random() * productos.length)];
                const cantidad = 1 + Math.floor(Math.random() * 8); // 1-8 unidades
                const subtotal = producto.price * cantidad;
                
                items.push({
                    productId: producto.id,
                    producto_id: producto.id,
                    quantity: cantidad,
                    cantidad: cantidad,
                    price: producto.price,
                    subtotal: subtotal
                });
                
                total += subtotal;
            }
            
            pedidos.push({
                id: pedidoId++,
                fecha: fechaPedido.toISOString().split('T')[0],
                cliente_id: cliente.id,
                customer: { id: cliente.id, name: cliente.name },
                items: items,
                total: total,
                estado: 'completado'
            });
        }
    }
    
    return { pedidos, productos, clientes };
}

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        // Cargar datos desde Supabase o localStorage
        let pedidos = await getPedidos();
        let productos = await getProductos();
        let clientes = await getClientes();
        
        // Si no hay datos reales, usar datos de demostración del 2025
        const useMockData = pedidos.length === 0;
        if (useMockData) {
            console.log('📊 Usando datos de demostración del 2025 (+30% crecimiento)');
            const mockData = generateMockData2025();
            pedidos = mockData.pedidos;
            productos = mockData.productos;
            clientes = mockData.clientes;
        }
        
        // Actualizar cards
        updateStatsCards(pedidos, productos, clientes);
        
        // Generar gráficos
        generateSalesByDayChart(pedidos);
        generateMonthlyRevenueChart(pedidos);
        generateCategoriesChart(pedidos, productos);
        
        // Actualizar tablas
        updateTopClientsTable(pedidos, clientes);
        updateTopProduct(pedidos, productos);
        
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

// ============================================
// OBTENER DATOS
// ============================================

async function getPedidos() {
    if (window.supabaseDB && typeof window.supabaseDB.getPedidos === 'function') {
        return await window.supabaseDB.getPedidos();
    }
    // Fallback a localStorage
    return JSON.parse(localStorage.getItem('distributoraMC_orders') || '[]');
}

async function getProductos() {
    if (window.supabaseDB && typeof window.supabaseDB.getProductos === 'function') {
        return await window.supabaseDB.getProductos();
    }
    return JSON.parse(localStorage.getItem('distributoraMC_inventory') || '[]');
}

async function getClientes() {
    if (window.supabaseDB && typeof window.supabaseDB.getClientes === 'function') {
        return await window.supabaseDB.getClientes();
    }
    return JSON.parse(localStorage.getItem('distributoraMC_clients') || '[]');
}

// ============================================
// ACTUALIZAR STATS CARDS
// ============================================

function updateStatsCards(pedidos, productos, clientes) {
    // Ventas del día
    const today = new Date().toISOString().split('T')[0];
    const todaySales = pedidos
        .filter(p => p.fecha && p.fecha.startsWith(today))
        .reduce((sum, p) => sum + (p.total || 0), 0);
    
    document.getElementById('todaySales').textContent = `$${todaySales.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
    
    // Calcular cambio vs ayer
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const yesterdaySales = pedidos
        .filter(p => p.fecha && p.fecha.startsWith(yesterday))
        .reduce((sum, p) => sum + (p.total || 0), 0);
    
    const salesChange = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales * 100) : 0;
    const salesChangeEl = document.getElementById('salesChange');
    salesChangeEl.textContent = `${salesChange > 0 ? '+' : ''}${salesChange.toFixed(1)}%`;
    salesChangeEl.className = `stat-change ${salesChange >= 0 ? 'positive' : 'negative'}`;
    
    // Pedidos del mes
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyOrders = pedidos.filter(p => p.fecha && p.fecha.startsWith(currentMonth)).length;
    document.getElementById('monthlyOrders').textContent = monthlyOrders;
    
    // Stock bajo
    const lowStockCount = productos.filter(p => p.stock <= (p.minStock || 10)).length;
    document.getElementById('lowStock').textContent = lowStockCount;
    
    // Clientes activos (último mes)
    const lastMonth = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const activeClientsIds = new Set(
        pedidos
            .filter(p => p.fecha && p.fecha >= lastMonth)
            .map(p => p.cliente_id || p.customer?.id)
            .filter(id => id)
    );
    document.getElementById('activeClients').textContent = activeClientsIds.size;
}

// ============================================
// GRÁFICO: VENTAS POR DÍA
// ============================================

function generateSalesByDayChart(pedidos) {
    const ctx = document.getElementById('salesByDayChart');
    if (!ctx) return;
    
    // Preparar datos de últimos 30 días
    const days = [];
    const sales = [];
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(Date.now() - i * 86400000);
        const dateStr = date.toISOString().split('T')[0];
        days.push(date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }));
        
        const daySales = pedidos
            .filter(p => p.fecha && p.fecha.startsWith(dateStr))
            .reduce((sum, p) => sum + (p.total || 0), 0);
        
        sales.push(daySales);
    }
    
    if (salesByDayChart) salesByDayChart.destroy();
    
    salesByDayChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Ventas ($)',
                data: sales,
                borderColor: '#DC2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14 },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: (context) => `$${context.parsed.y.toLocaleString('es-AR', {minimumFractionDigits: 2})}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => `$${value.toLocaleString('es-AR')}`
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ============================================
// GRÁFICO: INGRESOS MENSUALES
// ============================================

function generateMonthlyRevenueChart(pedidos) {
    const ctx = document.getElementById('monthlyRevenueChart');
    if (!ctx) return;
    
    // Preparar datos de últimos 6 meses
    const months = [];
    const revenue = [];
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toISOString().slice(0, 7);
        
        months.push(date.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }));
        
        const monthRevenue = pedidos
            .filter(p => p.fecha && p.fecha.startsWith(monthStr))
            .reduce((sum, p) => sum + (p.total || 0), 0);
        
        revenue.push(monthRevenue);
    }
    
    if (monthlyRevenueChart) monthlyRevenueChart.destroy();
    
    monthlyRevenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Ingresos ($)',
                data: revenue,
                backgroundColor: '#DC2626',
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: (context) => `$${context.parsed.y.toLocaleString('es-AR', {minimumFractionDigits: 2})}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (value) => `$${value.toLocaleString('es-AR')}`
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ============================================
// GRÁFICO: CATEGORÍAS MÁS VENDIDAS
// ============================================

function generateCategoriesChart(pedidos, productos) {
    const ctx = document.getElementById('categoriesChart');
    if (!ctx) return;
    
    // Contar ventas por categoría
    const categoryCount = {};
    
    pedidos.forEach(pedido => {
        if (pedido.items && Array.isArray(pedido.items)) {
            pedido.items.forEach(item => {
                const producto = productos.find(p => p.id === item.productId || p.id === item.producto_id);
                if (producto) {
                    const category = producto.category || 'Sin categoría';
                    categoryCount[category] = (categoryCount[category] || 0) + (item.quantity || item.cantidad || 0);
                }
            });
        }
    });
    
    // Ordenar y tomar top 5
    const sortedCategories = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const labels = sortedCategories.map(([cat]) => cat);
    const data = sortedCategories.map(([, count]) => count);
    
    const colors = [
        '#DC2626',
        '#EF4444',
        '#F87171',
        '#FCA5A5',
        '#FEE2E2'
    ];
    
    if (categoriesChart) categoriesChart.destroy();
    
    categoriesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: (context) => `${context.label}: ${context.parsed} unidades`
                    }
                }
            }
        }
    });
}

// ============================================
// TABLA: TOP 5 CLIENTES
// ============================================

function updateTopClientsTable(pedidos, clientes) {
    const tbody = document.getElementById('topClientsTable');
    if (!tbody) return;
    
    // Calcular totales por cliente
    const clienteTotales = {};
    
    pedidos.forEach(pedido => {
        const clienteId = pedido.cliente_id || pedido.customer?.id;
        if (clienteId) {
            if (!clienteTotales[clienteId]) {
                clienteTotales[clienteId] = {
                    total: 0,
                    pedidos: 0,
                    nombre: ''
                };
            }
            clienteTotales[clienteId].total += pedido.total || 0;
            clienteTotales[clienteId].pedidos++;
        }
    });
    
    // Agregar nombres
    Object.keys(clienteTotales).forEach(clienteId => {
        const cliente = clientes.find(c => c.id === parseInt(clienteId) || c.id === clienteId);
        clienteTotales[clienteId].nombre = cliente ? cliente.name || cliente.nombre : `Cliente #${clienteId}`;
    });
    
    // Ordenar y tomar top 5
    const topClientes = Object.entries(clienteTotales)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5);
    
    if (topClientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="table-empty">No hay datos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = topClientes.map(([id, data], index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${data.nombre}</strong></td>
            <td class="text-success">$${data.total.toLocaleString('es-AR', {minimumFractionDigits: 2})}</td>
            <td>${data.pedidos}</td>
        </tr>
    `).join('');
}

// ============================================
// PRODUCTO MÁS VENDIDO
// ============================================

function updateTopProduct(pedidos, productos) {
    const container = document.getElementById('topProduct');
    if (!container) return;
    
    // Contar ventas por producto
    const productCount = {};
    
    pedidos.forEach(pedido => {
        if (pedido.items && Array.isArray(pedido.items)) {
            pedido.items.forEach(item => {
                const productId = item.productId || item.producto_id;
                if (productId) {
                    productCount[productId] = (productCount[productId] || 0) + (item.quantity || item.cantidad || 0);
                }
            });
        }
    });
    
    if (Object.keys(productCount).length === 0) {
        container.innerHTML = '<div class="top-product-empty">No hay datos disponibles</div>';
        return;
    }
    
    // Encontrar el más vendido
    const topProductId = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])[0][0];
    
    const topProductCount = productCount[topProductId];
    const producto = productos.find(p => p.id === parseInt(topProductId) || p.id === topProductId);
    
    if (!producto) {
        container.innerHTML = '<div class="top-product-empty">Producto no encontrado</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="top-product-content">
            <div class="top-product-icon">
                <i class="fas fa-box"></i>
            </div>
            <div class="top-product-info">
                <h4>${producto.name || producto.nombre}</h4>
                <p class="top-product-code">${producto.code || producto.codigo || 'Sin código'}</p>
                <div class="top-product-stats">
                    <div class="top-product-stat">
                        <span class="stat-label">Unidades vendidas</span>
                        <span class="stat-value">${topProductCount}</span>
                    </div>
                    <div class="top-product-stat">
                        <span class="stat-label">Precio unitario</span>
                        <span class="stat-value">$${(producto.price || producto.precio || 0).toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}
