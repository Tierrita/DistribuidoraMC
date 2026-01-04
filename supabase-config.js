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
    verificarConexion
};
