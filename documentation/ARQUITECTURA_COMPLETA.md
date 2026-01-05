# 📚 Arquitectura Completa - Distribuidora MC

## 🎯 Descripción General

Sistema web para gestión de inventario y pedidos de una distribuidora de fiambres y embutidos. La aplicación permite administrar productos (con marca, peso, precios), realizar pedidos mediante un carrito de compras y mantener toda la información sincronizada en una base de datos en la nube.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura y contenido de las páginas
- **CSS3**: Estilos visuales, diseño responsive
  - CSS Grid y Flexbox para layouts
  - Variables CSS para temas consistentes
  - Media queries para adaptabilidad móvil
- **JavaScript ES6+**: Lógica de la aplicación
  - Módulos y funciones asíncronas
  - Manipulación del DOM
  - LocalStorage para datos temporales
  - Fetch API para comunicación con Supabase

### Backend y Base de Datos
- **Supabase**: Backend as a Service (BaaS)
  - Base de datos PostgreSQL
  - API REST automática
  - Autenticación y autorización
  - Almacenamiento en tiempo real

### Librerías Externas
- **Supabase JS Client v2**: Cliente JavaScript para interactuar con Supabase
- **Font Awesome 6.4.0**: Iconografía
- **Google Fonts (Poppins)**: Tipografía moderna

### Herramientas de Desarrollo
- **Git**: Control de versiones
- **VS Code**: Editor de código
- **Live Server**: Servidor de desarrollo local

---

## 📁 Estructura del Proyecto

```
DistribuidoraMC/
│
├── index.html              # Página principal de bienvenida
├── inventario.html         # Gestión completa de inventario
├── pedidos.html           # Sistema de carrito y pedidos
├── contacto.html          # Página de contacto
│
├── styles.css             # Estilos globales de toda la app
├── script.js              # Funciones generales y navegación
├── inventory.js           # Lógica específica del inventario
├── orders.js              # Lógica del sistema de pedidos
├── supabase-config.js     # Configuración y funciones de Supabase
│
├── sql/                   # Scripts de base de datos
│   ├── database-schema.sql           # Esquema completo de la BD
│   ├── update_productos_schema.sql   # Migración de productos
│   └── insertar_productos_mc.sql     # Carga inicial de productos
│
└── documentation/         # Documentación del proyecto
    ├── ARQUITECTURA_COMPLETA.md  # Este archivo
    ├── QUICKSTART.md             # Guía de inicio rápido
    ├── GITHUB_SETUP.md           # Configuración de GitHub
    └── old-docs/                 # Documentación histórica
```

---

## 🔄 Flujo de Datos

### 1. Carga Inicial de la Aplicación
```
Usuario accede → index.html
↓
Carga script.js (funciones globales)
↓
Inicializa estado global de la aplicación
↓
Carga carrito desde LocalStorage
```

### 2. Gestión de Inventario
```
Usuario accede a inventario.html
↓
inventory.js se carga y ejecuta
↓
loadDataFromSupabase() → Llama a supabase-config.js
↓
supabase-config.js → getProductos() → Consulta Supabase
↓
Supabase retorna datos → productos array
↓
renderInventory() → Muestra productos en tabla HTML
↓
updateStats() → Actualiza estadísticas en pantalla
```

### 3. Agregar/Editar Producto
```
Usuario completa formulario
↓
handleProductFormSubmit() → Validaciones
↓
Si es nuevo: addProducto() en supabase-config.js
Si existe: updateProducto() en supabase-config.js
↓
INSERT/UPDATE en tabla productos de Supabase
↓
Respuesta exitosa → Recargar datos
↓
renderInventory() actualiza vista
```

### 4. Sistema de Pedidos
```
Usuario navega por pedidos.html
↓
orders.js carga productos desde Supabase
↓
Usuario agrega productos al carrito
↓
addToCart() → Guarda en LocalStorage
↓
updateCartBadge() → Actualiza badge visual
↓
Usuario completa formulario de checkout
↓
submitOrder() → Crea pedido en Supabase
↓
INSERT en tabla pedidos con JSON de productos
↓
clearCart() → Limpia LocalStorage
```

---

## 🗄️ Modelo de Datos

### Tabla: productos

| Campo        | Tipo          | Descripción                          |
|--------------|---------------|--------------------------------------|
| id           | BIGSERIAL     | Identificador único (auto-increment) |
| name         | TEXT          | Nombre del producto                  |
| brand        | TEXT          | Marca del producto                   |
| weight       | NUMERIC(10,3) | Peso en kilogramos                   |
| price_per_kg | NUMERIC(10,2) | Precio por kilogramo                 |
| cost_price   | NUMERIC(10,2) | Precio de costo total                |
| sale_price   | NUMERIC(10,2) | Precio de venta total                |
| created_at   | TIMESTAMP     | Fecha de creación                    |
| updated_at   | TIMESTAMP     | Última modificación                  |

