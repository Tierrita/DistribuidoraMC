# 🥩 Distribuidora MC - Sistema de Gestión

Sistema web completo para la gestión de pedidos, inventario y clientes de una distribuidora de fiambres y embutidos.

![Estado del Proyecto](https://img.shields.io/badge/estado-activo-success)
![Versión](https://img.shields.io/badge/versión-2.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

## 📋 Descripción

Distribuidora MC es una aplicación web moderna y completa diseñada para gestionar todos los aspectos de una distribuidora de productos alimenticios. Incluye un sistema de punto de venta (POS), gestión de inventario, seguimiento de pedidos y exportación a Excel.

## ✨ Características Principales

### 🛒 Sistema de Pedidos (POS)
- **Interfaz de Punto de Venta** con dos columnas (productos + carrito en tiempo real)
- **Búsqueda instantánea** de productos por nombre o código
- **Filtros por categoría** dinámicos
- **Carrito sticky** que se mantiene visible al hacer scroll
- **Botón rápido** (⚡) para agregar 1 unidad instantáneamente
- **Controles de cantidad** inline en el carrito
- **Validación de stock** en tiempo real
- **Checkout completo** con formulario de cliente

### 📦 Gestión de Inventario
- CRUD completo de **productos** y **categorías**
- **Validación de datos** (códigos únicos, precios positivos, stock)
- **Badges de estado de stock** (Disponible, Bajo, Crítico, Agotado)
- **Búsqueda y filtrado** por categoría
- **Botón "Agregar a Pedido"** desde el inventario
- **Sistema de iconos** FontAwesome por categoría

### 📊 Historial de Pedidos
- **Visualización completa** de todos los pedidos
- **Estados de pedido**: Pendiente, En Proceso, Completado, Cancelado
- **Filtros por estado** y búsqueda
- **Tarjetas de pedido** con toda la información
- **Exportación individual a Excel** por pedido
- **Exportación masiva** de todos los pedidos
- **Cambio de estado** directo desde la interfaz

### 💾 Almacenamiento
- **LocalStorage** para persistencia de datos
- **Sin backend necesario** - 100% cliente
- **Datos sincronizados** entre todas las páginas
- **Sistema de IDs automático** para productos, categorías y pedidos

### 📤 Exportación Excel
- **Exportación individual** de pedidos con todos los detalles
- **Exportación masiva** de todos los pedidos en un archivo
- **Formato profesional** con hojas separadas
- **Formato argentino** para números y moneda
- Integración con **SheetJS (xlsx)**

### 🎨 Diseño UX/UI Moderno
- **Sistema de diseño completo** con CSS Variables
- **60+ variables**: colores, sombras, bordes, transiciones
- **Animaciones fluidas** (fade, slide, scale, rotate)
- **Gradientes** en botones, tarjetas y textos
- **Micro-interacciones** (hover, focus, active)
- **Efectos de profundidad** con sombras multinivel
- **Scrollbar personalizada** con gradiente
- **Sistema de notificaciones** toast (preparado)
- **Loading states** con spinner y skeleton screens
- **Responsive design** para mobile, tablet y desktop

## 🚀 Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables, grid, flexbox
- **JavaScript ES6+** - Lógica de negocio
- **LocalStorage API** - Persistencia de datos
- **SheetJS (xlsx)** - Exportación a Excel
- **Font Awesome 6** - Sistema de iconos
- **Google Fonts (Poppins)** - Tipografía moderna

## 📁 Estructura del Proyecto

```
Distribuidora MC/
├── index.html                 # Página de inicio
├── pedidos.html              # Sistema POS y gestión de pedidos
├── inventario.html           # Gestión de productos y categorías
├── contacto.html             # Página de contacto
├── styles.css                # Estilos globales (3000+ líneas)
├── script.js                 # Funciones compartidas
├── orders.js                 # Lógica de pedidos (1300+ líneas)
├── inventory.js              # Lógica de inventario (900+ líneas)
├── sample-data.js            # Datos de muestra para testing
├── .gitignore                # Archivos ignorados por Git
├── README.md                 # Este archivo
├── MEJORAS_UX_UI.md          # Documentación de mejoras UX/UI
├── GUIA_VISUAL_MEJORAS.md    # Guía visual antes/después
└── SOLUCION_PRODUCTOS.md     # Troubleshooting
```

## 🎯 Instalación y Uso

### Opción 1: Uso Directo (Recomendado)
1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/distribuidora-mc.git
   cd distribuidora-mc
   ```

2. Abre `index.html` en tu navegador
   - **Opción A**: Doble clic en el archivo
   - **Opción B**: Usa Live Server en VS Code
   - **Opción C**: Python SimpleHTTPServer:
     ```bash
     python3 -m http.server 8000
     # Abre http://localhost:8000
     ```

### Opción 2: Datos de Muestra
Si es la primera vez que usas el sistema:

1. Abre la consola del navegador (F12)
2. Ejecuta:
   ```javascript
   initializeSampleData()
   ```
3. La página se recargará con 8 productos y 4 categorías de ejemplo

## 📖 Guía de Uso Rápida

### Agregar Productos
1. Ve a **Inventario** → **Categorías**
2. Crea categorías (ej: Jamones, Quesos)
3. Ve a **Inventario** → **Productos**
4. Agrega productos con nombre, código, precio y stock

### Crear un Pedido
1. Ve a **Pedidos** → **Nuevo Pedido**
2. Busca o filtra productos
3. Usa el botón ⚡ para agregar 1 unidad rápidamente
4. Ajusta cantidades en el carrito (columna derecha)
5. Click en **Finalizar Pedido**
6. Completa datos del cliente
7. Confirma el pedido

### Exportar a Excel
- **Un pedido**: Click en el botón 📊 en la tarjeta del pedido
- **Todos los pedidos**: Click en "📊 Exportar Todo a Excel" en el historial

## 🎨 Personalización

### Colores
Edita las variables CSS en `styles.css` (líneas 7-64):
```css
:root {
    --primary-color: #DC2626;      /* Rojo principal */
    --primary-dark: #B91C1C;       /* Rojo oscuro */
    --secondary-color: #8B0000;    /* Vino tinto */
    /* ... más variables */
}
```

### Categorías
Agrega categorías y sus iconos en `inventory.js`:
```javascript
function getCategoryIcons() {
    return {
        jamones: 'fa-bacon',
        quesos: 'fa-cheese',
        // Agrega más...
    };
}
```

## 🔧 Funciones Avanzadas

### Debugging
```javascript
// Ver estado del inventario
console.log(window.inventory);

// Ver estado de IDs
showIdStatus();

// Limpiar todo y empezar de nuevo
localStorage.clear();
location.reload();
```

### Validaciones Incluidas
- ✅ Códigos de producto únicos
- ✅ Precios mayores a 0
- ✅ Stock no negativo
- ✅ Nombres de categoría únicos
- ✅ Formato de iconos FontAwesome (fa-*)
- ✅ Teléfono (7-20 dígitos)
- ✅ Email válido
- ✅ Stock disponible al hacer pedido

## 📱 Responsive Design

- **Desktop**: Layout de 2 columnas en POS
- **Tablet**: Adaptación de grid y filtros
- **Mobile**: Stack vertical, menú hamburguesa

## 🚧 Roadmap

- [ ] Dark mode
- [ ] Backend con Node.js/Express
- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] Autenticación de usuarios
- [ ] Reportes y estadísticas
- [ ] Dashboard con gráficos
- [ ] Impresión de comprobantes
- [ ] Integración con WhatsApp API
- [ ] PWA (Progressive Web App)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👤 Autor

**Franco Cuenca**

- GitHub: [@francocuenca](https://github.com/francocuenca)

## 🙏 Agradecimientos

- [Font Awesome](https://fontawesome.com/) - Sistema de iconos
- [Google Fonts](https://fonts.google.com/) - Tipografía Poppins
- [SheetJS](https://sheetjs.com/) - Exportación a Excel
- Comunidad de desarrolladores por el feedback

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!

**Desarrollado con ❤️ para Distribuidora MC**
