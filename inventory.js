// ============================================
// SISTEMA DE INVENTARIO V3 - Distribuidora MC
// Con Gestión de Categorías y Productos + Supabase
// ============================================

// ============================================
// FUNCIONES AUXILIARES DE AUTO-GENERACIÓN
// ============================================

// Auto-sugerir ícono Font Awesome basado en el nombre de la categoría
function autoSuggestIcon(categoryName) {
    const name = categoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    const iconMap = {
        'jamon': 'fa-drumstick-bite',
        'jamones': 'fa-drumstick-bite',
        'queso': 'fa-cheese',
        'quesos': 'fa-cheese',
        'fiambre': 'fa-bacon',
        'fiambres': 'fa-bacon',
        'salame': 'fa-bacon',
        'salames': 'fa-bacon',
        'chorizo': 'fa-hotdog',
        'chorizos': 'fa-hotdog',
        'mortadela': 'fa-bacon',
        'mortadelas': 'fa-bacon',
        'salchicha': 'fa-hotdog',
        'salchichas': 'fa-hotdog',
        'pan': 'fa-bread-slice',
        'panes': 'fa-bread-slice',
        'bebida': 'fa-bottle-water',
        'bebidas': 'fa-bottle-water',
        'lacteo': 'fa-cow',
        'lacteos': 'fa-cow',
        'leche': 'fa-cow',
        'carne': 'fa-drumstick-bite',
        'carnes': 'fa-drumstick-bite',
        'pescado': 'fa-fish',
        'pescados': 'fa-fish',
        'vegetal': 'fa-carrot',
        'vegetales': 'fa-carrot',
        'verdura': 'fa-carrot',
        'verduras': 'fa-carrot',
        'fruta': 'fa-apple-whole',
        'frutas': 'fa-apple-whole',
        'postre': 'fa-ice-cream',
        'postres': 'fa-ice-cream',
        'dulce': 'fa-candy-cane',
        'dulces': 'fa-candy-cane',
        'golosina': 'fa-candy-cane',
        'golosinas': 'fa-candy-cane',
        'condimento': 'fa-pepper-hot',
        'condimentos': 'fa-pepper-hot',
        'especia': 'fa-pepper-hot',
        'especias': 'fa-pepper-hot',
        'pasta': 'fa-bowl-food',
        'pastas': 'fa-bowl-food',
        'conserva': 'fa-jar',
        'conservas': 'fa-jar',
        'enlatado': 'fa-jar',
        'enlatados': 'fa-jar',
        'aceite': 'fa-bottle-droplet',
        'aceites': 'fa-bottle-droplet',
        'vinagre': 'fa-bottle-droplet',
        'vinagres': 'fa-bottle-droplet',
        'snack': 'fa-cookie-bite',
        'snacks': 'fa-cookie-bite',
        'galleta': 'fa-cookie-bite',
        'galletas': 'fa-cookie-bite',
        'congelado': 'fa-snowflake',
        'congelados': 'fa-snowflake',
        'helado': 'fa-ice-cream',
        'helados': 'fa-ice-cream'
    };
    
    // Buscar coincidencias en el nombre
    for (const [keyword, icon] of Object.entries(iconMap)) {
        if (name.includes(keyword)) {
            return icon;
        }
    }
    
    // Ícono por defecto
    return 'fa-tag';
}

