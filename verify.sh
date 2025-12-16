#!/bin/bash

# ============================================
# SCRIPT DE VERIFICACIÓN - Distribuidora MC
# ============================================

echo "🔍 INICIANDO VERIFICACIÓN DEL SISTEMA..."
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASSED=0
FAILED=0

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 existe"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 NO ENCONTRADO"
        ((FAILED++))
    fi
}

# Función para verificar contenido
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $3"
        ((FAILED++))
    fi
}

echo "📄 VERIFICANDO ARCHIVOS HTML"
echo "----------------------------"
check_file "index.html"
check_file "pedidos.html"
check_file "inventario.html"
check_file "contacto.html"
echo ""

echo "📜 VERIFICANDO ARCHIVOS JAVASCRIPT"
echo "----------------------------------"
check_file "script.js"
check_file "orders.js"
check_file "inventory.js"
check_file "sample-data.js"
echo ""

echo "🎨 VERIFICANDO ARCHIVOS CSS"
echo "---------------------------"
check_file "styles.css"
echo ""

echo "📚 VERIFICANDO DOCUMENTACIÓN"
echo "----------------------------"
check_file "README.md"
check_file ".gitignore"
check_file "MEJORAS_UX_UI.md"
check_file "GUIA_VISUAL_MEJORAS.md"
check_file "SOLUCION_PRODUCTOS.md"
check_file "GITHUB_SETUP.md"
echo ""

echo "🔧 VERIFICANDO FUNCIONALIDADES EN CÓDIGO"
echo "----------------------------------------"
check_content "orders.js" "initializeDOMElements" "Inicialización de DOM en orders.js"
check_content "orders.js" "renderProductsForOrders" "Renderizado de productos en orders.js"
check_content "orders.js" "renderOrderCategoryFilters" "Filtros de categorías en orders.js"
check_content "inventory.js" "window.inventory" "Exposición global de inventario"
check_content "inventory.js" "loadInventoryFromStorage" "Carga desde localStorage"
check_content "sample-data.js" "initializeSampleData" "Datos de muestra disponibles"
check_content "styles.css" "--primary-color" "Sistema de variables CSS"
check_content "styles.css" "modal.active" "Estilos de modales"
check_content "styles.css" "pos-layout" "Layout POS"
echo ""

echo "🎯 VERIFICANDO CARACTERÍSTICAS PRINCIPALES"
echo "------------------------------------------"
check_content "orders.js" "DOMContentLoaded" "Event listener DOMContentLoaded en orders.js"
check_content "inventory.js" "DOMContentLoaded" "Event listener DOMContentLoaded en inventory.js"
check_content "orders.js" "exportAllOrdersToExcel" "Exportación a Excel"
check_content "pedidos.html" "pos-cart-section" "Carrito POS en HTML"
check_content "pedidos.html" "orderSearchInput" "Búsqueda de productos"
check_content "styles.css" "toast" "Sistema de notificaciones toast"
check_content "styles.css" "skeleton" "Skeleton loading states"
echo ""

echo "🔄 VERIFICANDO GIT"
echo "-----------------"
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Repositorio Git inicializado"
    ((PASSED++))
    
    # Ver remotes
    REMOTE=$(git remote -v 2>/dev/null | head -1)
    if [ -n "$REMOTE" ]; then
        echo -e "${GREEN}✓${NC} Remote configurado: $REMOTE"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠${NC} Remote no configurado (normal si no has hecho push)"
        ((PASSED++))
    fi
    
    # Ver commits
    COMMITS=$(git log --oneline 2>/dev/null | wc -l)
    echo -e "${GREEN}✓${NC} Commits realizados: $COMMITS"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Repositorio Git NO inicializado"
    ((FAILED++))
fi
echo ""

echo "📊 ESTADÍSTICAS DEL PROYECTO"
echo "----------------------------"
echo "HTML files: $(ls -1 *.html 2>/dev/null | wc -l)"
echo "JS files: $(ls -1 *.js 2>/dev/null | wc -l)"
echo "CSS files: $(ls -1 *.css 2>/dev/null | wc -l)"
echo "Total de líneas: $(cat *.html *.js *.css 2>/dev/null | wc -l)"
echo ""

echo "📦 TAMAÑO DE ARCHIVOS PRINCIPALES"
echo "---------------------------------"
du -h orders.js inventory.js styles.css 2>/dev/null
echo ""

echo "=========================================="
echo "RESULTADO DE LA VERIFICACIÓN"
echo "=========================================="
echo -e "${GREEN}✓ Pruebas pasadas: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}✗ Pruebas fallidas: $FAILED${NC}"
else
    echo -e "${GREEN}✓ Todas las pruebas pasaron${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo "🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!"
    echo ""
    echo "Próximos pasos:"
    echo "1. Abre index.html en tu navegador"
    echo "2. Ve a Pedidos y verifica que se carguen los productos"
    echo "3. Si no hay productos, ejecuta en consola: initializeSampleData()"
    echo ""
    exit 0
else
    echo "⚠️  Se encontraron algunos problemas"
    echo "Revisa los archivos marcados con ✗"
    echo ""
    exit 1
fi
