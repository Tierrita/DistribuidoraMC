# 🛒 Módulo de Gestión de Pedidos - Distribuidora MC

Sistema completo para crear, gestionar y dar seguimiento a pedidos de clientes con integración a Supabase.

## 🚀 Configuración Inicial

### 1. Crear las tablas en Supabase

Ejecuta el script SQL en tu base de datos:

```sql
-- Ve al SQL Editor en Supabase Dashboard
-- Copia y pega el contenido de: sql/crear_tabla_pedidos.sql
-- Ejecuta el script
```

Este script creará:
- Tabla `pedidos` - Información principal del pedido
- Tabla `pedido_items` - Detalle de productos en cada pedido
- Triggers automáticos para actualizar totales
- Índices para mejorar performance
- Función para generar números de pedido únicos

### 2. Verificar integración

El sistema ya está integrado con Supabase a través de `supabase-config.js` con las siguientes funciones:
- `getPedidos()` - Obtener lista de pedidos
- `getPedidoById(id)` - Obtener pedido específico
- `addPedido(pedido)` - Crear nuevo pedido
- `updatePedido(id, updates)` - Actualizar pedido
- `updatePedidoStatus(id, status)` - Cambiar estado
- `deletePedido(id)` - Eliminar pedido
- `getPedidosStats()` - Obtener estadísticas

## ✨ Características Principales

### 📝 Crear Nuevo Pedido

**Paso 1: Seleccionar Cliente**
- Búsqueda en tiempo real de clientes desde Supabase
- Visualización de datos completos del cliente
- Opción para crear nuevo cliente si no existe
- Notas adicionales del pedido

**Paso 2: Armar el Pedido**
- Interfaz estilo POS (Point of Sale)
- Grid de productos con imágenes y precios
- Búsqueda de productos
- Filtros por categoría
- Carrito en tiempo real

**Paso 3: Confirmar y Guardar**
- Validación de datos
- Guardado automático en Supabase
- Generación de número de pedido único
- Actualización de stock (opcional)

### 📊 Historial de Pedidos

- Ver todos los pedidos realizados
- Búsqueda por número, cliente o fecha
- Filtros por estado (pendiente, completado, cancelado)
- Exportar a Excel/PDF
- Ver detalles completos de cada pedido

### 🎯 Estados de Pedido

Los pedidos pueden tener los siguientes estados:
- **Pendiente**: Recién creado, sin procesar
- **En Proceso**: En preparación
- **Completado**: Listo para entregar
- **Entregado**: Entregado al cliente
- **Cancelado**: Pedido cancelado

## 🗄️ Estructura de Base de Datos

### Tabla: `pedidos`
```sql
id                  BIGSERIAL PRIMARY KEY
order_number        VARCHAR(50) UNIQUE
cliente_id          BIGINT (FK a clientes)
customer_name       VARCHAR(100)
customer_phone      VARCHAR(20)
customer_email      VARCHAR(100)
customer_address    VARCHAR(200)
subtotal            NUMERIC(10, 2)
discount            NUMERIC(10, 2)
total               NUMERIC(10, 2)
status              VARCHAR(20)
notes               TEXT
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
completed_at        TIMESTAMPTZ
payment_method      VARCHAR(50)
paid                BOOLEAN
```

### Tabla: `pedido_items`
```sql
id                  BIGSERIAL PRIMARY KEY
pedido_id           BIGINT (FK a pedidos)
producto_id         BIGINT (FK a productos)
product_name        VARCHAR(100)
product_brand       VARCHAR(50)
product_weight      NUMERIC(10, 3)
quantity            INTEGER
unit_price          NUMERIC(10, 2)
total_price         NUMERIC(10, 2)
created_at          TIMESTAMPTZ
```

## 🔄 Flujo de Datos

### Crear Pedido

```javascript
// 1. El usuario crea el pedido en la interfaz
// 2. Se llama a orders.js -> handleCheckoutSubmit()
// 3. Se validan los datos
// 4. Se llama a supabaseDB.addPedido()
// 5. Se guarda el pedido principal
// 6. Se guardan los items
// 7. Los triggers actualizan totales automáticamente
// 8. Se retorna el pedido completo
```

### Relaciones

- Un `pedido` pertenece a un `cliente` (FK)
- Un `pedido` tiene muchos `pedido_items` (1:N)
- Un `pedido_item` referencia un `producto` (FK)

**Ventajas del diseño:**
- Si se elimina un pedido, los items se eliminan automáticamente (CASCADE)
- Si se elimina un cliente, el pedido mantiene los datos (SET NULL)
- Si se elimina un producto, el item mantiene el nombre (SET NULL)
- Los totales se calculan automáticamente con triggers

## 📱 Interfaz de Usuario

### Panel Principal