// Auto-generar color basado en el nombre de la categoría
function autoSuggestColor(categoryName) {
    const name = categoryName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    const colorMap = {
        'jamon': '#D32F2F',
        'jamones': '#D32F2F',
        'queso': '#FFA726',
        'quesos': '#FFA726',
        'fiambre': '#C2185B',
        'fiambres': '#C2185B',
        'salame': '#8B0000',
        'salames': '#8B0000',
        'chorizo': '#E64A19',
        'chorizos': '#E64A19',
        'mortadela': '#AD1457',
        'mortadelas': '#AD1457',
        'salchicha': '#D84315',
        'salchichas': '#D84315',
        'pan': '#F57C00',
        'panes': '#F57C00',
        'bebida': '#0288D1',
        'bebidas': '#0288D1',
        'lacteo': '#1976D2',
        'lacteos': '#1976D2',
        'leche': '#42A5F5',
        'carne': '#C62828',
        'carnes': '#C62828',
        'pescado': '#0097A7',
        'pescados': '#0097A7',
        'vegetal': '#388E3C',
        'vegetales': '#388E3C',
        'verdura': '#4CAF50',
        'verduras': '#4CAF50',
        'fruta': '#8BC34A',
        'frutas': '#8BC34A',
        'postre': '#E91E63',
        'postres': '#E91E63',
        'dulce': '#F06292',
        'dulces': '#F06292',
        'golosina': '#EC407A',
        'golosinas': '#EC407A',
        'condimento': '#FF5722',
        'condimentos': '#FF5722',
        'especia': '#BF360C',
        'especias': '#BF360C',
        'pasta': '#FBC02D',
        'pastas': '#FBC02D',
        'conserva': '#689F38',
        'conservas': '#689F38',
        'enlatado': '#7CB342',
        'enlatados': '#7CB342',
        'aceite': '#F9A825',
        'aceites': '#F9A825',
        'vinagre': '#AFB42B',
        'vinagres': '#AFB42B',
        'snack': '#FF6F00',
        'snacks': '#FF6F00',
        'galleta': '#EF6C00',
        'galletas': '#EF6C00',
        'congelado': '#0288D1',
        'congelados': '#0288D1',
        'helado': '#AB47BC',
        'helados': '#AB47BC'
    };
    
    // Buscar coincidencias en el nombre
    for (const [keyword, color] of Object.entries(colorMap)) {
        if (name.includes(keyword)) {
            return color;
        }
    }
    
    // Colores aleatorios por defecto
    const defaultColors = [
        '#8B0000', '#1976D2', '#388E3C', '#F57C00', '#7B1FA2',
        '#C2185B', '#0097A7', '#5D4037', '#455A64', '#E64A19',
        '#00796B', '#512DA8', '#FFA726', '#C62828', '#689F38'
    ];
    
    return defaultColors[Math.floor(Math.random() * defaultColors.length)];
}

// Generar código automático para productos
async function generateProductCode() {
    let maxCode = 0;
    
    // Buscar el código más alto en el inventario actual
    inventory.forEach(product => {
        const codeNumber = parseInt(product.code.replace(/\D/g, ''));
        if (!isNaN(codeNumber) && codeNumber > maxCode) {
            maxCode = codeNumber;
        }
    });
    
    // Si usamos Supabase, también verificar en la base de datos
    if (useSupabase && window.supabaseDB) {
        try {
            const { data, error } = await window.supabaseDB.supabase
                .from('productos')
                .select('code')
                .order('code', { ascending: false })
                .limit(1);
                
            if (data && data.length > 0) {
                const dbCodeNumber = parseInt(data[0].code.replace(/\D/g, ''));
                if (!isNaN(dbCodeNumber) && dbCodeNumber > maxCode) {
                    maxCode = dbCodeNumber;
                }
            }
        } catch (error) {
            console.warn('No se pudo verificar códigos en Supabase:', error);
        }
    }
    
    // Generar el siguiente código
    const nextNumber = maxCode + 1;
    return `PROD${String(nextNumber).padStart(4, '0')}`;
}

// Variables globales
let inventory = [];
let categories = [];
let editingProductId = null;
let editingCategoryId = null;
let currentTab = 'productos';

// Contadores autoincrementales (solo para fallback)
let nextProductId = 1;
let nextCategoryId = 1;

// Flag para saber si Supabase está disponible
let useSupabase = false;

// Elementos del DOM - Productos
const productsTableBody = document.getElementById('productsTableBody');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const btnAddProduct = document.getElementById('btnAddProduct');
const modalClose = document.getElementById('modalClose');
const btnCancel = document.getElementById('btnCancel');
const searchProducts = document.getElementById('searchProducts');
const emptyState = document.getElementById('emptyState');
const modalTitle = document.getElementById('modalTitle');
const filterCategory = document.getElementById('filterCategory');

