// ============================================
// SISTEMA DE INVENTARIO SIMPLE - Distribuidora MC
// Version: 2026-01-05
// ============================================

let inventory = [];
let editingProductId = null;
let useSupabase = false;

// Elementos del DOM
const inventoryTableBody = document.getElementById('inventoryTableBody');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const btnAddProduct = document.getElementById('btnAddProduct');
const modalClose = document.getElementById('modalClose');
const btnCancel = document.getElementById('btnCancel');
const modalTitle = document.getElementById('modalTitle');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterBrand = document.getElementById('filterBrand');

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación...');
    
    // Verificar Supabase
    if (typeof window.supabaseDB !== 'undefined') {
        try {
            const connected = await window.supabaseDB.verificarConexion();
            if (connected) {
                useSupabase = true;
                console.log('✅ Conectado a Supabase');
                await loadFromSupabase();
            } else {
                console.log('⚠️ Usando LocalStorage');
            }
        } catch (error) {
            console.log('⚠️ Error con Supabase:', error);
        }
    }
    
    initializeEventListeners();
    renderInventory();
});

// ============================================
// CARGAR DATOS
// ============================================

async function loadFromSupabase() {
    try {
        const productos = await window.supabaseDB.getProductos();
        
        inventory = productos.map(p => ({
            id: p.id,
            name: p.name,
            brand: p.brand || '',
            weight: parseFloat(p.weight) || 0,
            costPrice: parseFloat(p.cost_price) || 0,
            pricePerKg: parseFloat(p.price_per_kg) || 0
        }));
        
        window.inventory = inventory;
        console.log(`✅ Cargados ${inventory.length} productos`);
        renderInventory();
    } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        alert('Error al cargar los productos de la base de datos');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    btnAddProduct.addEventListener('click', openModalForAdd);
    modalClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });
    productForm.addEventListener('submit', handleSubmit);
    
    // Búsqueda y filtros
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    if (filterBrand) {
        filterBrand.addEventListener('change', handleFilter);
    }
}

// ============================================
// MODAL
// ============================================

function openModalForAdd() {
    editingProductId = null;
    modalTitle.textContent = 'Agregar Producto';
    productForm.reset();
    productModal.classList.add('active');
    document.getElementById('productName').focus();
}

function openModalForEdit(productId) {
    editingProductId = productId;
    modalTitle.textContent = 'Editar Producto';
    
    const product = inventory.find(p => p.id === productId);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productBrand').value = product.brand || '';
        document.getElementById('productWeight').value = product.weight || '';
        document.getElementById('productCostPrice').value = product.costPrice || '';
        document.getElementById('productPricePerKg').value = product.pricePerKg || '';
    }
    
    productModal.classList.add('active');
}

function closeModal() {
    productModal.classList.remove('active');
    productForm.reset();
    editingProductId = null;
}

// ============================================
// GUARDAR PRODUCTO
// ============================================

async function handleSubmit(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const name = document.getElementById('productName').value.trim();
    const brand = document.getElementById('productBrand').value.trim();
    const weight = parseFloat(document.getElementById('productWeight').value);
    const costPrice = parseFloat(document.getElementById('productCostPrice').value) || 0;
    const pricePerKg = parseFloat(document.getElementById('productPricePerKg').value);
    
    // Validaciones
    if (!name) {
        alert('El nombre del producto es obligatorio');
        document.getElementById('productName').focus();
        return;
    }
    
    if (!weight || weight <= 0) {
        alert('El peso debe ser mayor a 0');
        document.getElementById('productWeight').focus();
        return;
    }
    
    if (!pricePerKg || pricePerKg <= 0) {
        alert('El precio por kg debe ser mayor a 0');
        document.getElementById('productPricePerKg').focus();
        return;
    }
    
    const productData = {
        name: name,
        brand: brand || null,
        weight: weight,
        costPrice: costPrice,
        pricePerKg: pricePerKg
    };
    
    try {
        if (editingProductId) {
            // Editar
            if (useSupabase) {
                await window.supabaseDB.updateProducto(editingProductId, {
                    name: productData.name,
                    brand: productData.brand,
                    weight: productData.weight,
                    cost_price: productData.costPrice,
                    price_per_kg: productData.pricePerKg
                });
                await loadFromSupabase();
            }
            alert('✅ Producto actualizado');
        } else {
            // Agregar nuevo
            if (useSupabase) {
                await window.supabaseDB.addProducto({
                    name: productData.name,
                    brand: productData.brand,
                    weight: productData.weight,
                    cost_price: productData.costPrice,
                    price_per_kg: productData.pricePerKg,
                    category: null,
                    sale_price: 0
                });
                await loadFromSupabase();
            } else {
                alert('⚠️ Supabase no está conectado');
                return;
            }
            alert('✅ Producto agregado correctamente');
        }
        
        closeModal();
        renderInventory();
    } catch (error) {
        console.error('❌ Error al guardar:', error);
        alert('Error al guardar el producto: ' + error.message);
    }
}

// ============================================
// ELIMINAR PRODUCTO
// ============================================

async function deleteProduct(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product) return;
    
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    
    try {
        if (useSupabase) {
            await window.supabaseDB.deleteProducto(productId);
            await loadFromSupabase();
            alert('✅ Producto eliminado');
   BÚSQUEDA Y FILTROS
// ============================================

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedBrand = filterBrand ? filterBrand.value : '';
    
    let filtered = inventory;
    
    // Filtrar por búsqueda
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.id.toString().includes(searchTerm) ||
            p.name.toLowerCase().includes(searchTerm) ||
            (p.brand && p.brand.toLowerCase().includes(searchTerm))
        );
    }
    
    // Filtrar por marca
    if (selectedBrand) {
        filtered = filtered.filter(p => p.brand === selectedBrand);
    }
    
    renderInventory(filtered);
}

function handleFilter() {
    handleSearch(); // Reutiliza la lógica de búsqueda
}

function updateBrandFilter() {
    if (!filterBrand) return;
    
    // Obtener marcas únicas
    const brands = [...new Set(inventory.map(p => p.brand).filter(b => b))].sort();
    
    filterBrand.innerHTML = '<option value="">Todas las marcas</option>' +
        brands.map(brand => `<option value="${brand}">${brand}</option>`).join('');
}

// ============================================
// RENDERIZAR TABLA
// ============================================

function renderInventory(productsToShow = inventory) {
    if (productsToShow.length === 0) {
        inventoryTableBody.innerHTML = '';
        if (inventory.length === 0) {
            emptyState.style.display = 'flex';
        } else {
            inventoryTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;">No se encontraron productos con ese criterio</td></tr>';
            emptyState.style.display = 'none';
        }
        return;
    }
    
    emptyState.style.display = 'none';
    
    inventoryTableBody.innerHTML = productsToShow.map(product => `
        <tr data-id="${product.id}">
            <td><span class="product-code">${product.id}</span></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.brand || '-'}</td>
            <td>${product.weight.toFixed(3)} kg</td>
            <td class="price">${product.costPrice > 0 ? '$' + product.costPrice.toFixed(2) : '-'}</td>
            <td class="price">$${product.pricePerKg.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="openModalForEdit(${product.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Actualizar filtro de marcas
    updateBrandFilter(          <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}
