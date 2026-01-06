// ============================================
// CONFIGURACIÓN DE SUPABASE - Distribuidora MC
// ============================================

// Credenciales de Supabase - Proyecto Distribuidora MC
const SUPABASE_URL = 'https://vifkbxcwwiqtddnvtnjk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PMole8xbFvk18U0WwGAljg_kHHl4RLm';

// Validar que las credenciales estén configuradas
if (SUPABASE_URL.includes('TU_SUPABASE') || SUPABASE_ANON_KEY.includes('TU_SUPABASE')) {
    console.error('⚠️ Por favor configura tus credenciales de Supabase en supabase-config.js');
}

// Inicializar cliente de Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// FUNCIONES DE BASE DE DATOS - CATEGORÍAS
// ============================================

async function getCategorias() {
    try {
        const { data, error } = await supabaseClient
            .from('categorias')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        throw error;
    }
}

async function addCategoria(categoria) {
    try {
        const { data, error } = await supabaseClient
            .from('categorias')
            .insert([{
                name: categoria.name,
                icon: categoria.icon,
                description: categoria.description
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al agregar categoría:', error);
        throw error;
    }
}

async function updateCategoria(id, categoria) {
    try {
        const { data, error } = await supabaseClient
            .from('categorias')
            .update({
                name: categoria.name,
                icon: categoria.icon,
                description: categoria.description
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        throw error;
    }
}

async function deleteCategoria(id) {
    try {
        const { error } = await supabaseClient
            .from('categorias')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        throw error;
    }
}

// ============================================
// FUNCIONES DE BASE DE DATOS - PRODUCTOS
// ============================================

async function getProductos() {
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al cargar productos:', error);
        throw error;
    }
}

async function addProducto(producto) {
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .insert([{
                code: producto.code,
                name: producto.name,
                category: producto.category,
                cost_price: producto.costPrice || 0,
                price: producto.price,
                stock: producto.stock,
                unit: producto.unit,
                min_stock: producto.minStock || 0
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al agregar producto:', error);
        throw error;
    }
}

async function updateProducto(id, producto) {
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .update({
                code: producto.code,
                name: producto.name,
                category: producto.category,
                cost_price: producto.costPrice || 0,
                price: producto.price,
                stock: producto.stock,
                unit: producto.unit,
                min_stock: producto.minStock || 0
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw error;
    }
}

async function deleteProducto(id) {
    try {
        const { error } = await supabaseClient
            .from('productos')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw error;
    }
}

async function updateStock(id, newStock) {
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .update({ stock: newStock })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al actualizar stock:', error);
        throw error;
    }
}

// ============================================
// FUNCIONES DE BASE DE DATOS - CLIENTES
// ============================================

async function getClientes() {
    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        throw error;
    }
}

async function addCliente(cliente) {
    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .insert([{
                name: cliente.name,
                email: cliente.email || null,
                phone: cliente.phone || null,
                address: cliente.address || null,
                cuit: cliente.cuit || null,
                notes: cliente.notes || null
            }])
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al agregar cliente:', error);
        throw error;
    }
}

async function updateCliente(id, cliente) {
    try {
        const { data, error } = await supabaseClient
            .from('clientes')
            .update({
                name: cliente.name,
                email: cliente.email || null,
                phone: cliente.phone || null,
                address: cliente.address || null,
                cuit: cliente.cuit || null,
                notes: cliente.notes || null
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        throw error;
    }
}

async function deleteCliente(id) {
    try {
        const { error } = await supabaseClient
            .from('clientes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        throw error;
    }
}

// ============================================
// FUNCIONES DE BASE DE DATOS - PEDIDOS
// ============================================

async function getPedidos(options = {}) {
    try {
        // Primero intentar con la relación completa
        let query = supabaseClient
            .from('pedidos')
            .select(`
                *,
                pedido_items (
                    id,
                    producto_id,
                    product_name,
                    product_brand,
                    quantity,
                    unit_price,
                    total_price
                )
            `)
            .order('created_at', { ascending: false });
        
        // Filtros opcionales
        if (options.status) {
            query = query.eq('status', options.status);
        }
        if (options.cliente_id) {
            query = query.eq('cliente_id', options.cliente_id);
        }
        if (options.limit) {
            query = query.limit(options.limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
            // Si falla, intentar sin la relación (tabla no existe)
            if (error.message && (error.message.includes('pedido_items') || error.code === '42P01')) {
                console.warn('⚠️ La tabla pedido_items no existe. Retornando pedidos sin items.');
                console.warn('💡 Ejecuta sql/setup_ventas.sql para crear las tablas necesarias');
                
                const { data: pedidosOnly, error: simpleError } = await supabaseClient
                    .from('pedidos')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (simpleError) throw simpleError;
                return (pedidosOnly || []).map(p => ({ ...p, pedido_items: [] }));
            }
            throw error;
        }
        
        return data || [];
    } catch (error) {
        console.error('❌ Error al cargar pedidos:', error);
        throw error;
    }
}

async function getPedidoById(id) {
    try {
        const { data, error } = await supabaseClient
            .from('pedidos')
            .select(`
                *,
                pedido_items (
                    id,
                    producto_id,
                    product_name,
                    product_brand,
                    product_weight,
                    quantity,
                    unit_price,
                    total_price
                )
            `)
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al cargar pedido:', error);
        throw error;
    }
}

async function addPedido(pedido) {
    try {
        // 1. Generar número de pedido único
        const orderNumber = await generateOrderNumber();
        
        // 2. Insertar el pedido principal
        const { data: pedidoData, error: pedidoError } = await supabaseClient
            .from('pedidos')
            .insert([{
                order_number: orderNumber,
                cliente_id: pedido.cliente_id || null,
                customer_name: pedido.customer_name,
                customer_phone: pedido.customer_phone || null,
                customer_email: pedido.customer_email || null,
                customer_address: pedido.customer_address || null,
                subtotal: pedido.subtotal || 0,
                discount: pedido.discount || 0,
                total: pedido.total || 0,
                status: pedido.status || 'pendiente',
                notes: pedido.notes || null,
                payment_method: pedido.payment_method || null,
                paid: pedido.paid || false
            }])
            .select()
            .single();
        
        if (pedidoError) throw pedidoError;
        
        // 3. Insertar los items del pedido
        if (pedido.items && pedido.items.length > 0) {
            const items = pedido.items.map(item => ({
                pedido_id: pedidoData.id,
                producto_id: item.producto_id || item.id || null,
                product_name: item.product_name || item.name,
                product_brand: item.product_brand || item.brand || null,
                product_weight: item.product_weight || item.weight || null,
                quantity: item.quantity,
                unit_price: item.unit_price || item.price || 0,
                total_price: item.total_price || (item.quantity * (item.unit_price || item.price || 0))
            }));
            
            const { error: itemsError } = await supabaseClient
                .from('pedido_items')
                .insert(items);
            
            if (itemsError) throw itemsError;
        }
        
        // 4. Obtener el pedido completo con items
        return await getPedidoById(pedidoData.id);
    } catch (error) {
        console.error('Error al agregar pedido:', error);
        throw error;
    }
}

async function updatePedido(id, updates) {
    try {
        const { data, error } = await supabaseClient
            .from('pedidos')
            .update({
                status: updates.status,
                notes: updates.notes,
                discount: updates.discount,
                payment_method: updates.payment_method,
                paid: updates.paid,
                completed_at: updates.status === 'completado' ? new Date().toISOString() : null
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al actualizar pedido:', error);
        throw error;
    }
}

async function updatePedidoStatus(id, status) {
    try {
        const updates = { status };
        if (status === 'completado' || status === 'entregado') {
            updates.completed_at = new Date().toISOString();
        }
        
        const { data, error } = await supabaseClient
            .from('pedidos')
            .update(updates)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        throw error;
    }
}

async function deletePedido(id) {
    try {
        // Los items se eliminan automáticamente por CASCADE
        const { error } = await supabaseClient
            .from('pedidos')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error al eliminar pedido:', error);
        throw error;
    }
}

// Función auxiliar para generar número de pedido
async function generateOrderNumber() {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    const orderNumber = `ORD-${dateStr}-${randomNum.toString().padStart(4, '0')}`;
    
    // Verificar que no exista
    const { data } = await supabaseClient
        .from('pedidos')
        .select('order_number')
        .eq('order_number', orderNumber)
        .single();
    
    // Si existe, generar otro
    if (data) {
        return await generateOrderNumber();
    }
    
    return orderNumber;
}

// Obtener estadísticas de pedidos
async function getPedidosStats() {
    try {
        const { data: pedidos, error } = await supabaseClient
            .from('pedidos')
            .select('total, status, created_at');
        
        if (error) throw error;
        
        const stats = {
            total_pedidos: pedidos.length,
            total_ventas: pedidos.reduce((sum, p) => sum + parseFloat(p.total || 0), 0),
            pendientes: pedidos.filter(p => p.status === 'pendiente').length,
            completados: pedidos.filter(p => p.status === 'completado' || p.status === 'entregado').length,
            cancelados: pedidos.filter(p => p.status === 'cancelado').length
        };
        
        return stats;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw error;
    }
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Verificar conexión a Supabase
async function verificarConexion() {
    try {
        const { data, error } = await supabaseClient
            .from('categorias')
            .select('count')
            .limit(1);
        
        if (error) throw error;
        console.log('✅ Conexión a Supabase exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a Supabase:', error);
        return false;
    }
}

// Exportar funciones para uso global
window.supabaseDB = {
    getCategorias,
    addCategoria,
    updateCategoria,
    deleteCategoria,
    getProductos,
    addProducto,
    updateProducto,
    deleteProducto,
    updateStock,
    getClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    getPedidos,
    getPedidoById,
    addPedido,
    updatePedido,
    updatePedidoStatus,
    deletePedido,
    getPedidosStats,
    verificarConexion,
    supabase: supabaseClient
};
