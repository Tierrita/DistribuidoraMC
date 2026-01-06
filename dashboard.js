// ============================================
// DASHBOARD ADMINISTRATIVO
// ============================================

let salesByDayChart, monthlyRevenueChart, categoriesChart;

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await loadDashboardData();
});

async function loadDashboardData() {
    try {
        // Cargar datos desde Supabase o localStorage
        const pedidos = await getPedidos();
        const productos = await getProductos();
        const clientes = await getClientes();
        
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
