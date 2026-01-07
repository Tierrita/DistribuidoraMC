// ============================================
// TEST COMPLETO - Ejecutar en consola del navegador
// Copia y pega esto en la consola (F12) para diagnosticar
// ============================================

// TEST 1: Verificar que Supabase está conectado
console.log('🧪 TEST 1: Verificar conexión a Supabase');
console.log('Cliente Supabase:', window.supabaseDB ? '✅ Disponible' : '❌ No disponible');

// TEST 2: Obtener todos los pedidos
console.log('\n🧪 TEST 2: Cargar pedidos');
window.supabaseDB.getPedidos().then(pedidos => {
    console.log(`✅ ${pedidos.length} pedidos encontrados`);
    if (pedidos.length > 0) {
        console.log('Primer pedido:', pedidos[0]);
        
        // TEST 3: Intentar actualizar el primer pedido
        const testId = pedidos[0].id;
        const currentStatus = pedidos[0].status;
        const newStatus = currentStatus === 'pendiente' ? 'completado' : 'pendiente';
        
        console.log(`\n🧪 TEST 3: Actualizar pedido ${testId}`);
        console.log(`Estado actual: ${currentStatus}`);
        console.log(`Nuevo estado: ${newStatus}`);
        
        window.supabaseDB.updatePedidoStatus(testId, newStatus)
            .then(result => {
                console.log('✅ Actualización exitosa:', result);
            })
            .catch(error => {
                console.error('❌ Error en actualización:', {
                    message: error.message,
                    error: error
                });
            });
    } else {
        console.log('⚠️ No hay pedidos para probar. Crea uno primero.');
    }
}).catch(error => {
    console.error('❌ Error al cargar pedidos:', error);
});

// TEST 4: Verificar función directamente
console.log('\n🧪 TEST 4: Verificar función updatePedidoStatus');
console.log('Función existe:', typeof window.supabaseDB.updatePedidoStatus === 'function' ? '✅' : '❌');
