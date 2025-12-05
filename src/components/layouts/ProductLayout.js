import { Sidebar } from '../ui/SideBar'
import { Navbar } from '../ui/Navbar'
import { ProductList } from '../ui/ProductList'
import { ProductDrawer } from '../ui/ProductDrawer'
import { GenerateButton } from '../ui/Button'

export const ProductLayout = () => {
    const desktopSidebar = Sidebar('products')
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`
    const productList = ProductList()
    const drawer = ProductDrawer()
    const createBtn = GenerateButton("+ Agregar", "button", "primary")

    return `
    <div class="layout-wrapper">
        ${desktopSidebar}
        
        <main class="main-content">
            <!-- Top Bar similar al CrudLayout -->
            <div class="top-bar">
                <div>
                    <h1 class="page-title">Inventario</h1>
                    <p style="color:#95a5a6; font-size:0.9rem; margin:0;">Gestión de productos y servicios</p>
                </div>
                
                <div style="display:flex; gap:1rem; align-items:center;">
                    <div class="search-wrapper hidden-mobile">
                        <i class="ri-search-line" style="color:#95a5a6"></i>
                        <input type="text" class="search-input" placeholder="Buscar SKU, nombre...">
                    </div>
                    <div class="hidden-mobile" style="width: 140px" id="desktop-add-prod">
                        ${createBtn}
                    </div>
                </div>
            </div>

            <!-- Mobile Controls -->
            <div class="mobile-controls">
                <div class="mobile-search-box">
                    <i class="ri-search-line" style="color:#95a5a6;"></i>
                    <input type="text" placeholder="Buscar productos..." id="prod-search">
                </div>
                <button class="mobile-filter-btn" id="mobile-add-prod">
                    <i class="ri-add-line"></i>
                </button>
            </div>

            <!-- Product List -->
            ${productList}

        </main>
        
        <!-- Drawer Component (Hidden by default) -->
        ${drawer}

        ${mobileNavbar}
    </div>
    `
}