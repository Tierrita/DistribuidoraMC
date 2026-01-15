import { supabase } from './supabase-config.js';

// ================================
// DASHBOARD REAL
// ================================
document.addEventListener('DOMContentLoaded', cargarDashboard);

async function cargarDashboard() {
  try {
    const pedidos = await obtenerPedidosDashboard();
    const productos = await obtenerProductos();

    actualizarCards(pedidos, productos);
    console.log('Dashboard cargado OK');
  } catch (err) {
    console.error(err.message);
  }
}

// ================================
// DATOS
// ================================
async function obtenerPedidosDashboard() {
  const { data, error } = await supabase
    .from('pedido')
    .select('id, total, estado, creado_at');

  if (error) throw error;
  return data;
}

async function obtenerProductos() {
  const { data, error } = await supabase
    .from('producto')
    .select('id, stock_actual, stock_minimo');

  if (error) throw error;
  return data;
}

// ================================
// CARDS
// ================================
function actualizarCards(pedidos, productos) {
  // Pedidos del mes
  const mesActual = new Date().toISOString().slice(0, 7);
  const pedidosMes = pedidos.filter(p =>
    p.creado_at.startsWith(mesActual)
  );

  document.getElementById('monthlyOrders').textContent =
    pedidosMes.length;

  // Stock bajo
  const stockBajo = productos.filter(
    p => p.stock_actual <= p.stock_minimo
  ).length;

  document.getElementById('lowStock').textContent =
    stockBajo;

  // Clientes activos (placeholder simple)
  document.getElementById('activeClients').textContent =
    '—';
}
