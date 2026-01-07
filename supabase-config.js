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
                phone: cliente.phone,
                address: cliente.address,
                email: cliente.email,
                cuit: cliente.cuit,
                notes: cliente.notes
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
                phone: cliente.phone,
                address: cliente.address,
                email: cliente.email,
                cuit: cliente.cuit,
                notes: cliente.notes
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

async function updateStock(productId, quantityChange) {
    try {
        // 1. Obtener stock actual
        const { data: product, error: fetchError } = await supabaseClient
            .from('productos')
            .select('id, code, name, stock')
            .eq('id', productId)
            .single();
        
        if (fetchError) {
            console.error('❌ Error al obtener producto:', fetchError);
            throw new Error(`No se pudo obtener el producto ID ${productId}: ${fetchError.message}`);
        }
        
        if (!product) {
            throw new Error(`Producto ID ${productId} no encontrado`);
        }
        
        // 2. Calcular nuevo stock
        const newStock = product.stock + quantityChange;
        
        // 3. Validar que no sea negativo
        if (newStock < 0) {
            throw new Error(`Stock insuficiente para ${product.name} (${product.code}). Disponible: ${product.stock}, Solicitado: ${Math.abs(quantityChange)}`);
        }
        
        // 4. Actualizar stock
        const { data: updated, error: updateError } = await supabaseClient
            .from('productos')
            .update({ stock: newStock })
            .eq('id', productId)
            .select('*')
            .single();
        
        if (updateError) {
            console.error('❌ Error al actualizar stock:', updateError);
            throw new Error(`Error al actualizar stock: ${updateError.message}`);
        }
        
        console.log(`✅ Stock actualizado: ${product.name} (${product.stock} → ${newStock})`);
        return updated;
        
    } catch (error) {
        console.error('❌ Error en updateStock:', {
            productId,
            quantityChange,
            error: error.message,
            stack: error.stack
        });
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

// ============================================
// FUNCIONES DE BASE DE DATOS - PEDIDOS
// ============================================

async function getPedidos() {
    try {
        const { data, error } = await supabaseClient
            .from('pedidos')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        throw error;
    }
}

async function addPedido(pedido) {
    try {
        console.log('🔄 Iniciando creación de pedido:', pedido.orderNumber);
        
        // Validar datos del pedido
        if (!pedido.customer || !pedido.customer.name) {
            throw new Error('Datos del cliente incompletos');
        }
        
        if (!pedido.items || pedido.items.length === 0) {
            throw new Error('El pedido debe tener al menos un producto');
        }
        
        // Validar que todos los productos tengan ID
        for (const item of pedido.items) {
            if (!item.id) {
                throw new Error(`Producto sin ID: ${item.name || 'desconocido'}`);
            }
        }
        
        // Preparar items como JSONB
        const itemsJSON = pedido.items.map(item => ({
            product_id: item.id,
            product_code: item.code,
            product_name: item.name,
            brand: item.brand || '',
            price_per_kg: parseFloat(item.pricePerKg),
            weight: parseFloat(item.weight),
            subtotal: parseFloat(item.pricePerKg) * parseFloat(item.weight)
        }));
        
        console.log('📦 Items preparados:', itemsJSON);
        
        // 1. Crear el pedido primero
        const { data: newPedido, error: pedidoError } = await supabaseClient
            .from('pedidos')
            .insert([{
                order_number: pedido.orderNumber,
                customer_name: pedido.customer.name,
                customer_phone: pedido.customer.phone || '',
                customer_email: pedido.customer.email || '',
                customer_address: pedido.customer.address || '',
                items: itemsJSON,
                subtotal: parseFloat(pedido.subtotal),
                discount: parseFloat(pedido.discount || 0),
                total: parseFloat(pedido.total),
                status: pedido.status || 'pendiente',
                notes: pedido.notes || ''
            }])
            .select('*')
            .single();
        
        if (pedidoError) {
            console.error('❌ Error al insertar pedido:', {
                error: pedidoError,
                message: pedidoError.message,
                details: pedidoError.details,
                hint: pedidoError.hint
            });
            throw new Error(`Error al crear pedido: ${pedidoError.message}`);
        }
        
        console.log('✅ Pedido creado en BD:', newPedido);
        
        // 2. Actualizar stock de cada producto (resta el peso vendido)
        const stockUpdates = [];
        for (const item of pedido.items) {
            try {
                console.log(`🔄 Actualizando stock: ${item.name} (-${item.weight} kg)`);
                const updated = await updateStock(item.id, -item.weight);
                stockUpdates.push({
                    product: item.name,
                    success: true,
                    newStock: updated.stock
                });
            } catch (stockError) {
                console.error(`❌ Error al actualizar stock de ${item.name}:`, stockError.message);
                // No lanzar error aquí para no abortar todo el pedido
                // El pedido ya está creado, solo alertamos del problema
                stockUpdates.push({
                    product: item.name,
                    success: false,
                    error: stockError.message
                });
            }
        }
        
        console.log('📊 Resultado actualización de stocks:', stockUpdates);
        
        // Verificar si hubo errores en stocks
        const failedStocks = stockUpdates.filter(u => !u.success);
        if (failedStocks.length > 0) {
            console.warn('⚠️ Algunos stocks no se pudieron actualizar:', failedStocks);
            newPedido._stockWarnings = failedStocks;
        }
        
        return newPedido;
        
    } catch (error) {
        console.error('❌ Error en addPedido:', {
            orderNumber: pedido.orderNumber,
            error: error.message,
            stack: error.stack,
            pedido: pedido
        });
        throw error;
    }
}

async function updatePedidoStatus(id, status) {
    try {
        // Validar que el status sea válido
        const validStatuses = ['pendiente', 'en_proceso', 'completado', 'cancelado'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Estado inválido: ${status}. Debe ser uno de: ${validStatuses.join(', ')}`);
        }
        
        console.log(`🔄 Actualizando pedido ${id} a estado: ${status}`);
        
        // Primero verificar que el pedido existe
        const { data: existingPedido, error: fetchError } = await supabaseClient
            .from('pedidos')
            .select('id, order_number, status')
            .eq('id', id)
            .single();
        
        if (fetchError || !existingPedido) {
            console.error('❌ Pedido no encontrado:', { id, fetchError });
            throw new Error(`Pedido con ID ${id} no encontrado`);
        }
        
        console.log('📋 Pedido actual:', existingPedido);
        
        // Actualizar el estado
        const { data, error } = await supabaseClient
            .from('pedidos')
            .update({ status: status })
            .eq('id', id)
            .select('*');
        
        if (error) {
            console.error('❌ Error al actualizar estado:', {
                error: error,
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            throw new Error(`Error al actualizar estado: ${error.message}`);
        }
        
        if (!data || data.length === 0) {
            throw new Error('No se pudo actualizar el pedido - sin respuesta de la BD');
        }
        
        console.log('✅ Estado actualizado correctamente:', data[0]);
        return data[0];
    } catch (error) {
        console.error('❌ Error en updatePedidoStatus:', {
            id: id,
            status: status,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}

async function deletePedido(id) {
    try {
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
    addPedido,
    updatePedidoStatus,
    deletePedido,
    verificarConexion
};

