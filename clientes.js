// SISTEMA DE GESTIÓN DE CLIENTES
let clients = [];
let editingClientId = null;
let useSupabase = false;

const clientsTableBody = document.getElementById('clientsTableBody');
const clientModal = document.getElementById('clientModal');
const clientForm = document.getElementById('clientForm');
const btnAddClient = document.getElementById('btnAddClient');
const modalClose = document.getElementById('modalClose');
const btnCancel = document.getElementById('btnCancel');
const modalTitle = document.getElementById('modalTitle');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const btnClearFilters = document.getElementById('btnClearFilters');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando módulo de clientes...');
    if (typeof window.supabaseDB !== 'undefined') {
        try {
            const connected = await window.supabaseDB.verificarConexion();
            if (connected) {
                useSupabase = true;
                console.log('Conectado a Supabase');
                await loadFromSupabase();
            }
        } catch (error) {
            console.log('Error con Supabase:', error);
        }
    }
    initializeEventListeners();
    renderClients();
});

async function loadFromSupabase() {
    try {
        const clientsData = await window.supabaseDB.getClientes();
        clients = clientsData.map(c => ({
            id: c.id,
            name: c.name,
            email: c.email || '',
            phone: c.phone,
            address: c.address || '',
            cuit: c.cuit || '',
            status: c.status || 'activo',
            notes: c.notes || '',
            createdAt: c.created_at
        }));
        console.log('Cargados ' + clients.length + ' clientes');
        renderClients();
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        alert('Error al cargar los clientes de la base de datos');
    }
}

function initializeEventListeners() {
    btnAddClient.addEventListener('click', openModalForAdd);
    modalClose.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    clientModal.addEventListener('click', (e) => {
        if (e.target === clientModal) closeModal();
    });
    clientForm.addEventListener('submit', handleSubmit);
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', clearFilters);
    }
}

function openModalForAdd() {
    editingClientId = null;
    modalTitle.textContent = 'Agregar Cliente';
    clientForm.reset();
    document.getElementById('clientStatus').value = 'activo';
    clientModal.classList.add('active');
    document.getElementById('clientName').focus();
}

function openModalForEdit(clientId) {
    editingClientId = clientId;
    modalTitle.textContent = 'Editar Cliente';
    const client = clients.find(c => c.id === clientId);
    if (client) {
        document.getElementById('clientName').value = client.name;
        document.getElementById('clientEmail').value = client.email || '';
        document.getElementById('clientPhone').value = client.phone;
        document.getElementById('clientAddress').value = client.address || '';
        document.getElementById('clientCuit').value = client.cuit || '';
        document.getElementById('clientStatus').value = client.status || 'activo';
        document.getElementById('clientNotes').value = client.notes || '';
    }
    clientModal.classList.add('active');
}

function closeModal() {
    clientModal.classList.remove('active');
    clientForm.reset();
    editingClientId = null;
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const clientData = {
        name: document.getElementById('clientName').value.trim(),
        email: document.getElementById('clientEmail').value.trim(),
        phone: document.getElementById('clientPhone').value.trim(),
        address: document.getElementById('clientAddress').value.trim(),
        cuit: document.getElementById('clientCuit').value.trim(),
        status: document.getElementById('clientStatus').value,
        notes: document.getElementById('clientNotes').value.trim()
    };

    try {
        if (editingClientId) {
            // Actualizar cliente
            if (useSupabase) {
                await window.supabaseDB.updateCliente(editingClientId, clientData);
                await loadFromSupabase();
            } else {
                const index = clients.findIndex(c => c.id === editingClientId);
                if (index !== -1) {
                    clients[index] = { ...clients[index], ...clientData };
                }
                renderClients();
            }
            showNotification('Cliente actualizado exitosamente', 'success');
        } else {
            // Agregar nuevo cliente
            if (useSupabase) {
                await window.supabaseDB.addCliente(clientData);
                await loadFromSupabase();
            } else {
                const newClient = {
                    id: Date.now(),
                    ...clientData,
                    createdAt: new Date().toISOString()
                };
                clients.push(newClient);
                renderClients();
            }
            showNotification('Cliente agregado exitosamente', 'success');
        }
        closeModal();
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        showNotification('Error al guardar el cliente', 'error');
    }
}

async function deleteClient(clientId) {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (!confirm(`¿Estás seguro de eliminar al cliente "${client.name}"?`)) {
        return;
    }

    try {
        if (useSupabase) {
            await window.supabaseDB.deleteCliente(clientId);
            await loadFromSupabase();
        } else {
            clients = clients.filter(c => c.id !== clientId);
            renderClients();
        }
        showNotification('Cliente eliminado exitosamente', 'success');
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        showNotification('Error al eliminar el cliente', 'error');
    }
}

function renderClients() {
    if (clients.length === 0) {
        clientsTableBody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }

    emptyState.style.display = 'none';
    clientsTableBody.innerHTML = clients.map(client => `
        <tr>
            <td>${client.id}</td>
            <td><strong>${escapeHtml(client.name)}</strong></td>
            <td>${client.email ? escapeHtml(client.email) : '-'}</td>
            <td>${escapeHtml(client.phone)}</td>
            <td>${client.address ? escapeHtml(client.address) : '-'}</td>
            <td>${client.cuit ? escapeHtml(client.cuit) : '-'}</td>
            <td>
                <span class="status-badge ${client.status}">
                    ${client.status === 'activo' ? '✓ Activo' : '✕ Inactivo'}
                </span>
            </td>
            <td class="actions">
                <button class="btn-icon btn-edit" onclick="openModalForEdit(${client.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteClient(${client.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        btnClearFilters.style.display = 'none';
        renderClients();
        return;
    }

    btnClearFilters.style.display = 'block';
    
    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        (client.email && client.email.toLowerCase().includes(searchTerm)) ||
        (client.phone && client.phone.toLowerCase().includes(searchTerm)) ||
        (client.cuit && client.cuit.toLowerCase().includes(searchTerm))
    );

    renderFilteredClients(filteredClients);
}

function renderFilteredClients(filteredClients) {
    if (filteredClients.length === 0) {
        clientsTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem;">
                    <i class="fas fa-search" style="font-size: 2rem; color: #ccc;"></i>
                    <p style="margin-top: 1rem; color: #666;">No se encontraron clientes</p>
                </td>
            </tr>
        `;
        return;
    }

    clientsTableBody.innerHTML = filteredClients.map(client => `
        <tr>
            <td>${client.id}</td>
            <td><strong>${escapeHtml(client.name)}</strong></td>
            <td>${client.email ? escapeHtml(client.email) : '-'}</td>
            <td>${escapeHtml(client.phone)}</td>
            <td>${client.address ? escapeHtml(client.address) : '-'}</td>
            <td>${client.cuit ? escapeHtml(client.cuit) : '-'}</td>
            <td>
                <span class="status-badge ${client.status}">
                    ${client.status === 'activo' ? '✓ Activo' : '✕ Inactivo'}
                </span>
            </td>
            <td class="actions">
                <button class="btn-icon btn-edit" onclick="openModalForEdit(${client.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteClient(${client.id})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function clearFilters() {
    searchInput.value = '';
    btnClearFilters.style.display = 'none';
    renderClients();
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
