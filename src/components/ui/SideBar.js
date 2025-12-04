import './SideBar.css'

export const Sidebar = (activeItem = 'invoices') => {
    const menuItems = [
        { id: 'dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
        { id: 'analytics', icon: 'ri-bar-chart-line', label: 'Analytics' },
        { id: 'invoices', icon: 'ri-file-list-3-line', label: 'Facturas' },
        { id: 'clients', icon: 'ri-user-smile-line', label: 'Clientes' },
        { id: 'wallet', icon: 'ri-wallet-3-line', label: 'Billetera' },
        { id: 'settings', icon: 'ri-settings-4-line', label: 'Configuración' },
    ]

    const renderLinks = menuItems.map(item => `
        <a href="#" class="sidebar-link ${item.id === activeItem ? 'active' : ''}" data-link="${item.id}">
            <i class="${item.icon}"></i>
            <span>${item.label}</span>
        </a>
    `).join('')

    return `
        <aside class="sidebar">
            <div class="sidebar-logo">
                <i class="ri-moon-fill"></i>
                <span>MoonProject</span>
            </div>
            <nav class="sidebar-menu">
                ${renderLinks}
            </nav>
            
            <div style="margin-top: auto;">
                 <a href="#" class="sidebar-link">
                    <i class="ri-logout-box-line"></i>
                    <span>Cerrar Sesión</span>
                </a>
            </div>
        </aside>
    `
}