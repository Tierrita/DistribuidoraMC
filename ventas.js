// =======================
// Carrito de ventas Gen Z
// =======================

let cart = [];

function addToCart(productId) {
    const product = inventory.find(p => p.id === productId);
    if (!product) {
        if (window.mostrarError) {
            window.mostrarError('Producto no encontrado');
        } else {
            window.showToast('Producto no encontrado', 'error');
        }
        return;
    }
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            code: product.code,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    renderCart();
    if (window.mostrarExito) {
        window.mostrarExito('Producto sumado al carrito 🚀');
    } else {
        window.showToast('Producto sumado al carrito 🚀', 'success');
    }
}

function updateCartQuantity(productId, delta) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = Math.max(1, cartItem.quantity + delta);
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function renderCart() {
    const cartContainer = document.getElementById('cartContainer');
    if (!cartContainer) return;
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} (${item.code})</span>
            <span>
                <button class="btn-minus" data-id="${item.id}">-</button>
                ${item.quantity}
                <button class="btn-plus" data-id="${item.id}">+</button>
            </span>
            <span>Precio: $${(item.price * item.quantity).toFixed(2)}</span>
            <button class="btn-remove" data-id="${item.id}">Eliminar</button>
        </div>
    `).join('');

    // Vincular eventos a los botones +/-
    document.querySelectorAll('.btn-plus').forEach(btn => {
        btn.onclick = () => updateCartQuantity(parseInt(btn.dataset.id), 1);
    });
    document.querySelectorAll('.btn-minus').forEach(btn => {
        btn.onclick = () => updateCartQuantity(parseInt(btn.dataset.id), -1);
    });
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.onclick = () => removeFromCart(parseInt(btn.dataset.id));
    });
}

// Vincular el evento al botón "Agregar al carrito"
document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.onclick = function() {
        const productId = parseInt(this.dataset.productId);
        addToCart(productId);
    };
});

// =======================
// Guardar venta en Supabase
// =======================

async function guardarVentaSupabase(clienteId) {
    if (cart.length === 0) {
        if (window.mostrarError) {
            window.mostrarError('El carrito está vacío');
        } else {
            window.showToast('El carrito está vacío', 'error');
        }
        return;
    }
    const venta = {
        cliente_id: clienteId,
        fecha: new Date().toISOString(),
        total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        productos: cart.map(item => ({
            producto_id: item.id,
            cantidad: item.quantity,
            precio_unitario: item.price
        }))
    };
    // Supabase: guardar venta y productos
    const { data, error } = await window.supabaseDB.supabase
        .from('ventas')
        .insert([{
            cliente_id: venta.cliente_id,
            fecha: venta.fecha,
            total: venta.total,
            productos: JSON.stringify(venta.productos)
        }]);
    if (error) {
        if (window.mostrarError) {
            window.mostrarError('Error al guardar la venta');
        } else {
            window.showToast('Error al guardar la venta', 'error');
        }
    } else {
        if (window.mostrarExito) {
            window.mostrarExito('Venta guardada en Supabase 🎉');
        } else {
            window.showToast('Venta guardada en Supabase 🎉', 'success');
        }
        cart = [];
        renderCart();
    }
}
