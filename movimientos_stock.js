// =============================
// Panel Movimientos Recientes de Stock
// =============================

async function cargarMovimientosStock() {
    const container = document.getElementById('movimientosStockContainer');
    if (!container || !window.supabaseDB) return;
    container.innerHTML = '<p>Cargando movimientos...</p>';
    try {
        const { data, error } = await window.supabaseDB.supabase
            .from('movimientos_stock')
            .select('*')
            .order('fecha', { ascending: false })
            .limit(20);
        if (error) throw error;
        if (!data || data.length === 0) {
            container.innerHTML = '<p>No hay movimientos recientes.</p>';
            return;
        }
        container.innerHTML = `
            <table class="movimientos-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Motivo</th>
                        <th>Referencia</th>
                        <th>Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(m => `
                        <tr>
                            <td>${new Date(m.fecha).toLocaleString()}</td>
                            <td>${m.producto_id}</td>
                            <td>${m.cantidad}</td>
                            <td>${m.motivo}</td>
                            <td>${m.referencia || '-'}</td>
                            <td>${m.usuario || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        container.innerHTML = `<p>Error al cargar movimientos: ${err.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', cargarMovimientosStock);
