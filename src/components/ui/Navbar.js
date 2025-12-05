import './Navbar.css'

export const Navbar = () => {
    return `
        <nav class="bottom-navbar">
            <a href="#" class="nav-item">
                <i class="ri-home-4-line"></i>
                <span>Inicio</span>
            </a>
            <a href="#" class="nav-item">
                <i class="ri-file-list-3-line"></i>
                <span>Facts</span>
            </a>
            
            <!-- Botón Central (Crear Factura) -->
            <a href="#" class="nav-fab" id="btn-create-invoice">
                <i class="ri-add-line"></i>
            </a>

            <!-- CAMBIO: Ahora es Productos -->
            <a href="#" class="nav-item">
                <i class="ri-box-3-line"></i>
                <span>Prods</span>
            </a>

            <!-- CAMBIO: Ahora es Clientes -->
            <a href="#" class="nav-item">
                <i class="ri-group-line"></i>
                <span>Clientes</span>
            </a>
        </nav>
    `
}