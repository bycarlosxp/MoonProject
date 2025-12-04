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
    <a href="#" class="nav-fab" id="btn-create-invoice">
        <i class="ri-add-line"></i>
    </a>

    <a href="#" class="nav-item active">
        <i class="ri-wallet-3-line"></i>
        <span>Crear</span>
    </a>
    <a href="#" class="nav-item">
        <i class="ri-user-3-line"></i>
        <span>Perfil</span>
    </a>
</nav>
`
}