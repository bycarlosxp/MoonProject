import './CrudTable.css'

// Datos simulados para la tabla
const mockData = [
    { id: '#45671', client: 'Yefren Sanchez', amount: '$1,200.00', date: 'Oct 24, 2023', status: 'paid' },
    { id: '#45672', client: 'Carlos Silva', amount: '$350.50', date: 'Oct 23, 2023', status: 'pending' },
    { id: '#45673', client: 'Luis Hernandez', amount: '$5,000.00', date: 'Oct 22, 2023', status: 'cancelled' },
    { id: '#45674', client: 'Gabriel Gomez', amount: '$950.00', date: 'Oct 21, 2023', status: 'paid' },
    { id: '#45675', client: 'Maria Malave', amount: '$120.00', date: 'Oct 20, 2023', status: 'pending' },
    { id: '#45676', client: 'Safir Flores', amount: '$2,400.00', date: 'Oct 19, 2023', status: 'paid' },
]

// Función para obtener el badge de estado
const getStatusBadge = (status) => {
    const map = {
        paid: '<span class="status-badge status-paid">Pagado</span>',
        pending: '<span class="status-badge status-pending">Pendiente</span>',
        cancelled: '<span class="status-badge status-cancelled">Cancelado</span>'
    }
    return map[status] || status
}

// Función para obtener las iniciales del cliente
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0,2)

// Componente CrudTable
export const CrudTable = () => {
    const rows = mockData.map((row, index) => {
        // Calculamos un retraso pequeño (ej: 0.1s, 0.2s, 0.3s...)
        // Topamos el delay en 10 items para que si hay 100 no tarde una eternidad
        const delay = Math.min(index * 0.08, 1) + 's';

        return `
        <div class="crud-row animate-row-enter" style="animation-delay: ${delay}">
            <div class="cell" data-label="ID Factura">
                <span class="cell-content" style="font-weight:bold; color:#6b5674;">${row.id}</span>
            </div>
            <div class="cell" data-label="Cliente">
                <div class="user-info">
                    <div class="user-avatar">${getInitials(row.client)}</div>
                    <span class="cell-content">${row.client}</span>
                </div>
            </div>
            <!-- ... resto de celdas igual ... -->
            <div class="cell" data-label="Fecha">
                <span class="cell-content">${row.date}</span>
            </div>
            <div class="cell" data-label="Monto">
                <span class="cell-content">${row.amount}</span>
            </div>
            <div class="cell" data-label="Estado">
                <div class="cell-content">${getStatusBadge(row.status)}</div>
            </div>
            <div class="cell" data-label="Acciones">
                <div class="cell-content">
                    <button class="action-btn"><i class="ri-pencil-line"></i></button>
                    <button class="action-btn"><i class="ri-delete-bin-line"></i></button>
                </div>
            </div>
        </div>
    `}).join('')

    return `
        <div class="crud-container">
            <div class="crud-header">
                <div class="crud-title">Facturas Recientes</div>
                <div class="crud-actions">
                     <div class="filter-btn" style="padding: 0.5rem; background:#f5f5f5; border-radius:0.5rem; cursor:pointer;">
                        <i class="ri-filter-3-line"></i>
                     </div>
                </div>
            </div>
            
            <div class="table-wrapper">
                <!-- Desktop Header -->
                <div class="table-head">
                    <span>ID</span>
                    <span>Cliente</span>
                    <span>Fecha</span>
                    <span>Monto</span>
                    <span>Estado</span>
                    <span></span>
                </div>
                
                <!-- Rows -->
                ${rows}
            </div>
        </div>
    `
}