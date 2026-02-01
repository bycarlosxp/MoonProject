import './Navbar.css'

export const Navbar = () => {
    return `
        <nav class="bottom-navbar">
            <a href="#" class="nav-item sidebar-link" data-link="home">
                <i class="ri-home-4-line"></i>
                <span>Inicio</span>
            </a>
            <a href="#" class="nav-item sidebar-link" data-link="dashboard">
                <i class="ri-file-list-3-line"></i>
                <span>Facturas</span>
            </a>
            
            <!-- Botón Central (Crear Factura) -->
            <a href="#" class="nav-fab sidebar-link" data-link="create" id="btn-create-invoice">
                <i class="ri-add-line"></i>
            </a>

            <a href="#" class="nav-item sidebar-link" data-link="clients">
                <i class="ri-group-line"></i>
                <span>Clientes</span>
            </a>
            
            <a href="#" class="nav-item sidebar-link" data-link="config">
                <i class="ri-settings-4-line"></i>
                <span>Config</span>
            </a>
        </nav>
    `
}