// Elementos del DOM - Categorías
const categoriesGrid = document.getElementById('categoriesGrid');
const categoryModal = document.getElementById('categoryModal');
const categoryForm = document.getElementById('categoryForm');
const btnAddCategory = document.getElementById('btnAddCategory');
const categoryModalClose = document.getElementById('categoryModalClose');
const categoryCancelBtn = document.getElementById('categoryCancelBtn');
const categoryModalTitle = document.getElementById('categoryModalTitle');

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si Supabase está disponible
    if (typeof window.supabaseDB !== 'undefined') {
        try {
            const connected = await window.supabaseDB.verificarConexion();
            if (connected) {
                useSupabase = true;
                console.log('✅ Modo Supabase activado');
                await loadDataFromSupabase();
            } else {
                console.log('⚠️ Supabase no disponible, usando LocalStorage');
                loadDataFromLocalStorage();
            }
        } catch (error) {
            console.log('⚠️ Error con Supabase, usando LocalStorage:', error);
            loadDataFromLocalStorage();
        }
    } else {
        console.log('ℹ️ Usando LocalStorage (Supabase no configurado)');
        loadDataFromLocalStorage();
    }
    
    renderInventory();
    renderCategories();
    updateStats();
    loadCategoryFilters();
    loadCategoryOptions();
    initializeEventListeners();
});

// ============================================
// CARGA DE DATOS
// ============================================

async function loadDataFromSupabase() {
    try {
        // Cargar categorías
        const cats = await window.supabaseDB.getCategorias();
        categories = cats.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug || cat.name.toLowerCase(),
            icon: cat.icon || 'fa-box',
            color: cat.color || '#8B0000',
            description: cat.description || ''
        }));
        
        // Cargar productos
        const prods = await window.supabaseDB.getProductos();
        inventory = prods.map(prod => ({
            id: prod.id,
            code: prod.code,
            name: prod.name,
            category: prod.category,
            costPrice: parseFloat(prod.cost_price) || 0,
            price: parseFloat(prod.price),
            stock: prod.stock,
            minStock: prod.min_stock || 0,
            unit: prod.unit || 'kg'
        }));
        
        // Actualizar variable global para pedidos
        window.inventory = inventory;
        
        console.log(`✅ Cargados ${categories.length} categorías y ${inventory.length} productos desde Supabase`);
    } catch (error) {
        console.error('Error al cargar datos de Supabase:', error);
        throw error;
    }
}

function loadDataFromLocalStorage() {
    loadCategoriesFromStorage();
    loadInventoryFromStorage();
    
    // Agregar categorías por defecto si está vacío
    if (categories.length === 0) {
        addDefaultCategories();
    }
    
    // Agregar productos de ejemplo si está vacío
    if (inventory.length === 0) {
        addSampleProducts();
    }
}

// ============================================
// ALMACENAMIENTO
// ============================================

function saveInventoryToStorage() {
    localStorage.setItem('distributoraMC_inventory', JSON.stringify(inventory));
    localStorage.setItem('distributoraMC_nextProductId', nextProductId.toString());
    // Actualizar inventario global para pedidos
    window.inventory = inventory;
}

function loadInventoryFromStorage() {
    const stored = localStorage.getItem('distributoraMC_inventory');
    if (stored) {
        inventory = JSON.parse(stored);
        window.inventory = inventory;
    }
    
    // Cargar el siguiente ID o calcularlo
    const storedNextId = localStorage.getItem('distributoraMC_nextProductId');
    if (storedNextId) {
        nextProductId = parseInt(storedNextId);
    } else {
        // Calcular el siguiente ID basado en el máximo existente
        nextProductId = inventory.length > 0 
            ? Math.max(...inventory.map(p => p.id)) + 1 
            : 1;
    }
}

function saveCategoriestoStorage() {
    localStorage.setItem('distributoraMC_categories', JSON.stringify(categories));
    localStorage.setItem('distributoraMC_nextCategoryId', nextCategoryId.toString());
}

function loadCategoriesFromStorage() {
    const stored = localStorage.getItem('distributoraMC_categories');
    if (stored) {
        categories = JSON.parse(stored);
    }
    
    // Cargar el siguiente ID o calcularlo
    const storedNextId = localStorage.getItem('distributoraMC_nextCategoryId');
    if (storedNextId) {
        nextCategoryId = parseInt(storedNextId);
    } else {
        // Calcular el siguiente ID basado en el máximo existente
        nextCategoryId = categories.length > 0 
            ? Math.max(...categories.map(c => c.id)) + 1 
            : 1;
    }
}

// ============================================
// CATEGORÍAS POR DEFECTO
// ============================================

