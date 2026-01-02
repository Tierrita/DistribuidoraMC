// ============================================
// DATOS DE MUESTRA - Distribuidora MC
// ============================================

// Función para inicializar datos de muestra
function initializeSampleData() {
    // Solo inicializar si no hay datos
    const existingInventory = localStorage.getItem('distributoraMC_inventory');
    const existingCategories = localStorage.getItem('distributoraMC_categories');
    
    if (existingInventory || existingCategories) {
        console.log('✅ Ya existen datos en el sistema');
        return;
    }
    
    console.log('🔄 Inicializando datos de muestra...');
    
    // Categorías de muestra
    const sampleCategories = [
        {
            id: 1,
            name: 'jamones',
            icon: 'fa-bacon',
            description: 'Jamones cocidos y crudos de la más alta calidad'
        },
        {
            id: 2,
            name: 'quesos',
            icon: 'fa-cheese',
            description: 'Quesos duros, semiduros y blandos'
        },
        {
            id: 3,
            name: 'embutidos',
            icon: 'fa-sausage',
            description: 'Salamines, salames y chorizos'
        },
        {
            id: 4,
            name: 'carnes',
            icon: 'fa-drumstick-bite',
            description: 'Carnes frescas y procesadas'
        }
    ];
    
    // Productos de muestra
    const sampleProducts = [
        {
            id: 1,
            code: 'JAM-001',
            name: 'Jamón Cocido Premium',
            category: 'jamones',
            costPrice: 2500.00,
            price: 3500.00,
            stock: 25,
            minStock: 5
        },
        {
            id: 2,
            code: 'JAM-002',
            name: 'Jamón Crudo Italiano',
            category: 'jamones',
            costPrice: 3800.00,
            price: 5200.00,
            stock: 15,
            minStock: 3
        },
        {
            id: 3,
            code: 'QUE-001',
            name: 'Queso Provolone',
            category: 'quesos',
            costPrice: 2000.00,
            price: 2800.00,
            stock: 30,
            minStock: 8
        },
        {
            id: 4,
            code: 'QUE-002',
            name: 'Queso Parmesano',
            category: 'quesos',
            costPrice: 3200.00,
            price: 4500.00,
            stock: 20,
            minStock: 5
        },
        {
            id: 5,
            code: 'EMB-001',
            name: 'Salame Tandilero',
            category: 'embutidos',
            costPrice: 2300.00,
            price: 3200.00,
            stock: 40,
            minStock: 10
        },
        {
            id: 6,
            code: 'EMB-002',
            name: 'Chorizo Colorado',
            category: 'embutidos',
            costPrice: 1800.00,
            price: 2500.00,
            stock: 35,
            minStock: 10
        },
        {
            id: 7,
            code: 'CAR-001',
            name: 'Bondiola Ahumada',
            category: 'carnes',
            costPrice: 2700.00,
            price: 3800.00,
            stock: 18,
            minStock: 5
        },
        {
            id: 8,
            code: 'CAR-002',
            name: 'Pechuga de Pavo',
            category: 'carnes',
            costPrice: 2400.00,
            price: 3300.00,
            stock: 22,
            minStock: 5
        }
    ];
    
    // Guardar en localStorage
    localStorage.setItem('distributoraMC_categories', JSON.stringify(sampleCategories));
    localStorage.setItem('distributoraMC_inventory', JSON.stringify(sampleProducts));
    localStorage.setItem('distributoraMC_nextCategoryId', '5');
    localStorage.setItem('distributoraMC_nextProductId', '9');
    
    console.log('✅ Datos de muestra inicializados correctamente');
    console.log(`📦 ${sampleProducts.length} productos agregados`);
    console.log(`🏷️ ${sampleCategories.length} categorías agregadas`);
    
    // Recargar la página para que se carguen los datos
    alert('¡Datos de muestra inicializados! La página se recargará para mostrar los productos.');
    window.location.reload();
}

// Exponer función globalmente
window.initializeSampleData = initializeSampleData;

console.log('💡 Si no ves productos, ejecuta initializeSampleData() en la consola');
