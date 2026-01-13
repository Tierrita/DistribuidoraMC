// =============================
// Utils de Negocio y Feedback Centralizado
// =============================

// Validar stock de producto
export function validarStock(producto, cantidad) {
    if (!producto) return false;
    return producto.stock >= cantidad;
}

// Mostrar feedback visual en fila de producto
export function highlightFilaProducto(productId, clase = 'highlight', ms = 1800) {
    const fila = document.querySelector(`tr[data-id='${productId}']`);
    if (fila) {
        fila.classList.add(clase);
        setTimeout(() => fila.classList.remove(clase), ms);
    }
}

// Centralizar errores
export function mostrarError(mensaje) {
    if (window.showToast) {
        window.showToast(mensaje, 'error');
    } else {
        alert(mensaje);
    }
}

// Centralizar éxito
export function mostrarExito(mensaje) {
    if (window.showToast) {
        window.showToast(mensaje, 'success');
    } else {
        alert(mensaje);
    }
}

// Centralizar advertencia
export function mostrarAdvertencia(mensaje) {
    if (window.showToast) {
        window.showToast(mensaje, 'warning');
    } else {
        alert(mensaje);
    }
}