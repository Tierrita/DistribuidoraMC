# Sistema de Validaciones - Distribuidora MC

## ✅ Validaciones Implementadas

### 📦 **PRODUCTOS** (inventory.js + inventario.html)

#### Validaciones JavaScript:
1. **Código duplicado**
   - No permite códigos repetidos (solo en productos nuevos o si se modifica el código)
   - Mensaje: "Ya existe un producto con ese código"
   - Focus automático en el campo

2. **Nombre del producto**
   - No puede estar vacío
   - Longitud máxima: 100 caracteres
   - Mensajes: "El nombre del producto no puede estar vacío" / "...demasiado largo"

3. **Precio**
   - Debe ser mayor a 0
   - Máximo: 9,999,999
   - Mensajes: "El precio debe ser mayor a 0" / "El precio es demasiado alto"

4. **Stock**
   - No puede ser negativo
   - Mensaje: "El stock no puede ser negativo"

5. **Stock mínimo**
   - No puede ser negativo
   - Si stock mínimo > stock actual, muestra confirmación
   - Mensaje: "Stock actual es menor al stock mínimo. ¿Continuar?"

6. **Categoría**
   - Debe estar seleccionada
   - Mensaje: "Debes seleccionar una categoría"

#### Validaciones HTML5:
- `required` en todos los campos obligatorios
- `maxlength="20"` en código
- `maxlength="100"` en nombre
- `type="number"` con `min="0.01"` y `max="9999999"` en precio
- `type="number"` con `min="0"` en stock y stock mínimo

---

### 🏷️ **CATEGORÍAS** (inventory.js + inventario.html)

#### Validaciones JavaScript:
1. **Nombre de categoría**
   - No puede estar vacío
   - Longitud máxima: 50 caracteres
   - No duplicados (case-insensitive)
   - Mensajes: "El nombre...no puede estar vacío" / "...demasiado largo" / "Ya existe una categoría con ese nombre"

2. **Slug duplicado**
   - Verifica que no exista categoría similar
   - Mensaje: "Ya existe una categoría similar con ese nombre"

3. **Ícono Font Awesome**
   - No puede estar vacío
   - Debe empezar con "fa-"
   - Mensajes: "Debes ingresar un ícono..." / "El ícono debe empezar con 'fa-'"

4. **Descripción**
   - Longitud máxima: 200 caracteres
   - Mensaje: "La descripción es demasiado larga"

#### Validaciones HTML5:
- `required` en nombre, ícono y color
- `maxlength="50"` en nombre
- `pattern="fa-.*"` en ícono (debe empezar con fa-)
- `maxlength="30"` en ícono
- `maxlength="200"` en descripción
- `type="color"` para selector de color

---

### 🛒 **PEDIDOS** (orders.js + pedidos.html)

#### Validaciones JavaScript:
1. **Carrito vacío**
   - Verifica antes de abrir checkout
   - Doble verificación en submit
   - Mensaje: "El carrito está vacío"

2. **Nombre del cliente**
   - Mínimo 3 caracteres
   - Máximo 100 caracteres
   - Mensajes: "El nombre debe tener al menos 3 caracteres" / "...demasiado largo"

3. **Teléfono argentino**
   - Formato flexible: 7-20 dígitos
   - Permite espacios, guiones, paréntesis, +
   - Pattern: `/^[\d\s\-\+\(\)]{7,20}$/`
   - Mensaje: "El teléfono debe tener entre 7 y 20 dígitos"

4. **Email**
   - Validación solo si se ingresa email
   - Pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
   - Mensaje: "El email no es válido"

5. **Dirección**
   - Mínimo 5 caracteres
   - Máximo 150 caracteres
   - Mensajes: "La dirección debe tener al menos 5 caracteres" / "...demasiado larga"

6. **Stock disponible**
   - Verifica stock de cada producto antes de confirmar
   - Mensajes: "El producto...ya no está disponible" / "Stock insuficiente para..."

#### Validaciones HTML5:
- `required` en nombre, teléfono y dirección
- `minlength="3"` y `maxlength="100"` en nombre
- `pattern="[0-9\s\-\+\(\)]{7,20}"` en teléfono
- `type="email"` y `maxlength="100"` en email
- `minlength="5"` y `maxlength="150"` en dirección
- `maxlength="500"` en notas del pedido

---

## 🎨 Experiencia de Usuario

### Feedback Visual:
- ✅ **Notificaciones**: Mensajes claros y específicos
- ✅ **Focus automático**: El cursor se posiciona en el campo con error
- ✅ **Colores**: Verde para éxito, rojo para error
- ✅ **Confirmaciones**: Diálogos para acciones críticas

