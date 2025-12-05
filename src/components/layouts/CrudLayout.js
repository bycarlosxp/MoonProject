import './CrudLayout.css'
import { Sidebar } from '../ui/SideBar'
import { CrudTable } from '../ui/CrudTable'
import { Navbar } from '../ui/Navbar'
import { GenerateButton } from '../ui/Button'

export const CrudLayout = () => {
    // Mobile Navbar
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`
    
    // Sidebar Desktop (marcado como activo 'invoices')
    const desktopSidebar = Sidebar('invoices')
    
    const crudTable = CrudTable()
    const createButton = GenerateButton("+ Nueva Factura", "button", "primary")

    return `
        <div class="layout-wrapper">
            ${desktopSidebar}
            
            <main class="main-content">
                <!-- Desktop Top Bar -->
                <div class="top-bar">
                    <div>
                        <h1 class="page-title">Gestión de Facturas</h1>
                        <p style="color:#95a5a6; font-size:0.9rem; margin:0;">Historial de pagos</p>
                    </div>
                    
                    <div style="display:flex; gap:1rem; align-items:center;">
                        <div class="search-wrapper hidden-mobile">
                            <i class="ri-search-line" style="color:#95a5a6"></i>
                            <input type="text" class="search-input" placeholder="Buscar factura, cliente...">
                        </div>
                        <div class="hidden-mobile" style="width: 180px" id="desktop-create-btn">
                            ${createButton}
                        </div>
                    </div>
                </div>

                <div class="mobile-controls">
                    <div class="mobile-search-box">
                        <i class="ri-search-line" style="color:#95a5a6;"></i>
                        <input type="text" placeholder="Buscar cliente..." id="mobile-search-input">
                    </div>
                    <button class="mobile-filter-btn">
                        <i class="ri-filter-3-line"></i>
                    </button>
                </div>

                ${crudTable}
            </main>
            
            ${mobileNavbar}
        </div>
    `
}