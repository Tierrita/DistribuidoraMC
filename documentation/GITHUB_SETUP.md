# 🚀 Instrucciones para Subir a GitHub

## ✅ Estado Actual

Tu repositorio Git local ya está creado con:
- ✅ `.gitignore` configurado
- ✅ README.md profesional
- ✅ Primer commit realizado (21 archivos, 10,013 líneas)
- ✅ Rama `main` configurada

## 📝 Pasos para Subir a GitHub

### 1. Crear el Repositorio en GitHub

1. Ve a https://github.com
2. Inicia sesión con tu cuenta
3. Click en el botón **"+"** (esquina superior derecha)
4. Selecciona **"New repository"**

5. Configura el repositorio:
   ```
   Repository name: distribuidora-mc
   Description: Sistema de gestión completo para distribuidora de fiambres y embutidos con POS, inventario y exportación a Excel
   Visibilidad: Public (o Private si prefieres)
   
   ❌ NO marques "Add a README file"
   ❌ NO marques "Add .gitignore"
   ❌ NO marques "Choose a license"
   ```

6. Click en **"Create repository"**

### 2. Conectar con el Repositorio Remoto

Después de crear el repo, GitHub te mostrará comandos. Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
cd "/Users/francocuenca/Desktop/Distribuidora MC"

# Conectar con el repositorio remoto (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/distribuidora-mc.git

# Asegurarse de que la rama sea 'main'
git branch -M main

# Subir todos los archivos
git push -u origin main
```

**Ejemplo con usuario "francocuenca":**
```bash
git remote add origin https://github.com/francocuenca/distribuidora-mc.git
git branch -M main
git push -u origin main
```

### 3. Autenticación

GitHub te pedirá autenticación. Tienes dos opciones:

#### Opción A: GitHub CLI (Recomendado)
```bash
# Instalar GitHub CLI si no lo tienes
brew install gh

# Autenticarte
gh auth login

# Subir el código
git push -u origin main
```

#### Opción B: Personal Access Token
1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token"
3. Dale permisos de "repo"
4. Copia el token
5. Cuando Git pida contraseña, pega el token

### 4. Verificar

Refresca la página de tu repositorio en GitHub y deberías ver todos tus archivos.

## 🎉 ¡Listo!

Tu proyecto ahora está en GitHub. URL:
```
https://github.com/TU_USUARIO/distribuidora-mc
```

## 📱 Comandos Útiles para el Futuro

### Hacer cambios y subirlos:
```bash
# Ver archivos modificados
git status

# Agregar todos los cambios
git add .

# O agregar archivos específicos
git add archivo.js

# Hacer commit
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

### Ver historial:
```bash
git log --oneline
```

### Crear una rama nueva:
```bash
git checkout -b nombre-rama
git push -u origin nombre-rama
```

### Clonar en otra computadora:
```bash
git clone https://github.com/TU_USUARIO/distribuidora-mc.git
```

## 🌟 Agregar Temas Opcionales

### GitHub Pages (para hosting gratuito):
1. Ve a Settings del repositorio
2. Pages → Source → Main branch
3. Tu sitio estará en: `https://TU_USUARIO.github.io/distribuidora-mc`

### Agregar License:
1. En GitHub, click en "Add file" → "Create new file"
2. Nombre: `LICENSE`
3. Click en "Choose a license template"
4. Selecciona "MIT License"
5. Commit

### Agregar Topics:
En la página principal del repo:
- Click en el ⚙️ junto a "About"
- Agrega topics: `javascript`, `html`, `css`, `pos`, `inventory`, `excel`, `localstorage`

## 🔧 Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/distribuidora-mc.git
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push -u origin main
```

### Ver remotes configurados:
```bash
git remote -v
```

---

**¡Tu código está listo para compartirse con el mundo! 🚀**
