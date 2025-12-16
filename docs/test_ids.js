// ============================================
// SCRIPT DE PRUEBA - Sistema de IDs
// ============================================
// Copia y pega esto en la consola del navegador

console.log('🧪 Iniciando pruebas del sistema de IDs...\n');

// Test 1: Ver estado inicial
console.log('📊 TEST 1: Estado Inicial');
showIdStatus();

// Test 2: Agregar producto de prueba
console.log('\n✅ TEST 2: Agregar producto con ID autoincremental');
const testProduct = {
    code: 'TEST001',
    name: 'Producto de Prueba',
    category: 'jamones',
    price: 1000,
    stock: 50,
    minStock: 10
};

// Simular agregar (muestra el ID que se asignaría)
console.log('Próximo ID que se asignará:', nextProductId);
console.log('Producto a agregar:', testProduct);

// Test 3: Verificar secuencia
console.log('\n🔢 TEST 3: Secuencia de IDs');
console.log('Productos actuales:', inventory.map(p => ({ id: p.id, name: p.name })));
console.log('IDs en orden:', inventory.map(p => p.id).sort((a, b) => a - b));

// Test 4: Verificar persistencia
console.log('\n💾 TEST 4: Datos en localStorage');
console.log('Inventario guardado:', localStorage.getItem('distributoraMC_inventory') !== null ? '✅ Sí' : '❌ No');
console.log('NextProductId guardado:', localStorage.getItem('distributoraMC_nextProductId'));
console.log('NextCategoryId guardado:', localStorage.getItem('distributoraMC_nextCategoryId'));

console.log('\n✨ Pruebas completadas!\n');
console.log('💡 Tips:');
console.log('   - Agrega un producto desde la interfaz');
console.log('   - Luego ejecuta showIdStatus() para ver el nuevo ID');
console.log('   - Los IDs siempre incrementan, nunca se repiten');
