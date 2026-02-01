import './SideBar.css'

export const Sidebar = (activeItem = 'home') => {
    // Definición de los ítems del menú
    const menuItems = [
        { id: 'home', icon: 'ri-home-4-line', label: 'Inicio' },
        { id: 'dashboard', icon: 'ri-file-list-3-line', label: 'Facturas' },
        { id: 'clients', icon: 'ri-group-line', label: 'Clientes' },
        { id: 'config', icon: 'ri-settings-4-line', label: 'Configuración' },
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

            <div style="margin-top: auto;" >
                 <a href="#" class="sidebar-link" data-link="logout">
                    <i class="ri-logout-box-line"></i>
                    <span>Cerrar Sesión</span>
                </a>
            </div>
        </aside>
    `
}