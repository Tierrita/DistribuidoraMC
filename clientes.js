// ============================================
// SISTEMA DE CLIENTES - Distribuidora MC
// ============================================

let clients = [];
let editingClientId = null;

// Elementos del DOM
let clientsTableBody;
let emptyClientsState;
let clientSearchInput;
let totalClientsEl;
let activeClientsEl;
let clientModal;
let clientForm;
let modalTitle;
let btnCancelClient;
let clientModalClose;

// Inicializar elementos del DOM
function initializeDOMElements() {
    clientsTableBody = document.getElementById('clientsTableBody');
    emptyClientsState = document.getElementById('emptyClientsState');
    clientSearchInput = document.getElementById('clientSearchInput');
    totalClientsEl = document.getElementById('totalClients');
    activeClientsEl = document.getElementById('activeClients');
    clientModal = document.getElementById('clientModal');
    clientForm = document.getElementById('clientForm');
    modalTitle = document.getElementById('modalTitle');
    btnCancelClient = document.getElementById('btnCancelClient');
    clientModalClose = document.getElementById('clientModalClose');
}

// ============================================
// FUNCIONES DE CARGA DE DATOS
// ============================================

async function loadClients() {
    try {
        // Intentar cargar desde Supabase
        if (window.supabaseDB && typeof window.supabaseDB.getClientes === 'function') {
            clients = await window.supabaseDB.getClientes();
            console.log('✅ Clientes cargados desde Supabase:', clients.length);
        } else {
            // Fallback a localStorage
            const stored = localStorage.getItem('distributoraMC_clients');
            clients = stored ? JSON.parse(stored) : [];
            console.log('📦 Clientes cargados desde localStorage:', clients.length);
        }
        
        renderClients();
        updateStats();
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        showNotification('Error al cargar clientes', 'error');
        
        // Fallback a localStorage en caso de error
        const stored = localStorage.getItem('distributoraMC_clients');
        clients = stored ? JSON.parse(stored) : [];
        renderClients();
        updateStats();
    }
}

// ============================================
// FUNCIONES DE RENDERIZADO
// ============================================