### Validaciones en Capas:
1. **HTML5** (Primera barrera)
   - Validación instantánea en el navegador
   - No permite envío del formulario si falla
   
2. **JavaScript** (Segunda barrera)
   - Validaciones personalizadas y lógica de negocio
   - Mensajes específicos según el contexto
   
3. **Confirmaciones** (Prevención)
   - Dialogs para acciones destructivas
   - Advertencias cuando datos son inusuales

---

## 📋 Validaciones por Prioridad

### 🔴 ALTA PRIORIDAD (Implementadas):
- ✅ Stock negativo → **BLOQUEADO**
- ✅ Código duplicado → **BLOQUEADO**
- ✅ Nombre de categoría duplicado → **BLOQUEADO**
- ✅ Teléfono formato argentino → **VALIDADO**
- ✅ Carrito vacío → **BLOQUEADO**
- ✅ Precio mínimo (> 0) → **BLOQUEADO**
- ✅ Stock disponible al confirmar pedido → **VALIDADO**

### 🟡 MEDIA PRIORIDAD (Implementadas):
- ✅ Email formato válido → **VALIDADO**
- ✅ Límites de caracteres → **IMPLEMENTADOS**
- ✅ Validación ícono Font Awesome → **VALIDADO**
- ✅ Alertas visuales → **IMPLEMENTADAS**

### 🟢 BAJA PRIORIDAD (Futuras):
- ⏳ Exportación - validación datos antes de generar Excel
- ⏳ Búsquedas - sanitización avanzada de inputs
- ⏳ LocalStorage - validación de integridad de datos
- ⏳ Validación de formato de dirección más específica
- ⏳ Autocompletado de teléfonos con código de área

---

## 🔧 Patrones de Validación Utilizados

### Regex Patterns:
```javascript
// Teléfono argentino (flexible)
/^[\d\s\-\+\(\)]{7,20}$/

// Email básico
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Ícono Font Awesome
pattern="fa-.*"
```

### Límites Configurados:
```javascript
// Productos
código: maxlength="20"
nombre: maxlength="100"
precio: min="0.01", max="9999999"
stock: min="0", max="999999"
stockMin: min="0", max="99999"

// Categorías
nombre: maxlength="50"
ícono: maxlength="30", pattern="fa-.*"
descripción: maxlength="200"

// Pedidos
nombre: minlength="3", maxlength="100"
teléfono: pattern (7-20 chars)
email: maxlength="100"
dirección: minlength="5", maxlength="150"
notas: maxlength="500"
```

---

## 💡 Ejemplos de Uso

### Código Duplicado:
```javascript
// Usuario intenta agregar producto con código "JAM001"
// Ya existe otro producto con ese código
→ Validación falla
→ Mensaje: "Ya existe un producto con ese código"
→ Focus en campo 'productCode'
```

### Stock Insuficiente:
```javascript
// Usuario tiene 10 unidades de "Jamón" en el carrito
// Stock disponible: 5 unidades
→ Al hacer checkout, validación detecta el problema
→ Mensaje: "Stock insuficiente para Jamón. Disponible: 5"
→ Checkout bloqueado
```

### Teléfono Válido:
```javascript
// Formatos aceptados:
✅ "011 4567-8900"
✅ "+54 11 4567 8900"
✅ "(011) 45678900"
✅ "1145678900"

// Formatos rechazados:
❌ "123" (muy corto)
❌ "abcd1234567" (contiene letras)
❌ "12345678901234567890123" (muy largo)
```

---

## 🚀 Próximas Mejoras Sugeridas

1. **Validación de DNI/CUIT** para clientes corporativos
2. **Autocompletado de direcciones** usando APIs de geolocalización
3. **Validación de código postal** argentino
4. **Límite de items por pedido** (opcional)
5. **Validación de horarios de entrega** (rango de fechas/horas)
6. **Detección de productos inactivos** antes de agregar al carrito
7. **Validación de montos mínimos** de pedido
8. **Control de duplicados** en productos del carrito

---

## 📊 Estadísticas de Validación

- **Total de validaciones**: 25+
- **Validaciones HTML5**: 15
- **Validaciones JavaScript**: 18
- **Validaciones de negocio**: 8
- **Mensajes de error únicos**: 25+
- **Focus automático**: ✅ Todos los errores
- **Confirmaciones**: 3 (eliminar producto/categoría, stock mínimo)

---

## 🔄 Versión

**v1.0** - Sistema completo de validaciones (Diciembre 2024)
