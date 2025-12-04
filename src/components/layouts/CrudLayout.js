import './CrudLayout.css'
import { Sidebar } from '../ui/SideBar'
import { CrudTable } from '../ui/CrudTable'
import { Navbar } from '../ui/Navbar'
import { GenerateButton } from '../ui/Button'

export const CrudLayout = () => {
    // Reutilizamos el Navbar para Mobile
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`
    
    // Sidebar para Desktop
    const desktopSidebar = Sidebar('invoices')
    
    const crudTable = CrudTable()
    
    // Botón para crear (visible en desktop header)
    const createButton = GenerateButton("+ Nueva Factura", "button", "primary")

    return `
        <div class="layout-wrapper">
            ${desktopSidebar}
            
            <main class="main-content">
                <div class="top-bar">
                    <div>
                        <h1 class="page-title">Gestión de Facturas</h1>
                        <p style="color:#95a5a6; font-size:0.9rem; margin:0;">Bienvenido, Usuario</p>
                    </div>
                    
                    <div style="display:flex; gap:1rem; align-items:center;">
                        <div class="search-wrapper">
                            <i class="ri-search-line" style="color:#95a5a6"></i>
                            <input type="text" class="search-input" placeholder="Buscar factura, cliente...">
                        </div>
                        <div class="hidden-mobile" style="width: 180px" id="desktop-create-btn">
                            ${createButton}
                        </div>
                    </div>
                </div>

                ${crudTable}
            </main>
            
            ${mobileNavbar}
        </div>
    `
}