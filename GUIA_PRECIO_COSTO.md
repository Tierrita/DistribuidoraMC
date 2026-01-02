# 🔧 Guía: Activar el Campo Precio de Costo

## Problema
El precio de costo no se muestra en la tabla porque falta la columna en la base de datos de Supabase.

---

## ✅ Solución (2 pasos)

### PASO 1: Agregar columna en Supabase

1. Ve a tu proyecto de Supabase: https://vifkbxcwwiqtddnvtnjk.supabase.co
2. Ve a **SQL Editor** (menú lateral izquierdo)
3. Copia y pega este SQL:

```sql
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2) DEFAULT 0;

UPDATE productos 
SET cost_price = 0 
WHERE cost_price IS NULL;
```

4. Haz clic en **RUN** (o presiona Ctrl+Enter)
5. Deberías ver: "Success. No rows returned"

### PASO 2: Recargar la página

1. Cierra y vuelve a abrir `inventario.html` en el navegador
2. Si usas localStorage (sin Supabase), borra los datos viejos:
   - Abre la Consola del navegador (F12)
   - Escribe: `localStorage.clear()`
   - Recarga la página

---

## 🧪 Probar que funciona

1. **Agregar un producto nuevo:**
   - Botón "Agregar Producto"
   - Llenar: Nombre, Categoría, **Precio de Costo** (ej: 1500), Precio Final (ej: 2000), Stock
   - Guardar

2. **Verificar en la tabla:**
   - Deberías ver 2 columnas: "Precio Costo" y "Precio Final"
   - El precio de costo debería mostrarse correctamente

---

## 📋 Archivos actualizados

- ✅ `supabase-config.js` - Ahora guarda y actualiza `cost_price`
- ✅ `inventory.js` - Carga `costPrice` desde Supabase
- ✅ `inventario.html` - Tabla muestra columna "Precio Costo"
- ✅ `sample-data.js` - Productos de ejemplo incluyen `costPrice`

---

## ⚠️ Nota sobre productos existentes

Los productos que ya estaban en Supabase **tendrán precio de costo = $0.00** hasta que los edites manualmente.

Para actualizar productos viejos:
1. Clic en el botón **✏️ Editar**
2. Ingresar el precio de costo
3. Guardar

---

## 🆘 Si sigue sin funcionar

1. Abre la **Consola del navegador** (F12)
2. Ve a la pestaña **Network** o **Red**
3. Agrega un producto
4. Busca la petición a Supabase
5. Verifica que incluya `cost_price` en el JSON

Si ves algún error, cópialo y avísame.