function renderClients(filter = '') {
    if (!clientsTableBody) return;
    
    const filteredClients = filter
        ? clients.filter(client => {
            const searchStr = filter.toLowerCase();
            return (
                client.name?.toLowerCase().includes(searchStr) ||
                client.phone?.toLowerCase().includes(searchStr) ||
                client.address?.toLowerCase().includes(searchStr)
            );
        })
        : clients;
    
    if (filteredClients.length === 0) {
        clientsTableBody.innerHTML = '';
        emptyClientsState.style.display = 'flex';
        return;
    }
    
    emptyClientsState.style.display = 'none';
    
    clientsTableBody.innerHTML = filteredClients
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(client => `
            <tr data-client-id="${client.id}">
                <td><strong>${escapeHtml(client.name)}</strong></td>
                <td>${escapeHtml(client.phone || '-')}</td>
                <td>${escapeHtml(client.address || '-')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="editClient(${client.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="confirmDeleteClient(${client.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
}

function updateStats() {
    if (totalClientsEl) totalClientsEl.textContent = clients.length;
    if (activeClientsEl) activeClientsEl.textContent = clients.length;
}

// ============================================
// FUNCIONES DE MODAL
// ============================================

function openClientModal() {
    editingClientId = null;
    modalTitle.textContent = 'Agregar Cliente';
    clientForm.reset();
    clientModal.style.display = 'flex';
    
    // Focus en el primer campo
    setTimeout(() => {
        document.getElementById('clientName').focus();
    }, 100);
}

function closeClientModal() {
    clientModal.style.display = 'none';
    clientForm.reset();
    editingClientId = null;
}

// ============================================
// FUNCIONES CRUD
// ============================================

async function saveClient(e) {
    e.preventDefault();
    
    const clientData = {
        name: document.getElementById('clientName').value.trim(),
        phone: document.getElementById('clientPhone').value.trim(),
        address: document.getElementById('clientAddress').value.trim()
    };
    
    // Validación
    if (!clientData.name || !clientData.phone || !clientData.address) {
        showNotification('Todos los campos son requeridos', 'error');
        return;
    }
    
    try {
        if (editingClientId) {
            // Actualizar cliente existente
            if (window.supabaseDB && typeof window.supabaseDB.updateCliente === 'function') {
                const updated = await window.supabaseDB.updateCliente(editingClientId, clientData);
                const index = clients.findIndex(c => c.id === editingClientId);
                if (index !== -1) {
                    clients[index] = updated;
                }
                console.log('✅ Cliente actualizado en Supabase');
            } else {
                // localStorage
                const index = clients.findIndex(c => c.id === editingClientId);
                if (index !== -1) {
                    clients[index] = { ...clients[index], ...clientData };
                    localStorage.setItem('distributoraMC_clients', JSON.stringify(clients));
                }
            }
            showNotification('Cliente actualizado exitosamente', 'success');
        } else {
            // Crear nuevo cliente
            if (window.supabaseDB && typeof window.supabaseDB.addCliente === 'function') {
                const newClient = await window.supabaseDB.addCliente(clientData);
                clients.push(newClient);
                console.log('✅ Cliente agregado a Supabase');
            } else {
                // localStorage
                const newClient = {
                    id: Date.now(),
                    ...clientData,
                    created_at: new Date().toISOString()
                };
                clients.push(newClient);
                localStorage.setItem('distributoraMC_clients', JSON.stringify(clients));
            }
            showNotification('Cliente agregado exitosamente', 'success');
        }
        
        closeClientModal();
        renderClients();
        updateStats();
        
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        showNotification('Error al guardar cliente', 'error');
    }
}

function editClient(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    editingClientId = id;
    modalTitle.textContent = 'Editar Cliente';
    
    document.getElementById('clientName').value = client.name || '';
    document.getElementById('clientPhone').value = client.phone || '';
    document.getElementById('clientAddress').value = client.address || '';
    
    clientModal.style.display = 'flex';
}

function confirmDeleteClient(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;
    
    if (confirm(`¿Estás seguro de eliminar el cliente "${client.name}"?`)) {
        deleteClient(id);
    }
}

async function deleteClient(id) {
    try {
        if (window.supabaseDB && typeof window.supabaseDB.deleteCliente === 'function') {
            await window.supabaseDB.deleteCliente(id);
            console.log('✅ Cliente eliminado de Supabase');
        } else {
            // localStorage
            localStorage.setItem('distributoraMC_clients', JSON.stringify(clients.filter(c => c.id !== id)));
        }
        
        clients = clients.filter(c => c.id !== id);
        renderClients();
        updateStats();
        showNotification('Cliente eliminado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        showNotification('Error al eliminar cliente', 'error');
    }
}

// ============================================
// FUNCIONES DE BÚSQUEDA
// ============================================

function handleSearch(e) {
    const searchTerm = e.target.value.trim();
    renderClients(searchTerm);
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Usar el sistema de notificaciones global si existe
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        alert(message);
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeDOMElements();
    
    // Event Listeners
    if (clientSearchInput) {
        clientSearchInput.addEventListener('input', handleSearch);
    }
    
    if (clientForm) {
        clientForm.addEventListener('submit', saveClient);
    }
    
    if (btnCancelClient) {
        btnCancelClient.addEventListener('click', closeClientModal);
    }
    
    if (clientModalClose) {
        clientModalClose.addEventListener('click', closeClientModal);
    }
    
    // Cerrar modal al hacer clic fuera
    if (clientModal) {
        clientModal.addEventListener('click', (e) => {
            if (e.target === clientModal) {
                closeClientModal();
            }
        });
    }
    
    // Botón agregar cliente
    const btnAddClient = document.getElementById('btnAddClient');
    if (btnAddClient) {
        btnAddClient.addEventListener('click', openClientModal);
    }
    
    // Cargar datos
    loadClients();
});

// Exponer funciones globalmente
window.editClient = editClient;
window.confirmDeleteClient = confirmDeleteClient;
window.openClientModal = openClientModal;
