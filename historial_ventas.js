// =======================
// Historial de Ventas Pro
// =======================

let ventas = [];
let clientes = [];
let currentPage = 1;
const pageSize = 10;
let filtroCliente = '';
let filtroEstado = '';
let filtroFecha = '';
let filtroIdVenta = '';

async function cargarDatos() {
    mostrarEstado('loading');
    try {
        // Cargar clientes
        const { data: clientesData } = await window.supabaseDB.supabase.from('clientes').select('*');
        clientes = clientesData || [];

        // Cargar ventas con filtros
        let query = window.supabaseDB.supabase.from('ventas').select('*');
        if (filtroEstado) query = query.eq('estado', filtroEstado);
        if (filtroIdVenta) query = query.eq('id', filtroIdVenta);
        if (filtroFecha) query = query.gte('fecha', filtroFecha);
        query = query.order('fecha', { ascending: false }).range((currentPage-1)*pageSize, currentPage*pageSize-1);

        const { data: ventasData, error } = await query;
        if (error) throw error;
        ventas = ventasData || [];
        renderVentas();
    } catch (err) {
        mostrarEstado('error', err.message);
    }
}

function renderVentas() {
    const container = document.getElementById('ventasContainer');
    if (!container) return;
    if (ventas.length === 0) {
        mostrarEstado('empty');
        return;
    }
    container.innerHTML = ventas.map(v => {
        const cliente = clientes.find(c => c.id === v.cliente_id);
        return `
            <div class="venta-item">
                <div>
                    <strong>#${v.id}</strong> - ${cliente ? cliente.nombre : 'Cliente desconocido'}
                    <span>${new Date(v.fecha).toLocaleString()}</span>
                    <span>Estado: ${v.estado || 'Pendiente'}</span>
                    <span>Total: $${v.total.toFixed(2)}</span>
                </div>
                <button class="btn-detalle" data-id="${v.id}">Ver Detalle</button>
            </div>
        `;
    }).join('');
    // Paginación
    renderPaginacion();
    // Eventos detalle
    document.querySelectorAll('.btn-detalle').forEach(btn => {
        btn.onclick = () => mostrarDetalleVenta(parseInt(btn.dataset.id));
    });
}

function mostrarDetalleVenta(ventaId) {
    const venta = ventas.find(v => v.id === ventaId);
    if (!venta) return;
    const cliente = clientes.find(c => c.id === venta.cliente_id);
    const detalle = document.getElementById('detalleVenta');
    if (!detalle) return;
    const productos = JSON.parse(venta.productos);
    detalle.innerHTML = `
        <h3>Detalle de Venta #${venta.id}</h3>
        <p>Cliente: ${cliente ? cliente.nombre : 'Cliente desconocido'}</p>
        <p>Fecha: ${new Date(venta.fecha).toLocaleString()}</p>
        <p>Estado: ${venta.estado || 'Pendiente'}</p>
        <ul>
            ${productos.map(p => `
                <li>Producto #${p.producto_id} - Cantidad: ${p.cantidad} - Precio Unitario: $${p.precio_unitario.toFixed(2)}</li>
            `).join('')}
        </ul>
        <p>Total: $${venta.total.toFixed(2)}</p>
        <button onclick="cerrarDetalleVenta()">Cerrar</button>
    `;
    detalle.style.display = 'block';
}

function cerrarDetalleVenta() {
    const detalle = document.getElementById('detalleVenta');
    if (detalle) detalle.style.display = 'none';
}

function mostrarEstado(tipo, mensaje = '') {
    const container = document.getElementById('ventasContainer');
    if (!container) return;
    if (tipo === 'loading') {
        container.innerHTML = '<p>Cargando ventas...</p>';
    } else if (tipo === 'empty') {
        container.innerHTML = '<p>Sin ventas todavía.</p>';
    } else if (tipo === 'error') {
        container.innerHTML = `<p>Error: ${mensaje || 'No se pudieron cargar las ventas.'}</p>`;
    }
}

function renderPaginacion() {
    const paginacion = document.getElementById('ventasPaginacion');
    if (!paginacion) return;
    paginacion.innerHTML = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="cambiarPagina(-1)">Anterior</button>
        <span>Página ${currentPage}</span>
        <button onclick="cambiarPagina(1)">Siguiente</button>
    `;
}

function cambiarPagina(delta) {
    currentPage = Math.max(1, currentPage + delta);
    cargarDatos();
}

// Buscador y filtros
document.getElementById('buscadorCliente').oninput = debounce(e => {
    filtroCliente = e.target.value.trim();
    cargarDatos();
}, 300);

document.getElementById('buscadorIdVenta').oninput = debounce(e => {
    filtroIdVenta = e.target.value.trim();
    cargarDatos();
}, 300);

document.getElementById('filtroEstado').onchange = e => {
    filtroEstado = e.target.value;
    cargarDatos();
};

document.getElementById('filtroFecha').onchange = e => {
    filtroFecha = e.target.value;
    cargarDatos();
};

// Debounce para performance
function debounce(fn, ms) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
    };
}

// Inicializar
document.addEventListener('DOMContentLoaded', cargarDatos);
