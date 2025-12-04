import './CrudTable.css'

const mockData = [
    { id: '#45671', client: 'Joe Martin', amount: '$1,200.00', date: 'Oct 24, 2023', status: 'paid' },
    { id: '#45672', client: 'Sarah Connor', amount: '$350.50', date: 'Oct 23, 2023', status: 'pending' },
    { id: '#45673', client: 'Bruce Wayne', amount: '$5,000.00', date: 'Oct 22, 2023', status: 'cancelled' },
    { id: '#45674', client: 'Diana Prince', amount: '$950.00', date: 'Oct 21, 2023', status: 'paid' },
    { id: '#45675', client: 'Clark Kent', amount: '$120.00', date: 'Oct 20, 2023', status: 'pending' },
    { id: '#45676', client: 'Barry Allen', amount: '$2,400.00', date: 'Oct 19, 2023', status: 'paid' },
]

const getStatusBadge = (status) => {
    const map = {
        paid: '<span class="status-badge status-paid">Pagado</span>',
        pending: '<span class="status-badge status-pending">Pendiente</span>',
        cancelled: '<span class="status-badge status-cancelled">Cancelado</span>'
    }
    return map[status] || status
}

const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0,2)

export const CrudTable = () => {
    const rows = mockData.map(row => `
        <div class="crud-row">
            <div class="cell" data-label="ID Factura">
                <span class="cell-content" style="font-weight:bold; color:#6b5674;">${row.id}</span>
            </div>
            <div class="cell" data-label="Cliente">
                <div class="user-info">
                    <div class="user-avatar">${getInitials(row.client)}</div>
                    <span class="cell-content">${row.client}</span>
                </div>
            </div>
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
    `).join('')

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