function addDefaultCategories() {
    categories = [
        {
            id: nextCategoryId++,
            name: 'Jamones',
            slug: 'jamones',
            icon: 'fa-bacon',
            color: '#8B0000',
            description: 'Jamón cocido, crudo, serrano y más variedades premium'
        },
        {
            id: nextCategoryId++,
            name: 'Quesos',
            slug: 'quesos',
            icon: 'fa-cheese',
            color: '#FFA500',
            description: 'Selección de quesos nacionales e importados'
        },
        {
            id: nextCategoryId++,
            name: 'Embutidos',
            slug: 'embutidos',
            icon: 'fa-sausage',
            color: '#DC143C',
            description: 'Salames, chorizos, mortadelas y más'
        },
        {
            id: nextCategoryId++,
            name: 'Carnes Frías',
            slug: 'carnes',
            icon: 'fa-drumstick-bite',
            color: '#CD5C5C',
            description: 'Pavita, pollo, lomito y especialidades'
        },
        {
            id: nextCategoryId++,
            name: 'Productos Gourmet',
            slug: 'gourmet',
            icon: 'fa-bread-slice',
            color: '#DAA520',
            description: 'Patés, aceitunas, pickles y delicatessen'
        },
        {
            id: nextCategoryId++,
            name: 'Pescados y Mariscos',
            slug: 'pescados',
            icon: 'fa-fish',
            color: '#4682B4',
            description: 'Conservas y productos del mar'
        }
    ];
    saveCategoriestoStorage();
}

// ============================================
// PRODUCTOS DE EJEMPLO
// ============================================

function addSampleProducts() {
    inventory = [
        {
            id: nextProductId++,
            code: 'JAM001',
            name: 'Jamón Cocido Premium',
            category: 'jamones',
            price: 2500,
            stock: 45,
            minStock: 20
        },
        {
            id: nextProductId++,
            code: 'QUE001',
            name: 'Queso Parmesano',
            category: 'quesos',
            price: 3200,
            stock: 15,
            minStock: 10
        },
        {
            id: nextProductId++,
            code: 'EMB001',
            name: 'Salame Milano',
            category: 'embutidos',
            price: 1800,
            stock: 8,
            minStock: 15
        },
        {
            id: nextProductId++,
            code: 'JAM002',
            name: 'Jamón Crudo Serrano',
            category: 'jamones',
            price: 4500,
            stock: 25,
            minStock: 10
        },
        {
            id: nextProductId++,
            code: 'QUE002',
            name: 'Queso Roquefort',
            category: 'quesos',
            price: 2800,
            stock: 30,
            minStock: 15
        },
        {
            id: nextProductId++,
            code: 'CAR001',
            name: 'Pavita Natural',
            category: 'carnes',
            price: 1500,
            stock: 5,
            minStock: 20
        }
    ];
    saveInventoryToStorage();
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Productos
    if (btnAddProduct) btnAddProduct.addEventListener('click', openModalForAdd);
    if (modalClose) modalClose.addEventListener('click', closeProductModal);
    if (btnCancel) btnCancel.addEventListener('click', closeProductModal);
    if (productModal) productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
    });
    if (productForm) productForm.addEventListener('submit', handleProductFormSubmit);
    if (searchProducts) searchProducts.addEventListener('input', handleSearch);
    if (filterCategory) filterCategory.addEventListener('change', handleCategoryFilter);
    
    // Categorías
    if (btnAddCategory) btnAddCategory.addEventListener('click', openCategoryModalForAdd);
    if (categoryModalClose) categoryModalClose.addEventListener('click', closeCategoryModal);
    if (categoryCancelBtn) categoryCancelBtn.addEventListener('click', closeCategoryModal);
    if (categoryModal) categoryModal.addEventListener('click', (e) => {
        if (e.target === categoryModal) closeCategoryModal();
    });
    if (categoryForm) categoryForm.addEventListener('submit', handleCategoryFormSubmit);
}

// ============================================
// GESTIÓN DE CATEGORÍAS
// ============================================

