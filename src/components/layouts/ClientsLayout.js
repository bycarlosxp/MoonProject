import { Sidebar } from '../ui/SideBar'
import { Navbar } from '../ui/Navbar'
import { GenerateButton } from '../ui/Button'
import '../ui/CrudTable.css'

export const ClientsLayout = () => {
    const desktopSidebar = Sidebar('clients') 
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`
    const createBtn = GenerateButton("+ Nuevo Cliente", "button", "primary")

    // Datos simulados
    const clients = [
        { name: 'Tech Solutions Inc.', contact: 'juan@tech.com', phone: '+58 412-555-001' },
        { name: 'Studio Design', contact: 'ana@studio.com', phone: '+58 424-555-002' },
        { name: 'Global Ventures', contact: 'info@global.com', phone: '+1 305-555-003' },
    ];

    const rows = clients.map(c => `
        <div class="crud-row">
            <div class="cell" data-label="Cliente">
                <div class="user-info">
                    <div class="user-avatar" style="background:#e8f4fd; color:#3498db;">${c.name.substring(0,2)}</div>
                    <span class="cell-content">${c.name}</span>
                </div>
            </div>
            <div class="cell" data-label="Contacto">
                <span class="cell-content">${c.contact}</span>
            </div>
            <div class="cell" data-label="Teléfono">
                <span class="cell-content">${c.phone}</span>
            </div>
            <div class="cell" data-label="Acciones">
                <div class="cell-content">
                    <button class="action-btn"><i class="ri-pencil-line"></i></button>
                    <button class="action-btn"><i class="ri-phone-line"></i></button>
                </div>
            </div>
        </div>
    `).join('');

    return `
    <div class="layout-wrapper">
        ${desktopSidebar}
        
        <main class="main-content">
            <div class="top-bar">
                <div>
                    <h1 class="page-title">Cartera de Clientes</h1>
                    <p style="color:#95a5a6; font-size:0.9rem; margin:0;">Gestión de contactos</p>
                </div>
                <div class="hidden-mobile" style="width: 160px">${createBtn}</div>
            </div>

            <!-- Mobile Controls -->
            <div class="mobile-controls">
                <div class="mobile-search-box">
                    <i class="ri-search-line" style="color:#95a5a6;"></i>
                    <input type="text" placeholder="Buscar cliente...">
                </div>
                <button class="mobile-filter-btn"><i class="ri-user-add-line"></i></button>
            </div>

            <div class="crud-container">
                <div class="table-wrapper">
                    ${rows}
                </div>
            </div>
        </main>
        
        ${mobileNavbar}
    </div>
    `
}