# 🥩 Distribuidora MC - Sistema de Gestión

Sistema web completo para gestión de inventario y pedidos de una distribuidora de fiambres y embutidos.

## ✨ Características Principales

- **📦 Gestión de Inventario**: Control de productos con marca, peso, precio por kg, precio de costo y precio de venta
- **🛒 Sistema de Pedidos**: Carrito de compras intuitivo y procesamiento de órdenes
- **💾 Base de Datos en la Nube**: Integración con Supabase para persistencia en tiempo real
- **📱 Diseño Responsive**: Interfaz moderna adaptable a todos los dispositivos
- **🔍 Búsqueda Avanzada**: Buscar productos por ID, nombre o marca

## 🚀 Inicio Rápido

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd DistribuidoraMC
   ```

2. **Configura Supabase**
   - Edita `supabase-config.js` con tus credenciales
   - Ejecuta los scripts SQL de la carpeta `sql/`

3. **Inicia el servidor**
   - Abre con Live Server en VS Code
   - O accede directamente al archivo HTML

## 📁 Estructura del Proyecto

```
DistribuidoraMC/
├── index.html              # Página principal
├── inventario.html         # Gestión de inventario
├── pedidos.html            # Sistema de pedidos
├── contacto.html           # Información de contacto
├── styles.css              # Estilos globales
├── script.js               # Scripts generales
├── inventory.js            # Lógica de inventario
├── orders.js               # Lógica de pedidos
├── supabase-config.js      # Configuración de Supabase
├── sql/                    # Scripts de base de datos
│   ├── database-schema.sql
│   ├── update_productos_schema.sql
│   └── insertar_productos_mc.sql
├── scripts/                # Scripts auxiliares
└── documentation/          # Documentación
```

## 🗄️ Base de Datos

### Estructura de la Tabla `productos`

| Campo        | Tipo          | Descripción                    |
|--------------|---------------|--------------------------------|
| id           | BIGSERIAL     | ID único autoincremental       |
| name         | TEXT          | Nombre del producto            |
| brand        | TEXT          | Marca                          |
| weight       | NUMERIC(10,3) | Peso en kilogramos             |
| price_per_kg | NUMERIC(10,2) | Precio por kilogramo           |
| cost_price   | NUMERIC(10,2) | Precio de costo total          |
| sale_price   | NUMERIC(10,2) | Precio de venta total          |
| created_at   | TIMESTAMP     | Fecha de creación              |
| updated_at   | TIMESTAMP     | Última actualización           |

## 🎯 Uso

### Agregar Productos
1. Ir a la página de **Inventario**
2. Click en **"+ Agregar Producto"**
3. Completar el formulario:
   - Nombre del producto
   - Marca
   - Peso (en kg)
   - Precio por kg
   - Precio de costo
   - Precio de venta
4. Los productos se sincronizan automáticamente con Supabase

### Editar Productos
1. Click en el ícono de **editar** (lápiz) en la tabla
2. Modificar los campos necesarios
3. Guardar cambios

### Realizar Pedidos
1. Navegar por el catálogo
2. Agregar productos al carrito
3. Completar datos del cliente
4. Finalizar pedido

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Supabase (PostgreSQL)
- **Diseño**: CSS Grid, Flexbox, Variables CSS
- **Iconos**: Font Awesome 6.4.0
- **Tipografía**: Google Fonts (Poppins)

## 🔐 Configuración de Supabase

### 1. Crear Proyecto
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la URL y la API Key

### 2. Configurar la Aplicación
Edita `supabase-config.js`:
```javascript
const SUPABASE_URL = 'tu-url-aqui';
const SUPABASE_ANON_KEY = 'tu-key-aqui';
```

### 3. Ejecutar Scripts SQL
En el SQL Editor de Supabase, ejecuta en orden:
1. `sql/database-schema.sql` - Crear estructura básica
2. `sql/update_productos_schema.sql` - Actualizar tabla productos
3. `sql/insertar_productos_mc.sql` - (Opcional) Cargar productos de ejemplo

## 📝 Documentación Adicional

- [Guía de Inicio Rápido](documentation/QUICKSTART.md)
- [Configuración de GitHub](documentation/GITHUB_SETUP.md)

## 🤝 Contribución

Este es un proyecto privado de Distribuidora MC.

## 📄 Licencia

© 2026 Distribuidora MC. Todos los derechos reservados.

---

**Desarrollado con ❤️ para Distribuidora MC**