function renderCategories() {
    if (!categoriesGrid) return; // Protección si los elementos no existen
    
    if (categories.length === 0) {
        categoriesGrid.innerHTML = '<div class="empty-state-mini"><i class="fas fa-tags"></i><p>No hay categorías. Crea la primera.</p></div>';
        return;
    }
    
    categoriesGrid.innerHTML = categories.map(cat => {
        const productCount = inventory.filter(p => p.category === cat.slug).length;
        
        return `
            <div class="category-card" style="border-left: 4px solid ${cat.color}">
                <div class="category-card-header">
                    <div class="category-icon" style="background: ${cat.color}20; color: ${cat.color}">
                        <i class="fas ${cat.icon}"></i>
                    </div>
                    <div class="category-info">
                        <h3>${cat.name}</h3>
                        <p class="category-slug">${cat.slug}</p>
                    </div>
                </div>
                <p class="category-description">${cat.description || 'Sin descripción'}</p>
                <div class="category-stats">
                    <div class="category-stat">
                        <i class="fas fa-box"></i>
                        <span><strong>${productCount}</strong> productos</span>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="btn-icon btn-edit" onclick="openCategoryModalForEdit(${cat.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteCategory(${cat.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function openCategoryModalForAdd() {
    editingCategoryId = null;
    categoryModalTitle.textContent = 'Nueva Categoría';
    categoryForm.reset();
    categoryModal.classList.add('active');
}

function openCategoryModalForEdit(categoryId) {
    editingCategoryId = categoryId;
    categoryModalTitle.textContent = 'Editar Categoría';
    
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        document.getElementById('categoryName').value = category.name;
        const descriptionField = document.getElementById('categoryDescription');
        if (descriptionField) {
            descriptionField.value = category.description || '';
        }
    }
    
    categoryModal.classList.add('active');
}

function closeCategoryModal() {
    categoryModal.classList.remove('active');
    categoryForm.reset();
    editingCategoryId = null;
}

async function handleCategoryFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('categoryName').value.trim();
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    const description = document.getElementById('categoryDescription').value.trim();
    
    // Auto-generar ícono y color
    const icon = autoSuggestIcon(name);
    const color = autoSuggestColor(name);
    
    // ===== VALIDACIONES =====
    
    // 1. Validar nombre no vacío
    if (name.length === 0) {
        alert('El nombre de la categoría no puede estar vacío');
        document.getElementById('categoryName').focus();
        return;
    }
    
    // 2. Validar longitud del nombre
    if (name.length > 50) {
        alert('El nombre de la categoría es demasiado largo (máximo 50 caracteres)');
        document.getElementById('categoryName').focus();
        return;
    }
    
    // 3. Validar nombre duplicado (solo para categorías nuevas o si cambió el nombre)
    if (!editingCategoryId || categories.find(c => c.id === editingCategoryId)?.name !== name) {
        if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert('Ya existe una categoría con ese nombre');
            document.getElementById('categoryName').focus();
            return;
        }
    }
    
    // 4. Validar slug duplicado
    if (!editingCategoryId || categories.find(c => c.id === editingCategoryId)?.slug !== slug) {
        if (categories.some(c => c.slug === slug)) {
            alert('Ya existe una categoría similar con ese nombre');
            document.getElementById('categoryName').focus();
            return;
        }
    }
    
    // 5. Validar longitud de descripción
    if (description.length > 200) {
        alert('La descripción es demasiado larga (máximo 200 caracteres)');
        document.getElementById('categoryDescription').focus();
        return;
    }
    
    // ===== FIN VALIDACIONES =====
    
    const categoryData = {
        name: name,
        slug: slug,
        icon: icon,
        color: color,
        description: description
    };
    
    try {
        if (editingCategoryId) {
            // Editar categoría existente
            if (useSupabase) {
                const oldCategory = categories.find(c => c.id === editingCategoryId);
                const oldSlug = oldCategory?.slug;
                
                await window.supabaseDB.updateCategoria(editingCategoryId, categoryData);
                
                // Si cambió el slug, actualizar productos relacionados
                if (oldSlug && oldSlug !== slug) {
                    const productsToUpdate = inventory.filter(p => p.category === oldSlug);
                    for (const product of productsToUpdate) {
                        await window.supabaseDB.updateProducto(product.id, { category: slug });
                    }
                }
                
                await loadDataFromSupabase();
            } else {
                const index = categories.findIndex(c => c.id === editingCategoryId);
                if (index !== -1) {
                    const oldSlug = categories[index].slug;
                    categories[index] = { ...categories[index], ...categoryData };
                    
                    // Actualizar productos que usan esta categoría
                    inventory.forEach(product => {
                        if (product.category === oldSlug) {
                            product.category = slug;
                        }
                    });
                    
                    saveInventoryToStorage();
                    saveCategoriestoStorage();
                }
            }
            alert('Categoría actualizada correctamente');
        } else {
            // Agregar nueva categoría
            if (useSupabase) {
                await window.supabaseDB.addCategoria(categoryData);
                await loadDataFromSupabase();
            } else {
                const newCategory = {
                    id: nextCategoryId++,
                    ...categoryData
                };
                categories.push(newCategory);
                saveCategoriestoStorage();
            }
            alert('Categoría agregada correctamente');
        }
        
        renderCategories();
        loadCategoryFilters();
        loadCategoryOptions();
        closeCategoryModal();
    } catch (error) {
        console.error('Error al guardar categoría:', error);
        alert('Error al guardar la categoría');
    }
}

async function deleteCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Verificar si hay productos usando esta categoría
    const productsInCategory = inventory.filter(p => p.category === category.slug).length;
    
    if (productsInCategory > 0) {
        alert(`No se puede eliminar. Hay ${productsInCategory} productos en esta categoría`);
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
        try {
            if (useSupabase) {
                await window.supabaseDB.deleteCategoria(categoryId);
                await loadDataFromSupabase();
            } else {
                categories = categories.filter(c => c.id !== categoryId);
                saveCategoriestoStorage();
            }
            
            renderCategories();
            loadCategoryFilters();
            loadCategoryOptions();
            alert('Categoría eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            alert('Error al eliminar la categoría');
        }
    }
}

// ============================================
// CARGAR FILTROS DINÁMICOS
// ============================================

function loadCategoryFilters() {
    if (!filterCategory) return;
    
    filterCategory.innerHTML = `
        <option value="">Todas las categorías</option>
        ${categories.map(cat => `
            <option value="${cat.slug}">${cat.name}</option>
        `).join('')}
    `;
}

function handleCategoryFilter(e) {
    const categorySlug = e.target.value;
    
    if (categorySlug === '') {
        renderInventory(inventory);
    } else {
        const filtered = inventory.filter(p => p.category === categorySlug);
        renderInventory(filtered);
    }
}

function loadCategoryOptions() {
    const select = document.getElementById('productCategory');
    if (!select) return;
    
    select.innerHTML = `
        <option value="">Seleccionar categoría</option>
        ${categories.map(cat => `
            <option value="${cat.slug}">${cat.name}</option>
        `).join('')}
    `;
}

// ============================================
// GESTIÓN DE PRODUCTOS
// ============================================

function openModalForAdd() {
    editingProductId = null;
    modalTitle.textContent = 'Agregar Producto';
    productForm.reset();
    productModal.classList.add('active');
}

function openModalForEdit(productId) {
    editingProductId = productId;
    modalTitle.textContent = 'Editar Producto';
    
    const product = inventory.find(p => p.id === productId);
    if (product) {
        document.getElementById('productCode').value = product.code;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productCostPrice').value = product.costPrice || 0;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productMinStock').value = product.minStock;
    }
    
    productModal.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
    productForm.reset();
    editingProductId = null;
}

async function handleProductFormSubmit(e) {
    e.preventDefault();
    
    // Auto-generar código para productos nuevos
    const code = editingProductId ? 
        inventory.find(p => p.id === editingProductId)?.code : 
        await generateProductCode();
    
    const productData = {
        code: code,
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        costPrice: parseFloat(document.getElementById('productCostPrice').value),
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        minStock: parseInt(document.getElementById('productMinStock').value),
        unit: 'kg'
    };
    
    // ===== VALIDACIONES =====
    
    // 1. Validar nombre no vacío y longitud máxima
    if (productData.name.length === 0) {
        alert('El nombre del producto no puede estar vacío');
        document.getElementById('productName').focus();
        return;
    }
    
    if (productData.name.length > 100) {
        alert('El nombre del producto es demasiado largo (máximo 100 caracteres)');
        document.getElementById('productName').focus();
        return;
    }
    
    // 2. Validar precio de costo mayor a 0
    if (productData.costPrice <= 0 || isNaN(productData.costPrice)) {
        alert('El precio de costo debe ser mayor a 0');
        document.getElementById('productCostPrice').focus();
        return;
    }
    
    // 3. Validar precio final mayor a 0
    if (productData.price <= 0 || isNaN(productData.price)) {
        alert('El precio final debe ser mayor a 0');
        document.getElementById('productPrice').focus();
        return;
    }
    
    // 4. Validar precio máximo razonable
    if (productData.price > 9999999) {
        alert('El precio es demasiado alto');
        document.getElementById('productPrice').focus();
        return;
    }
    
    // 5. Advertir si precio final es menor al precio de costo
    if (productData.price < productData.costPrice) {
        if (!confirm('El precio final es menor al precio de costo. ¿Deseas continuar de todos modos?')) {
            return;
        }
    }
    
    // 6. Validar stock no negativo
    if (productData.stock < 0) {
        alert('El stock no puede ser negativo');
        document.getElementById('productStock').focus();
        return;
    }
    
    // 7. Validar stock mínimo no negativo
    if (productData.minStock < 0) {
        alert('El stock mínimo no puede ser negativo');
        document.getElementById('productMinStock').focus();
        return;
    }
    
    // 8. Validar que stock mínimo sea menor al stock actual (advertencia)
    if (productData.minStock > productData.stock && productData.stock > 0) {
        if (!confirm('El stock actual es menor al stock mínimo. ¿Deseas continuar de todos modos?')) {
            return;
        }
    }
    
    // 9. Validar categoría seleccionada
    if (!productData.category) {
        alert('Debes seleccionar una categoría');
        document.getElementById('productCategory').focus();
        return;
    }
    
    // ===== FIN VALIDACIONES =====
    
    try {
        if (editingProductId) {
            // Editar producto existente
            if (useSupabase) {
                await window.supabaseDB.updateProducto(editingProductId, productData);
                await loadDataFromSupabase();
            } else {
                const index = inventory.findIndex(p => p.id === editingProductId);
                if (index !== -1) {
                    inventory[index] = { ...inventory[index], ...productData };
                    saveInventoryToStorage();
                }
            }
            alert('Producto actualizado correctamente');
        } else {
            // Agregar nuevo producto
            if (useSupabase) {
                await window.supabaseDB.addProducto(productData);
                await loadDataFromSupabase();
            } else {
                const newProduct = {
                    id: nextProductId++,
                    ...productData
                };
                inventory.push(newProduct);
                saveInventoryToStorage();
            }
            alert('Producto agregado correctamente');
        }
        
        renderInventory();
        renderCategories(); // Actualizar contadores
        updateStats();
        closeProductModal();
    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert('Error al guardar el producto');
    }
}

async function deleteProduct(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
        try {
            if (useSupabase) {
                await window.supabaseDB.deleteProducto(productId);
                await loadDataFromSupabase();
            } else {
                inventory = inventory.filter(p => p.id !== productId);
                saveInventoryToStorage();
            }
            
            renderInventory();
            renderCategories(); // Actualizar contadores
            updateStats();
            alert('Producto eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar el producto');
        }
    }
}

function renderInventory(productsToRender = inventory) {
    if (!productsTableBody || !emptyState) return; // Protección si los elementos no existen
    
    if (productsToRender.length === 0) {
        productsTableBody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    productsTableBody.innerHTML = productsToRender.map(product => {
        const stockStatus = getStockStatus(product.stock, product.minStock);
        const category = categories.find(c => c.slug === product.category);
        const categoryName = category ? category.name : product.category;
        const categoryIcon = category ? category.icon : 'fa-box';
        const costPrice = product.costPrice || 0;
        const productCode = product.code || product.id || 'N/A';
        
        return `
            <tr data-id="${product.id}">
                <td><span class="product-code">${productCode}</span></td>
                <td><strong>${product.name}</strong></td>
                <td>
                    <span class="category-badge" style="background: ${category?.color}20; color: ${category?.color}">
                        <i class="fas ${categoryIcon}"></i>
                        ${categoryName}
                    </span>
                </td>
                <td class="price">$${costPrice.toFixed(2)}</td>
                <td class="price">$${product.price.toFixed(2)}</td>
                <td><strong>${product.stock}</strong> unidades</td>
                <td>
                    <span class="stock-badge ${stockStatus.class}">
                        <i class="${stockStatus.icon}"></i>
                        ${stockStatus.text}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-success" onclick="quickAddToOrder(${product.id})" title="Agregar al pedido" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <button class="btn-icon btn-edit" onclick="openModalForEdit(${product.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function getStockStatus(stock, minStock) {
    if (stock === 0) {
        return {
            class: 'out-of-stock',
            icon: 'fas fa-times-circle',
            text: 'Sin Stock'
        };
    } else if (stock <= minStock) {
        return {
            class: 'low-stock',
            icon: 'fas fa-exclamation-triangle',
            text: 'Stock Bajo'
        };
    } else {
        return {
            class: 'in-stock',
            icon: 'fas fa-check-circle',
            text: 'Disponible'
        };
    }
}

function updateStats() {
    // Estadísticas opcionales - solo actualizar si los elementos existen en el HTML
    const totalProducts = inventory.length;
    const lowStock = inventory.filter(p => p.stock <= p.minStock && p.stock > 0).length;
    const normalStock = inventory.filter(p => p.stock > p.minStock).length;
    const totalValue = inventory.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    const totalProductsEl = document.getElementById('totalProducts');
    const lowStockEl = document.getElementById('lowStock');
    const normalStockEl = document.getElementById('normalStock');
    const totalValueEl = document.getElementById('totalValue');
    
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (lowStockEl) lowStockEl.textContent = lowStock;
    if (normalStockEl) normalStockEl.textContent = normalStock;
    if (totalValueEl) totalValueEl.textContent = `$${totalValue.toFixed(2)}`;
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = inventory.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.code && product.code.toLowerCase().includes(searchTerm))
    );
    renderInventory(filtered);
}

function handleFilter(e) {
    const category = e.currentTarget.dataset.category;
    
    // Actualizar botón activo
    const filterButtons = document.querySelectorAll('#dynamicFilters .filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Filtrar productos
    if (category === 'todos') {
        renderInventory(inventory);
    } else {
        const filtered = inventory.filter(p => p.category === category);
        renderInventory(filtered);
    }
}

// ============================================
// FUNCIONES GLOBALES
// ============================================

window.openModalForEdit = openModalForEdit;
window.deleteProduct = deleteProduct;
window.openCategoryModalForEdit = openCategoryModalForEdit;
window.deleteCategory = deleteCategory;

// ============================================
// AGREGAR AL PEDIDO DESDE INVENTARIO
// ============================================

function quickAddToOrder(productId) {
    const product = inventory.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    if (product.stock <= 0) {
        showNotification('Producto sin stock', 'error');
        return;
    }
    
    // Obtener o inicializar el carrito
    let cart = JSON.parse(localStorage.getItem('distributoraMC_cart') || '[]');
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > product.stock) {
            showNotification('No hay más stock disponible', 'error');
            return;
        }
        existingItem.quantity = newQuantity;
        showNotification(`+1 ${product.name} al pedido (Total: ${newQuantity})`, 'success');
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            code: product.code,
            price: product.price,
            quantity: 1,
            category: product.category
        });
        showNotification(`✓ ${product.name} agregado al pedido`, 'success');
    }
    
    // Guardar carrito
    localStorage.setItem('distributoraMC_cart', JSON.stringify(cart));
    
    // Actualizar badge del carrito
    updateCartBadgeFromInventory(cart);
    
    // Efecto visual en la fila
    const row = document.querySelector(`tr[data-id="${productId}"]`);
    if (row) {
        row.classList.add('row-added');
        setTimeout(() => row.classList.remove('row-added'), 600);
    }
}

