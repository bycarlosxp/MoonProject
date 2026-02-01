import { Sidebar } from '../ui/SideBar.js'
import { Navbar } from '../ui/Navbar.js'
import { GenerateInput } from '../ui/Input.js'

export const ProfileLayout = async () => {
    const desktopSidebar = Sidebar('config')
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`

    // Obtener datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userName = userData.full_name || 'Usuario';
    const userEmail = userData.email || '';

    // Inputs para cambio de contraseña
    const currentPassword = GenerateInput("ri-lock-line", "Contraseña Actual", "password", "current_password", "")
    const newPassword = GenerateInput("ri-lock-password-line", "Nueva Contraseña", "password", "new_password", "")
    const confirmPassword = GenerateInput("ri-lock-password-line", "Confirmar Nueva Contraseña", "password", "confirm_password", "")

    return `
    <div class="layout-wrapper flex min-h-screen bg-gray-50 animate-fade-in">
        ${desktopSidebar}
        
        <main class="main-content flex-1 p-4 md:p-8 md:ml-64 transition-all flex justify-center items-start mb-16 md:mb-0">
            <div class="w-full max-w-6xl">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-800">Configuración de Cuenta</h1>
                    <p class="text-gray-500 text-sm mt-1">Administra tu perfil y seguridad</p>
                </div>

                <!-- Grid de 2 columnas en desktop -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <!-- Card Información Personal -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 class="font-bold text-gray-700 flex items-center gap-2">
                                <i class="ri-user-line text-blue-500"></i> Información Personal
                            </h2>
                        </div>
                        
                        <div class="p-6 space-y-4">
                            <div>
                                <label class="text-sm font-medium text-gray-600">Nombre</label>
                                <p class="text-lg font-semibold text-gray-800 mt-1">${userName}</p>
                            </div>
                            <div>
                                <label class="text-sm font-medium text-gray-600">Email</label>
                                <p class="text-lg font-semibold text-gray-800 mt-1">${userEmail}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Card Cambiar Contraseña -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 class="font-bold text-gray-700 flex items-center gap-2">
                                <i class="ri-lock-password-line text-[#6b5674]"></i> Cambiar Contraseña
                            </h2>
                        </div>
                        
                        <div class="p-6">
                            <form id="password-form" class="space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    ${currentPassword}
                                    ${newPassword}
                                </div>
                                ${confirmPassword}
                                
                                <div class="pt-4">
                                    <button type="submit" id="btn-change-password" class="w-full bg-[#6b5674] text-white font-bold py-3 rounded-lg shadow-lg hover:opacity-90 transition-colors flex justify-center items-center gap-2">
                                        <i class="ri-lock-unlock-line"></i> Cambiar Contraseña
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Información adicional -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="flex gap-3">
                        <i class="ri-information-line text-blue-600 text-xl"></i>
                        <div>
                            <h3 class="font-semibold text-blue-900 text-sm">Seguridad de tu cuenta</h3>
                            <p class="text-blue-700 text-xs mt-1">Usa una contraseña segura con al menos 8 caracteres, incluyendo letras y números.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        ${mobileNavbar}
    </div>
    `
}
