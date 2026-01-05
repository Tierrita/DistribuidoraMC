# 🚀 Inicio Rápido - Distribuidora MC

## ⚡ Uso Inmediato (3 pasos)

### 1. Abre el proyecto
```bash
# Opción A: Doble click
# Abre index.html en tu navegador

# Opción B: Desde terminal
open index.html

# Opción C: Con servidor local
python3 -m http.server 8000
# Luego abre: http://localhost:8000
```

### 2. Inicializa datos de muestra (primera vez)
1. Abre la consola del navegador (F12 o Cmd+Option+I)
2. Escribe:
   ```javascript
   initializeSampleData()
   ```
3. La página se recargará con 8 productos y 4 categorías

### 3. ¡Listo para usar!
- **Inicio**: Página principal con información
- **Pedidos**: Sistema POS para crear pedidos
- **Inventario**: Gestión de productos y categorías
- **Contacto**: Información de contacto

---

## 📋 Flujo de Trabajo Típico

### Crear Productos
1. Ve a **Inventario** → **Categorías**
2. Click en "➕ Nueva Categoría"
3. Completa: nombre, icono (ej: `fa-bacon`), descripción
4. Ve a **Inventario** → **Productos**
5. Click en "➕ Nuevo Producto"
6. Completa: código, nombre, categoría, precio, stock

### Hacer un Pedido
1. Ve a **Pedidos** → **Nuevo Pedido**
2. Busca productos en la barra de búsqueda
3. O filtra por categoría con los botones
4. Click en ⚡ para agregar 1 unidad rápidamente
5. O ajusta cantidad y click "Agregar al Carrito"
6. Revisa el carrito en la columna derecha
7. Click en "Finalizar Pedido"
8. Completa datos del cliente
9. Click en "Confirmar Pedido"

### Gestionar Pedidos
1. Ve a **Pedidos** → **Historial de Pedidos**
2. Filtra por estado (Pendiente, En Proceso, Completado)
3. Busca por número de pedido o cliente
4. Click en estado para cambiarlo
5. Click en 📊 para exportar a Excel
6. Click en "📊 Exportar Todo" para exportar todos los pedidos

---

## 🔧 Funciones Especiales

### Consola del Navegador (F12)

```javascript
// Ver inventario completo
console.log(window.inventory);

// Ver estado de IDs
showIdStatus();

// Inicializar datos de muestra
initializeSampleData();

// Limpiar todo (reset completo)
localStorage.clear();
location.reload();
```

---

## 🎨 Personalización Rápida

### Cambiar Colores
Edita `styles.css` líneas 10-30:
```css
:root {
    --primary-color: #DC2626;      /* Rojo principal */
    --primary-dark: #B91C1C;       /* Cambia a tu color */
    --secondary-color: #8B0000;    /* Color secundario */
}
```

### Agregar Categorías con Iconos
Busca iconos en: https://fontawesome.com/icons

Ejemplos de iconos disponibles:
- `fa-bacon` - Jamones/tocino
- `fa-cheese` - Quesos
- `fa-sausage` - Embutidos
- `fa-drumstick-bite` - Carnes
- `fa-fish` - Pescados
- `fa-bread-slice` - Productos de panadería
- `fa-pepper-hot` - Picantes
- `fa-ice-cream` - Postres

---

## 📱 Atajos de Teclado

- **F12** - Abrir consola del navegador
- **Cmd+R** (Mac) / **F5** (Windows) - Recargar página
- **Cmd+Shift+R** / **Ctrl+Shift+R** - Recarga forzada (limpia cache)

---

## ⚠️ Troubleshooting

### No aparecen productos en Pedidos
```javascript
// Ejecuta en consola:
initializeSampleData()
```

### Búsqueda no funciona
Refresca la página (F5)

### Carrito no se actualiza
Revisa que JavaScript esté habilitado en tu navegador

### Error al exportar Excel
Verifica que SheetJS esté cargando correctamente (mira la consola)

### Datos perdidos
Los datos se guardan en localStorage. Si cambias de navegador o limpias datos del navegador, se perderán. Usa exportación a Excel para backup.

---

## 🔄 Actualizar desde GitHub

Si hiciste cambios en GitHub y quieres actualizarlos en local:

```bash
cd "/Users/francocuenca/Desktop/Distribuidora MC"
git pull origin main
```

---

## 📤 Subir Cambios a GitHub

Después de hacer modificaciones:

```bash
cd "/Users/francocuenca/Desktop/Distribuidora MC"

# Ver cambios
git status

# Agregar cambios
git add .

# Hacer commit
git commit -m "Descripción de tus cambios"

# Subir a GitHub
git push origin main
```

---

## 📊 Verificar Sistema

Ejecuta el script de verificación:

```bash
cd "/Users/francocuenca/Desktop/Distribuidora MC"
./verify.sh
```

---

## 🎯 Tips de Uso

1. **Usa el botón ⚡ (quick add)** - Es la forma más rápida de agregar productos
2. **El carrito POS es sticky** - Siempre visible mientras haces scroll
3. **Filtra por categoría** - Para encontrar productos más rápido
4. **Exporta regularmente** - Usa Excel como backup de tus pedidos
5. **Valida el stock** - El sistema no te dejará vender más de lo disponible

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa `SOLUCION_PRODUCTOS.md`
2. Ejecuta `./verify.sh` para verificar el sistema
3. Mira la consola del navegador (F12) para errores
4. Consulta la documentación completa en `README.md`

---

**¡Disfruta del sistema! 🎉**