function updateCartBadgeFromInventory(cart) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

window.quickAddToOrder = quickAddToOrder;

// ============================================
// INICIALIZACIÓN
// ============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Sistema de Inventario MC...');
    
    // Cargar datos desde localStorage
    loadInventoryFromStorage();
    loadCategoriesFromStorage();
    
    // Exponer inventario globalmente
    window.inventory = inventory;
    window.categories = categories;
    
    console.log(`📦 Inventario cargado: ${inventory.length} productos`);
    console.log(`🏷️ Categorías cargadas: ${categories.length} categorías`);
    
    // Si estamos en la página de inventario, renderizar
    if (document.getElementById('productsTableBody')) {
        renderInventory();
        renderCategories();
    }
    
    console.log('✅ Sistema de Inventario MC cargado correctamente! 📦');
});

// ============================================
// UTILIDADES DE DEBUGGING
// ============================================

// Función para ver el estado actual de los IDs
window.showIdStatus = function() {
    console.log('=== ESTADO DE IDS ===');
    console.log('Próximo ID de Producto:', nextProductId);
    console.log('Próximo ID de Categoría:', nextCategoryId);
    console.log('Total de Productos:', inventory.length);
    console.log('Total de Categorías:', categories.length);
    console.log('IDs de Productos:', inventory.map(p => p.id).sort((a, b) => a - b));
    console.log('IDs de Categorías:', categories.map(c => c.id).sort((a, b) => a - b));
};

