import { Sidebar } from '../ui/SideBar'
import { Navbar } from '../ui/Navbar'
import { GenerateInput } from '../ui/Input'
import { GenerateButton } from '../ui/Button'

export const ProfileLayout = () => {
    const desktopSidebar = Sidebar('config')
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`

    // Inputs
    const companyName = GenerateInput("ri-building-2-line", "Nombre de Empresa / Razón Social", "text", "company_name", localStorage.getItem("config_company_name") || "")
    const companyId = GenerateInput("ri-passport-line", "RIF / NIT / DNI", "text", "company_id", localStorage.getItem("config_company_id") || "")
    const companyAddress = GenerateInput("ri-map-pin-line", "Dirección Fiscal", "text", "company_address", localStorage.getItem("config_company_address") || "")
    const companyLogo = GenerateInput("ri-image-line", "URL del Logo", "text", "company_logo", localStorage.getItem("config_company_logo") || "")
    
    // Save Button
    const saveBtn = `<button id="btn-save-config" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
        <i class="ri-save-line"></i> Guardar Configuración
    </button>`

    return `
    <div class="layout-wrapper flex min-h-screen bg-gray-50 animate-fade-in">
        ${desktopSidebar}
        
        <main class="main-content flex-1 p-4 md:p-8 md:ml-64 transition-all flex justify-center items-start">
            <div class="w-full max-w-2xl">
                <!-- Header -->
                <div class="mb-8">
                    <h1 class="text-2xl font-bold text-gray-800">Configuración</h1>
                    <p class="text-gray-500 text-sm mt-1">Datos de la empresa y preferencias</p>
                </div>

                <!-- Card -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="font-bold text-gray-700 flex items-center gap-2">
                            <i class="ri-settings-3-line text-blue-500"></i> Datos del Emisor
                        </h2>
                    </div>
                    
                    <div class="p-6 space-y-6">
                        <form id="config-form" class="space-y-4">
                            ${companyName}
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${companyId}
                                ${companyLogo}
                            </div>
                            ${companyAddress}
                            
                            <div class="pt-4">
                                ${saveBtn}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
        
        ${mobileNavbar}
    </div>
    `
}
