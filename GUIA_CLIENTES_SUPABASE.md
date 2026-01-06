# 🚀 Guía Rápida: Configurar Clientes en Supabase

## Paso 1: Crear la tabla en Supabase

1. Ve a tu proyecto de Supabase: https://vifkbxcwwiqtddnvtnjk.supabase.co
2. En el menú lateral, haz clic en **SQL Editor**
3. Haz clic en **"+ New query"**
4. Copia y pega TODO el contenido del archivo `add_clientes_table.sql`
5. Haz clic en **"Run"** (o presiona `Ctrl + Enter`)

Deberías ver: ✅ **"Success. No rows returned"**

## Paso 2: Verificar que se creó la tabla

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver la tabla **"clientes"** con 5 clientes de ejemplo
3. Campos: id, name, email, phone, address, cuit, notes, created_at, updated_at

## Paso 3: Activar Supabase en el HTML

Asegúrate que `pedidos.html` y `clientes.html` incluyan:

```html
<!-- Supabase JS Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
```

## Paso 4: Probar la conexión

1. Abre `pedidos.html` en el navegador
2. Abre la **Consola** (F12)
3. Ejecuta:
```javascript
await window.supabaseDB.getClientes()
```

Deberías ver un array con los 5 clientes de ejemplo.

## 📋 ¿Qué cambió?

### Archivos modificados:
- ✅ **`supabase-config.js`**: Agregadas funciones CRUD para clientes
  - `getClientes()` - Obtener todos los clientes
  - `addCliente(cliente)` - Crear nuevo cliente
  - `updateCliente(id, cliente)` - Actualizar cliente
  - `deleteCliente(id)` - Eliminar cliente

- ✅ **`orders.js`**: Ya configurado para cargar clientes desde Supabase
- ✅ **`sample-data.js`**: Agregados 5 clientes de ejemplo para localStorage

### Nuevo archivo:
- 📄 **`add_clientes_table.sql`**: Script SQL para crear la tabla en Supabase

## 🎯 Próximos pasos

Una vez que ejecutes el SQL en Supabase:

1. **En la página de Pedidos:**
   - El selector de clientes cargará automáticamente desde Supabase
   - Podrás buscar y seleccionar clientes

2. **Crear la página de Clientes** (próximamente):
   - Agregar nuevos clientes
   - Editar información de clientes
   - Ver historial de pedidos por cliente

## ⚠️ Importante

**Si usas localStorage (sin Supabase conectado):**
- Los clientes se guardan localmente en el navegador
- No se sincronizan entre dispositivos

**Si usas Supabase:**
- Los clientes se guardan en la nube
- Accesibles desde cualquier dispositivo
- Respaldo automático

---

## 🐛 Solución de Problemas

### No veo clientes en pedidos.html

1. **Verifica la consola del navegador (F12)**
   - ¿Hay errores de Supabase?
   - ¿Dice "Clientes cargados desde Supabase"?

2. **Si no está conectado a Supabase:**
   - Carga datos locales: `initializeSampleData()` en la consola

3. **Si está conectado pero no carga:**
   - Verifica que el SQL se ejecutó correctamente en Supabase
   - Ve a Table Editor y confirma que la tabla "clientes" existe
   - Verifica que las políticas RLS están activas

### Error: "table clientes does not exist"

- Ve a Supabase SQL Editor
- Ejecuta el script `add_clientes_table.sql`

---

**¿Listo? ¡Ahora puedes guardar clientes en la nube! ☁️**
