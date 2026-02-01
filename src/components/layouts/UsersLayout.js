import { Sidebar } from '../ui/SideBar.js'
import { Navbar } from '../ui/Navbar.js'
import { GenerateInput } from '../ui/Input.js'

export const UsersLayout = async () => {
    const desktopSidebar = Sidebar('users')
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`

    // Verificar si el usuario es admin
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
        return `
        <div class="layout-wrapper flex min-h-screen bg-gray-50 animate-fade-in">
            ${desktopSidebar}
            <main class="main-content flex-1 p-4 md:p-8 md:ml-64 transition-all flex justify-center items-center mb-16 md:mb-0">
                <div class="text-center">
                    <i class="ri-lock-line text-6xl text-red-400 mb-4"></i>
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
                    <p class="text-gray-500">Solo los administradores pueden acceder a esta sección.</p>
                    <a href="#" data-link="home" class="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        Volver al Inicio
                    </a>
                </div>
            </main>
            ${mobileNavbar}
        </div>
        `;
    }

    // Cargar usuarios existentes
    let users = [];
    try {
        const res = await fetch('http://localhost:2020/get_users');
        if (res.ok) {
            users = await res.json();
        }
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }

    const usernameInput = GenerateInput("ri-user-line", "Nombre de usuario", "text", "username", "")
    const passwordInput = GenerateInput("ri-lock-line", "Contraseña", "password", "password", "")
    const emailInput = GenerateInput("ri-mail-line", "Email", "email", "email", "")

    return `
    <div class="layout-wrapper flex min-h-screen bg-gray-50 animate-fade-in">
        ${desktopSidebar}
        
        <main class="main-content flex-1 p-4 md:p-8 md:ml-64 transition-all mb-16 md:mb-0">
            <div class="w-full max-w-4xl mx-auto">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
                    <p class="text-gray-500 text-sm mt-1">Crear y administrar usuarios del sistema</p>
                </div>

                <!-- Card Crear Usuario -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="font-bold text-gray-700 flex items-center gap-2">
                            <i class="ri-user-add-line text-[#6b5674]"></i> Crear Nuevo Usuario
                        </h2>
                    </div>
                    
                    <div class="p-6">
                        <form id="create-user-form" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${usernameInput}
                                ${emailInput}
                            </div>
                            ${passwordInput}
                            
                            <div class="flex items-center gap-4">
                                <label class="text-sm font-medium text-gray-700">Tipo de Usuario:</label>
                                <select name="user_type" class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#6b5674]">
                                    <option value="user">Usuario Normal</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            
                            <button type="submit" id="btn-create-user" class="w-full bg-[#6b5674] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2">
                                <i class="ri-user-add-line"></i> Crear Usuario
                            </button>
                        </form>
                    </div>
                </div>

               
            </div>
        </main>
        
        ${mobileNavbar}
    </div>
    `
}
