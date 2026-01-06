# 👥 Módulo de Gestión de Clientes

Este módulo permite gestionar la cartera de clientes de la Distribuidora MC con todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

## 🚀 Instalación

### 1. Crear la tabla en Supabase

Ejecuta el script SQL en tu base de datos de Supabase:

```sql
-- Ve al SQL Editor en Supabase Dashboard
-- Copia y pega el contenido de: sql/crear_tabla_clientes.sql
-- Ejecuta el script
```

### 2. Verificar la configuración

Asegúrate de que `supabase-config.js` tenga tus credenciales correctas:

```javascript
const SUPABASE_URL = 'tu-url.supabase.co';
const SUPABASE_ANON_KEY = 'tu-key-aqui';
```

### 3. Acceder al módulo

Abre en tu navegador:
```
http://localhost/clientes.html
```
O usando Live Server en VS Code.

## ✨ Características

### 📋 Listado de Clientes
- Ver todos los clientes en formato de tabla
- Información completa: ID, nombre, email, teléfono, dirección, CUIT, estado
- Indicadores visuales de estado (activo/inactivo)

### 🔍 Búsqueda
- Buscar por nombre, email, teléfono o CUIT
- Búsqueda en tiempo real mientras escribes
- Botón para limpiar filtros

### ➕ Agregar Cliente
Campos disponibles:
- **Nombre Completo / Razón Social** (obligatorio)
- **Email** (opcional)
- **Teléfono** (obligatorio)
- **Dirección** (opcional)
- **CUIT/CUIL** (opcional)
- **Estado** (activo/inactivo)
- **Notas** (campo de texto libre para información adicional)

### ✏️ Editar Cliente
- Click en el botón de editar (lápiz)
- Modifica cualquier campo
- Guarda los cambios

### 🗑️ Eliminar Cliente
- Click en el botón de eliminar (papelera)
- Confirmación antes de eliminar
- Eliminación permanente de la base de datos

## 🗄️ Estructura de la Base de Datos

```sql
Tabla: clientes
├── id (BIGSERIAL PRIMARY KEY)
├── name (VARCHAR 100) - Nombre o razón social
├── email (VARCHAR 100) - Correo electrónico
├── phone (VARCHAR 20) - Teléfono
├── address (VARCHAR 200) - Dirección
├── cuit (VARCHAR 13) - CUIT/CUIL
├── status (VARCHAR 20) - 'activo' o 'inactivo'
├── notes (TEXT) - Notas adicionales
├── created_at (TIMESTAMPTZ) - Fecha de creación
└── updated_at (TIMESTAMPTZ) - Fecha de actualización
```

### Índices
Se crearon índices para mejorar la velocidad de búsqueda en:
- name
- email
- phone
- cuit
- status

## 📱 Interfaz de Usuario

### Colores de Estado
- 🟢 **Verde**: Cliente activo
- 🔴 **Rojo**: Cliente inactivo

### Notificaciones
El sistema muestra notificaciones temporales para:
- ✅ Cliente agregado exitosamente
- ✅ Cliente actualizado exitosamente
- ✅ Cliente eliminado exitosamente
- ❌ Errores en operaciones

## 🔧 Archivos del Módulo

```
DistribuidoraMC/
├── clientes.html          # Interfaz HTML
├── clientes.js            # Lógica de negocio
├── supabase-config.js     # Configuración (actualizado)
├── styles.css             # Estilos (actualizado)
└── sql/
    └── crear_tabla_clientes.sql  # Script de base de datos
```

## 🎯 Uso del Sistema

### Agregar un nuevo cliente
1. Click en "Agregar Cliente"
2. Completa los campos obligatorios (nombre y teléfono)
3. Opcionalmente completa email, dirección, CUIT y notas
4. Selecciona el estado (por defecto: activo)
5. Click en "Guardar"

### Buscar un cliente
1. Escribe en el campo de búsqueda
2. Los resultados se filtran automáticamente
3. Click en "Limpiar" para ver todos los clientes

### Editar un cliente
1. Click en el ícono de lápiz (✏️) en la fila del cliente
2. Modifica los campos necesarios
3. Click en "Guardar"

### Eliminar un cliente
1. Click en el ícono de papelera (🗑️) en la fila del cliente
2. Confirma la eliminación en el diálogo
3. El cliente se elimina permanentemente

## 🔐 Seguridad

- Row Level Security (RLS) habilitado en Supabase
- Validación de campos en el frontend
- Escape de HTML para prevenir XSS
- Confirmación antes de eliminar

## 🎨 Personalización

### Cambiar campos obligatorios
En `clientes.html`, agrega/quita el atributo `required`:
```html
<input type="text" id="clientEmail" required>
```

### Agregar nuevos campos
1. Agrega el campo en `clientes.html`
2. Modifica la función `handleSubmit()` en `clientes.js`
3. Actualiza la tabla en Supabase con `ALTER TABLE`

### Modificar estados disponibles
En `sql/crear_tabla_clientes.sql`:
```sql
status VARCHAR(20) DEFAULT 'activo' 
CHECK (status IN ('activo', 'inactivo', 'suspendido'))
```

## 🐛 Solución de Problemas

### Los clientes no se cargan
1. Verifica la consola del navegador (F12)
2. Confirma que la tabla existe en Supabase
3. Revisa las políticas RLS en Supabase
4. Verifica las credenciales en `supabase-config.js`

### Error al guardar
1. Verifica que los campos obligatorios estén completos
2. Revisa la consola para errores específicos
3. Confirma que el estado sea 'activo' o 'inactivo'

### Búsqueda no funciona
1. Verifica que hay datos en la tabla
2. Limpia el caché del navegador
3. Recarga la página

## 📊 Datos de Ejemplo

El script SQL incluye 4 clientes de ejemplo:
- Juan Pérez (cliente mayorista)
- María García (cliente frecuente)
- Supermercado El Ahorro S.A. (cadena)
- Pedro Rodríguez (inactivo)

Puedes eliminarlos después de las pruebas.

## 🔄 Próximas Mejoras

- [ ] Exportar listado a Excel/PDF
- [ ] Historial de pedidos por cliente
- [ ] Límite de crédito por cliente
- [ ] Categorías de clientes (mayorista, minorista, etc.)
- [ ] Gráficos de clientes activos vs inactivos
- [ ] Integración con sistema de pedidos

## 📞 Soporte

Para problemas o sugerencias, revisa:
- Documentación de Supabase: https://supabase.com/docs
- Consola del navegador (F12) para errores
- Logs en Supabase Dashboard

---

**Desarrollado para Distribuidora MC** 🥩