**Constraints:**
- `cost_price > 0` (debe ser mayor que cero)
- `sale_price > 0` (debe ser mayor que cero)

### Tabla: pedidos

| Campo          | Tipo      | Descripción                    |
|----------------|-----------|--------------------------------|
| id             | BIGSERIAL | Identificador único            |
| customer_name  | TEXT      | Nombre del cliente             |
| customer_phone | TEXT      | Teléfono del cliente           |
| customer_email | TEXT      | Email del cliente              |
| products       | JSONB     | Array de productos con cantidades |
| total          | NUMERIC   | Total del pedido               |
| status         | TEXT      | Estado (pendiente, completado) |
| created_at     | TIMESTAMP | Fecha del pedido               |

---

## 📄 Descripción de Archivos

### HTML Files

#### index.html
- **Propósito**: Página de inicio y bienvenida
- **Características**: Hero section, presentación de servicios, enlaces a secciones
- **Scripts cargados**: script.js, orders.js (para navegación del carrito)

#### inventario.html
- **Propósito**: CRUD completo de productos
- **Características**: 
  - Tabla interactiva de productos
  - Formulario modal para agregar/editar
  - Estadísticas en tiempo real (total productos, valor inventario)
  - Búsqueda por ID, nombre o marca
  - Botones de editar y eliminar por producto
- **Scripts cargados**: supabase-config.js, script.js, inventory.js, orders.js

#### pedidos.html
- **Propósito**: Sistema de carrito de compras y checkout
- **Características**:
  - Catálogo de productos disponibles
  - Carrito lateral deslizable
  - Formulario de checkout con validación
  - Badge de conteo de productos
- **Scripts cargados**: script.js, inventory.js, orders.js

#### contacto.html
- **Propósito**: Información de contacto de la distribuidora
- **Características**: Datos de contacto, ubicación, horarios
- **Scripts cargados**: script.js, orders.js

### JavaScript Files

#### script.js
- **Propósito**: Funciones globales compartidas
- **Funciones principales**:
  - Navegación entre páginas
  - Inicialización de eventos comunes
  - Funciones de utilidad compartidas
  - Gestión del estado global de la aplicación

#### inventory.js
- **Propósito**: Lógica completa del inventario
- **Funciones principales**:
  ```javascript
  loadDataFromSupabase()      // Carga productos desde Supabase
  renderInventory(products)    // Renderiza tabla de productos
  handleProductFormSubmit()    // Maneja envío del formulario
  editProduct(id)              // Prepara edición de producto
  deleteProduct(id)            // Elimina producto
  updateStats()                // Actualiza estadísticas
  searchProducts(query)        // Búsqueda de productos
  ```
- **Validaciones implementadas**:
  - Nombre del producto (obligatorio, mínimo 2 caracteres)
  - Marca (obligatorio)
  - Peso (número positivo)
  - Precio por kg (número positivo)
  - Precio de costo (número positivo)
  - Precio de venta (número positivo, mayor que costo)
  - IDs únicos al agregar

#### orders.js
- **Propósito**: Gestión de carrito y pedidos
- **Funciones principales**:
  ```javascript
  loadProductsForOrder()       // Carga productos disponibles
  addToCart(product, quantity) // Agrega al carrito
  removeFromCart(productId)    // Elimina del carrito
  updateCartBadge()            // Actualiza contador visual
  renderCart()                 // Muestra productos en carrito
  submitOrder()                // Procesa el pedido
  clearCart()                  // Vacía el carrito
  ```
- **Almacenamiento**: Usa LocalStorage para persistir carrito entre sesiones

#### supabase-config.js
- **Propósito**: Configuración y comunicación con Supabase
- **Configuración**:
  ```javascript
  const SUPABASE_URL = 'tu-url-de-supabase'
  const SUPABASE_ANON_KEY = 'tu-api-key'
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  ```
- **Funciones CRUD**:
  ```javascript
  async function getProductos()           // SELECT * FROM productos
  async function addProducto(producto)    // INSERT INTO productos
  async function updateProducto(id, data) // UPDATE productos
  async function deleteProducto(id)       // DELETE FROM productos
  async function addPedido(pedido)        // INSERT INTO pedidos
  async function getPedidos()             // SELECT * FROM pedidos
  ```

### CSS File

#### styles.css
- **Propósito**: Estilos globales de toda la aplicación
- **Estructura**:
  - Variables CSS para colores y espaciado
  - Reset y estilos base
  - Componentes reutilizables (botones, cards, modales)
  - Layouts de página (header, footer, main)
  - Estilos específicos por sección
  - Media queries para responsive design

---

## 🔐 Seguridad y Buenas Prácticas

### LocalStorage
- Se usa solo para datos no sensibles (carrito de compras)
- No almacena credenciales ni información personal
- Se limpia automáticamente al completar pedido

### Validaciones
- **Frontend**: Validación inmediata en formularios para UX
- **Backend**: Supabase valida constraints de base de datos
- **Inputs sanitizados**: Prevención de inyección de código

