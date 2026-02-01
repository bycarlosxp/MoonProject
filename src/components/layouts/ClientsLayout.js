import { Sidebar } from '../ui/SideBar'
import { Navbar } from '../ui/Navbar'
import { GenerateButton } from '../ui/Button'
import '../ui/CrudTable.css'

export const ClientsLayout = async () => {
    const desktopSidebar = Sidebar('clients') 
    
    const mobileNavbar = `
        <div class="mobile-nav-container md:hidden fixed bottom-0 left-0 right-0 z-50 w-full bg-white border-t border-gray-200">
            ${Navbar()}
        </div>
    `
    
    const createBtn = `<button id="btn-open-modal" class="custom-button-primary rounded-lg px-6 py-2.5 font-medium shadow-blue-500/20 shadow-lg hover:shadow-blue-500/40 transition-all active:scale-95 text-sm w-full md:w-auto flex items-center justify-center gap-2"><i class="ri-add-line"></i> Nuevo Cliente</button>`
    
    // Modal HTML Structure
    const modalHTML = `
    <div id="client-modal" class="fixed inset-0 z-100 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" id="modal-backdrop"></div>
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 md:mx-0 relative z-10 transform scale-95 transition-transform duration-300 overflow-hidden max-h-[90vh] overflow-y-auto" id="modal-content">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-20 backdrop-blur-md">
                <h3 id="modal-title" class="text-lg font-bold text-gray-800">Nuevo Cliente</h3>
                <button id="btn-close-modal" class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                    <i class="ri-close-line text-xl"></i>
                </button>
            </div>

            <div class="p-6">
                <form id="client-form" class="space-y-5">
                    <input type="hidden" name="id" id="client-id-field">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Nombre / Razón Social</label>
                            <input name="client_name" type="text" required class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none" placeholder="Ej. Empresa S.A.">
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Documento ID</label>
                            <input name="client_document_id" type="text" required class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none" placeholder="RUC / DNI">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Teléfono</label>
                            <input name="client_phone" type="tel" required class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none" placeholder="+51 000 000">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Dirección</label>
                        <input name="client_address" type="text" class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm outline-none" placeholder="Dirección completa">
                    </div>

                    <div class="pt-4 flex gap-3">
                        <button type="button" id="btn-cancel-modal" class="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancelar</button>
                        <button type="submit" id="btn-save-client" class="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;

    // Inline Styles
    const styles = `
    <style>
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .modal-open { opacity: 1 !important; pointer-events: auto !important; }
        .modal-content-open { transform: scale(1) !important; }
    </style>
    `;

    return `
    ${styles}
    <div class="layout-wrapper flex min-h-screen bg-gray-50 animate-fade-in">
        ${desktopSidebar}
        
        <!-- CORRECCIÓN 2: Agregado 'md:ml-64' para dejar espacio a la sidebar y 'w-full' -->
        <main class="main-content flex-1 p-4 md:p-8 md:ml-64 transition-all w-full relative mb-16 md:mb-0">
            
            <!-- Top Bar -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Cartera de Clientes</h1>
                    <p class="text-gray-500 text-sm mt-1">Gestión de contactos</p>
                </div>
                
                <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto items-stretch md:items-center">
                    <div class="hidden md:flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all w-64">
                        <i class="ri-search-line text-gray-400 mr-2"></i>
                        <input id="client-search-desktop" type="text" placeholder="Buscar cliente..." class="bg-transparent border-none outline-none text-sm text-gray-700 w-full">
                    </div>
                    <div class="hidden-mobile md:block">${createBtn}</div>
                </div>
            </div>

            <!-- Mobile Controls -->
            <div class="mb-4 md:hidden flex gap-2">
                <div class="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center shadow-sm">
                    <i class="ri-search-line text-gray-400 mr-2"></i>
                    <input id="client-search-mobile" type="text" placeholder="Buscar..." class="w-full bg-transparent focus:outline-none text-sm">
                </div>
                <button id="mobile-add-btn" class="bg-blue-600 text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-lg active:scale-95"><i class="ri-add-line"></i></button>
            </div>

            <!-- Tabla -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden min-h-[400px]">
                <div id="clients-list" class="divide-y divide-gray-100">
                     <div class="flex items-center justify-center p-12">
                         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </div>

                <!-- Pagination Controls -->
                 <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                    <div class="flex-1 flex justify-between sm:hidden">
                        <button id="btn-prev-mobile" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Anterior</button>
                        <button id="btn-next-mobile" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Siguiente</button>
                    </div>
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700">
                                Mostrando <span class="font-medium" id="page-start">0</span> a <span class="font-medium" id="page-end">0</span> de <span class="font-medium" id="total-items">0</span> clientes
                            </p>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button id="btn-prev" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span class="sr-only">Anterior</span>
                                    <i class="ri-arrow-left-s-line text-lg"></i>
                                </button>
                                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700" id="page-indicator">
                                    Página 1
                                </span>
                                <button id="btn-next" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span class="sr-only">Siguiente</span>
                                    <i class="ri-arrow-right-s-line text-lg"></i>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        <!-- Mobile Navbar inyectada (ahora oculta en desktop) -->
        ${mobileNavbar}
        ${modalHTML}
    </div>
    `
}