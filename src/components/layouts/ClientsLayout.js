import { Sidebar } from '../ui/SideBar'
import { Navbar } from '../ui/Navbar'
import { GenerateButton } from '../ui/Button'
import '../ui/CrudTable.css'

export const ClientsLayout = async () => {
    const desktopSidebar = Sidebar('clients') 
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`
    
    // Botón crear
    const createBtn = `<button id="btn-open-modal" class="custom-button-primary rounded-lg px-6 py-2.5 font-medium shadow-blue-500/20 shadow-lg hover:shadow-blue-500/40 transition-all active:scale-95 text-sm w-full md:w-auto">+ Nuevo Cliente</button>`
    
    let clients = []
    
    try {
        const response = await fetch('http://localhost:3000/api/clients')
        clients = await response.json()
    } catch (e) {
        console.error("Error fetching clients", e)
    }

    // MAPEO DE FILAS: Nota el atributo data-client en el botón de editar
    const rows = clients?.map(c => {
        // Safe encode para el JSON en el atributo HTML
        const clientJson = JSON.stringify(c).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        
        return `
        <div class="crud-row animate-slide-up hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
            <div class="cell py-4" data-label="Cliente">
                <div class="user-info flex items-center gap-3">
                    <div class="user-avatar w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style="background:#e8f4fd; color:#3498db;">
                        ${c?.client_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div class="flex flex-col">
                        <span class="cell-content client-name-text font-medium text-gray-800">${c?.client_name}</span>
                        <span class="text-xs text-gray-400 md:hidden">${c?.client_document_id}</span>
                    </div>
                </div>
            </div>
            <div class="cell pl-6 hidden md:flex items-center" data-label="Teléfono">
                <span class="cell-content client-phone-text text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">${c?.client_phone}</span>
            </div>
            <div class="cell hidden md:flex items-center" data-label="Dirección">
                <span class="cell-content text-gray-500 text-sm truncate max-w-[200px]" title="${c?.client_address}">${c?.client_address}</span>
            </div>
            <div class="cell" data-label="Acciones">
                <div class="cell-content flex justify-end gap-2">
                    <!-- Botón EDITAR con data-client -->
                    <button class="btn-edit-client action-btn w-8 h-8 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" 
                            data-client="${clientJson}">
                        <i class="ri-pencil-line"></i>
                    </button>
                    <!-- Botón BORRAR (Opcional) -->
                    <button class="action-btn w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <i class="ri-delete-bin-6-line"></i>
                    </button>
                </div>
            </div>
        </div>
        `
    }).join('');

    // Modal HTML Structure
    const modalHTML = `
    <div id="client-modal" class="fixed inset-0 z-100 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" id="modal-backdrop"></div>
        
        <!-- Modal Content -->
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-0 relative z-10 transform scale-95 transition-transform duration-300 overflow-hidden" id="modal-content">
            
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 id="modal-title" class="text-lg font-bold text-gray-800">Nuevo Cliente</h3>
                <button id="btn-close-modal" class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                    <i class="ri-close-line text-xl"></i>
                </button>
            </div>

            <!-- Form -->
            <div class="p-6">
                <form id="client-form" class="space-y-5">
                    <!-- ID Hidden Field para Edición -->
                    <input type="hidden" name="id" id="client-id-field">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="col-span-1 md:col-span-2">
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Nombre o Razón Social</label>
                            <input name="client_name" type="text" required class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" placeholder="Ej. Tech Solutions S.A.">
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Documento ID / RUC</label>
                            <input name="client_document_id" type="text" required class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" placeholder="Ej. 20123456789">
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Teléfono</label>
                            <input name="client_phone" type="tel" required class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" placeholder="Ej. +51 999 000 000">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Dirección / Correo</label>
                        <input name="client_address" type="text" class="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" placeholder="Ej. Av. Principal 123">
                    </div>

                    <div class="pt-2 flex gap-3">
                        <button type="button" id="btn-cancel-modal" class="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-800 transition-colors">Cancelar</button>
                        <button type="submit" id="btn-save-client" class="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 flex justify-center items-center gap-2">
                            <span>Guardar Cliente</span>
                        </button>
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
        .animate-slide-up { animation: slideUp 0.5s ease-out forwards; opacity: 0; animation-delay: 0.1s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .modal-open { opacity: 1 !important; pointer-events: auto !important; }
        .modal-content-open { transform: scale(1) !important; }
    </style>
    `;

    return `
    ${styles}
    <div class="layout-wrapper animate-fade-in flex bg-gray-50 min-h-screen">
        ${desktopSidebar}
        
        <main class="main-content relative flex-1 p-4 md:p-8 overflow-y-auto h-screen">
            <!-- Top Bar Mejorado -->
            <div class="top-bar flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 class="page-title text-2xl font-bold text-gray-800 tracking-tight">Cartera de Clientes</h1>
                    <p class="text-gray-500 text-sm mt-1">Administra tus contactos comerciales</p>
                </div>
                
                <!-- Search y Create Wrapper -->
                <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto items-stretch md:items-center">
                    <!-- Desktop Search Bar (Hidden on Mobile) -->
                    <div class="hidden md:flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all w-64 lg:w-80">
                        <i class="ri-search-line text-gray-400 mr-2"></i>
                        <input id="client-search-desktop" type="text" placeholder="Buscar cliente..." class="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400">
                    </div>

                    <div class="hidden-mobile md:block">
                        ${createBtn}
                    </div>
                </div>
            </div>

            <!-- Mobile Search Bar (Visible only on Mobile) -->
            <div class="mobile-controls mb-4 md:hidden flex gap-2">
                <div class="mobile-search-box flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center">
                    <i class="ri-search-line text-gray-400 mr-2"></i>
                    <input id="client-search-mobile" type="text" placeholder="Buscar..." class="w-full bg-transparent focus:outline-none text-sm">
                </div>
                <button id="mobile-add-btn" class="bg-blue-600 text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-transform"><i class="ri-add-line"></i></button>
            </div>

            <div class="crud-container bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
                <div class="table-wrapper" id="clients-table-body">
                    ${rows.length > 0 ? rows : '<div class="flex flex-col items-center justify-center p-12 text-center"><div class="bg-gray-50 p-4 rounded-full mb-3"><i class="ri-user-line text-3xl text-gray-300"></i></div><p class="text-gray-500 font-medium">No hay clientes registrados</p></div>'}
                </div>
            </div>
        </main>
        
        ${mobileNavbar}
        ${modalHTML}
    </div>
    `
}