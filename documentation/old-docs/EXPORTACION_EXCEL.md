# Funcionalidad de Exportación a Excel

## 📋 Descripción General

Sistema de exportación de pedidos a archivos Excel (.xlsx) usando la librería SheetJS.

## 🔧 Implementación

### Librería Utilizada
- **SheetJS (xlsx)** v0.20.1
- Cargada via CDN en `pedidos.html`

### Funciones Principales

#### 1. `exportAllOrdersToExcel()`
Exporta todos los pedidos a un único archivo Excel.

**Características:**
- **Formato de tabla** con encabezados
- **Columnas:** Pedido, Fecha, Cliente, Teléfono, Email, Items, Total, Estado
- **Ordenamiento:** Por fecha descendente
- **Nombre del archivo:** `Pedidos_Distribuidora_MC_[fecha].xlsx`
- **Formato de fechas:** DD/MM/YYYY
- **Formato de montos:** $X.XXX,XX (formato argentino)

**Ubicación del botón:**
- Tab "Historial de Pedidos"
- Esquina superior derecha
- Botón verde con ícono de Excel

#### 2. `exportSingleOrder(orderId)`
Exporta un pedido individual con detalle completo.

**Características:**
- **Secciones:**
  1. Encabezado del pedido (número, fecha, estado)
  2. Datos del cliente (nombre, teléfono, email, dirección)
  3. Detalle de productos (tabla con cantidades y subtotales)
  4. Total del pedido

- **Formato detallado** con espaciado entre secciones
- **Nombre del archivo:** `Pedido_[número].xlsx`
- **Ubicación del botón:** En cada tarjeta de pedido (ícono verde de Excel)

## 🎨 Estilos

```css
.btn-icon.btn-success {
    background-color: #d1fae5;  /* Verde claro */
    color: #065f46;             /* Verde oscuro */
}

.btn-icon.btn-success:hover {
    background-color: #10b981;  /* Verde medio */
    color: var(--white);        /* Blanco */
}
```

## 📊 Formato de Datos

### Archivo de Todos los Pedidos
```
Pedido | Fecha      | Cliente    | Teléfono   | Email         | Items | Total       | Estado
-------|------------|------------|------------|---------------|-------|-------------|----------
1001   | 20/12/2024 | Juan Pérez | 1234567890 | juan@mail.com | 3     | $15.000,00  | Pendiente
1002   | 21/12/2024 | Ana López  | 0987654321 | ana@mail.com  | 2     | $8.500,00   | Completado
```

### Archivo de Pedido Individual
```
DISTRIBUIDORA MC - DETALLE DE PEDIDO

Número de Pedido: 1001
Fecha: 20/12/2024
Estado: Pendiente

DATOS DEL CLIENTE
Nombre: Juan Pérez
Teléfono: 1234567890
Email: juan@mail.com
Dirección: Calle Falsa 123

PRODUCTOS
Producto          | Precio Unitario | Cantidad | Subtotal
------------------|-----------------|----------|----------
Producto A        | $5.000,00       | 2        | $10.000,00
Producto B        | $2.500,00       | 2        | $5.000,00

                                      TOTAL:     $15.000,00
```

## 🚀 Uso

### Exportar Todos los Pedidos
1. Ir a la sección "Pedidos"
2. Hacer clic en el tab "Historial de Pedidos"
3. Hacer clic en el botón "Exportar Todo a Excel"
4. El archivo se descargará automáticamente

### Exportar Pedido Individual
1. Ir a la sección "Pedidos" → "Historial de Pedidos"
2. Localizar el pedido deseado
3. Hacer clic en el ícono verde de Excel en las acciones del pedido
4. El archivo se descargará automáticamente

## 🔍 Validaciones

- Si no hay pedidos, muestra alerta: "No hay pedidos para exportar"
- Si el pedido no existe, muestra alerta: "Pedido no encontrado"
- Ajuste automático del ancho de columnas para mejor visualización

## 📱 Compatibilidad

- ✅ Compatible con Microsoft Excel
- ✅ Compatible con Google Sheets
- ✅ Compatible con LibreOffice Calc
- ✅ Compatible con Numbers (Mac)

## 💡 Notas Técnicas

1. Los archivos se generan en el navegador (sin servidor)
2. No se requiere instalación de software adicional
3. Los datos se leen desde localStorage
4. La descarga es instantánea
5. No hay límite en la cantidad de pedidos a exportar

## 🔄 Versión

**v1.0** - Implementación inicial (Diciembre 2024)