- **Tab "Nuevo Pedido"**: Crear pedidos
- **Tab "Historial"**: Ver pedidos anteriores

### Carrito POS

- Resumen en tiempo real
- Contador de items
- Subtotal actualizado
- Botones de acción rápida

### Modales

- **Modal de Carrito**: Ver/modificar items
- **Modal de Checkout**: Confirmar datos
- **Modal de Confirmación**: Número de pedido generado

## 🎨 Mejoras Visuales

### Notificaciones

El sistema muestra notificaciones para:
- ✅ Pedido creado exitosamente
- ✅ Pedido actualizado
- ❌ Errores de validación
- ❌ Errores de conexión

### Badges de Estado

- 🟡 **Pendiente**: Amarillo
- 🔵 **En Proceso**: Azul
- 🟢 **Completado/Entregado**: Verde
- 🔴 **Cancelado**: Rojo

## 🔧 Funciones JavaScript Clave

### En `supabase-config.js`

```javascript
// Obtener todos los pedidos
const pedidos = await supabaseDB.getPedidos();

// Obtener con filtros
const pendientes = await supabaseDB.getPedidos({ status: 'pendiente' });

// Crear pedido
const nuevoPedido = await supabaseDB.addPedido({
    cliente_id: 1,
    customer_name: 'Juan Pérez',
    items: [...],
    total: 5000
});

// Cambiar estado
await supabaseDB.updatePedidoStatus(pedidoId, 'completado');

// Obtener estadísticas
const stats = await supabaseDB.getPedidosStats();
```

### En `orders.js`

```javascript
// Agregar producto al carrito
addToCart(product, quantity);

// Procesar pedido
handleCheckoutSubmit(event);

// Renderizar historial
renderOrdersHistory();
```

## 🛠️ Personalización

### Agregar nuevo estado de pedido

1. **En SQL**:
```sql
ALTER TABLE pedidos
DROP CONSTRAINT pedidos_status_check;

ALTER TABLE pedidos
ADD CONSTRAINT pedidos_status_check
CHECK (status IN ('pendiente', 'en_proceso', 'completado', 'entregado', 'cancelado', 'tu_nuevo_estado'));
```

2. **En CSS** (`styles.css`):
```css
.status-badge.tu_nuevo_estado {
    background: #color-light;
    color: #color-dark;
}
```

### Agregar campo personalizado

1. En SQL: `ALTER TABLE pedidos ADD COLUMN mi_campo ...`
2. En `supabase-config.js`: Agregar campo en `addPedido()`
3. En `orders.js`: Agregar en `handleCheckoutSubmit()`
4. En `pedidos.html`: Agregar input en el formulario

## 📊 Reportes y Exportación

### Exportar a Excel

El sistema incluye SheetJS para exportar pedidos:

```javascript
// Ya está implementado el botón de exportar
// Los datos se descargan en formato .xlsx
```

### Métricas disponibles

```javascript
const stats = await supabaseDB.getPedidosStats();
// Retorna:
// - total_pedidos
// - total_ventas
// - pendientes
// - completados
// - cancelados
```

## 🐛 Solución de Problemas

### Los pedidos no se guardan

1. Verifica la consola del navegador (F12)
2. Confirma que las tablas existen en Supabase
3. Revisa las políticas RLS
4. Verifica que `supabase-config.js` esté cargado

### Error "cliente_id no existe"

1. Asegúrate de que la tabla `clientes` existe
2. Verifica que el cliente seleccionado tenga un ID válido
3. El sistema puede guardar sin cliente (cliente_id NULL)

### Los totales no se calculan

1. Verifica que los triggers estén creados
2. Ejecuta nuevamente el script de creación
3. Los triggers se ejecutan automáticamente al insertar items

### Stock no se actualiza

1. El sistema no actualiza stock automáticamente por defecto
2. Puedes activarlo en `orders.js -> updateInventoryStock()`
3. Requiere que los productos tengan el campo `stock`

## 🚀 Próximas Mejoras

- [ ] Impresión de tickets en PDF
- [ ] Envío de confirmación por email/WhatsApp
- [ ] Historial de cambios de estado
- [ ] Firma digital del cliente
- [ ] Fotos de entrega
- [ ] Integración con facturación
- [ ] Dashboard con gráficos de ventas
- [ ] Notificaciones push

## 📞 Notas Importantes

- Los números de pedido son únicos y auto-generados
- Los datos del cliente se guardan como snapshot (no cambian si el cliente se modifica)
- Los items mantienen el nombre del producto aunque se elimine
- Los triggers mantienen los totales sincronizados
- Se recomienda hacer backup periódico de la base de datos

---

**Desarrollado para Distribuidora MC** 🥩  
Sistema de Pedidos v2.0 con integración completa a Supabase