### Supabase
- API Key es pública (anon key) pero con RLS (Row Level Security) configurado
- Políticas de acceso configuradas en Supabase dashboard
- HTTPS para todas las comunicaciones

---

## 🚀 Flujo de Trabajo de Desarrollo

### 1. Desarrollo Local
```bash
# Abrir con Live Server en VS Code
# La app corre en http://127.0.0.1:5500/
```

### 2. Control de Versiones
```bash
git status                    # Ver cambios
git add .                     # Agregar cambios
git commit -m "mensaje"       # Commit
git push origin inventario    # Push a rama
```

### 3. Testing
- Probar cada página individualmente
- Verificar sincronización con Supabase
- Validar responsive design en diferentes dispositivos
- Probar flujo completo: agregar producto → hacer pedido

---

## 🔄 Ciclo de Vida de un Producto

```
1. CREACIÓN
   ├─ Usuario completa formulario en inventario.html
   ├─ Validaciones de frontend en inventory.js
   ├─ addProducto() envía a Supabase
   └─ Supabase valida constraints y guarda

2. VISUALIZACIÓN
   ├─ loadDataFromSupabase() obtiene todos los productos
   ├─ renderInventory() crea filas de tabla
   ├─ updateStats() calcula estadísticas
   └─ Usuario ve producto en tabla

3. EDICIÓN
   ├─ Usuario click en botón editar
   ├─ editProduct(id) carga datos en formulario
   ├─ Usuario modifica campos
   ├─ updateProducto() envía cambios a Supabase
   └─ Vista se actualiza automáticamente

4. USO EN PEDIDOS
   ├─ orders.js carga productos disponibles
   ├─ Usuario agrega a carrito
   ├─ Producto se guarda en LocalStorage
   ├─ Al completar pedido, se registra en tabla pedidos
   └─ Inventario NO se decrementa automáticamente

5. ELIMINACIÓN
   ├─ Usuario click en botón eliminar
   ├─ Confirmación de seguridad
   ├─ deleteProducto() elimina de Supabase
   └─ Vista se actualiza sin el producto
```

---

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: #d32f2f (Rojo)
- **Secundario**: #1976d2 (Azul)
- **Éxito**: #388e3c (Verde)
- **Advertencia**: #f57c00 (Naranja)
- **Fondo**: #f5f5f5 (Gris claro)

### Componentes UI
- **Navbar**: Navegación principal sticky
- **Cards**: Para mostrar productos en pedidos
- **Modales**: Para formularios de agregar/editar
- **Badges**: Contador de carrito
- **Tooltips**: Información adicional en hover

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 📊 Estadísticas y Cálculos

### En Inventario
```javascript
// Total de productos
totalProductos = productos.length

// Valor total del inventario
valorTotal = productos.reduce((sum, p) => sum + p.sale_price, 0)
```

### En Pedidos
```javascript
// Total del carrito
totalCarrito = carrito.reduce((sum, item) => 
  sum + (item.sale_price * item.quantity), 0
)

// Cantidad de items
cantidadItems = carrito.reduce((sum, item) => 
  sum + item.quantity, 0
)
```

---

## 🐛 Debugging y Solución de Problemas

### Errores Comunes

**1. "Cannot read properties of null"**
- **Causa**: Elemento DOM no existe en la página
- **Solución**: Agregar verificación `if (element) { ... }`

**2. "Supabase error: new row violates check constraint"**
- **Causa**: cost_price o sale_price es 0 o negativo
- **Solución**: Validar que valores sean > 0

**3. "Products not loading"**
- **Causa**: Credenciales de Supabase incorrectas
- **Solución**: Verificar SUPABASE_URL y SUPABASE_ANON_KEY

**4. "Cart not persisting"**
- **Causa**: LocalStorage bloqueado o lleno
- **Solución**: Verificar configuración del navegador

### Console.log Strategy
```javascript
// Debugging de carga de datos
console.log('Productos cargados:', productos)

// Debugging de formularios
console.log('Datos del formulario:', formData)

// Debugging de Supabase
console.log('Respuesta de Supabase:', response)
```

---

## 📈 Futuras Mejoras Potenciales

- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración
- [ ] Historial de pedidos por cliente
- [ ] Reportes y gráficos de ventas
- [ ] Exportación a PDF/Excel
- [ ] Notificaciones en tiempo real
- [ ] Sistema de clientes registrados
- [ ] Control de stock automático
- [ ] Múltiples categorías de productos
- [ ] Sistema de descuentos y promociones

---

## 📞 Soporte

Para dudas o problemas con la aplicación, revisar:
1. Esta documentación completa
2. [QUICKSTART.md](QUICKSTART.md) - Guía de inicio rápido
3. Comentarios en el código fuente
4. Documentación de Supabase: https://supabase.com/docs

---

**Última actualización**: 5 de enero de 2026
**Versión de la app**: 2.0 (Sistema con Supabase)
