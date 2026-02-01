import { Sidebar } from '../ui/SideBar'
import { Navbar } from '../ui/Navbar'

import '../ui/CrudTable.css'

export const CrudLayout = async () => {
    const desktopSidebar = Sidebar('dashboard') // 'dashboard' activo en sidebar
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`

    // Botón para crear factura
    const createBtn = `<button id="desktop-create-btn" class="custom-button-primary bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium shadow-lg hover:bg-blue-700 transition-all active:scale-95 text-sm flex items-center gap-2">
        <i class="ri-add-line"></i> Nueva Factura
    </button>`


    return `
    <div class="layout-wrapper flex min-h-screen bg-gray-50 animate-fade-in">
        ${desktopSidebar}
        
        <main class="main-content flex-1 p-4 md:p-8 md:ml-64 transition-all overflow-x-hidden">
            <!-- Header Sección -->
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Facturación</h1>
                    <p class="text-gray-500 text-sm mt-1">Gestión de comprobantes emitidos</p>
                </div>
                
                <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto items-stretch md:items-center">
                   <!-- Search Desktop -->
                    <div class="hidden md:flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2.5 shadow-sm w-64 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <i class="ri-search-line text-gray-400 mr-2"></i>
                        <input id="desktop-search-input" type="text" placeholder="Buscar factura..." class="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400">
                    </div>
                   <div class="hidden-mobile w-auto" >${createBtn}</div>
                </div>
            </div>

            <!-- Mobile Controls -->
            <div class="mb-4 md:hidden flex gap-2">
                <div class="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 flex items-center shadow-sm">
                    <i class="ri-search-line text-gray-400 mr-2"></i>
                    <input id="mobile-search-input" type="text" placeholder="Buscar..." class="w-full bg-transparent focus:outline-none text-sm">
                </div>
                <button id="mobile-create-btn" class="bg-blue-600 text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-lg active:scale-95 transition-transform"><i class="ri-add-line"></i></button>
            </div>

            <!-- Tabla Container -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <!-- Header Columnas (Solo Desktop) -->
                <div class="hidden md:grid grid-cols-6 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <div class="col-span-1">Documento</div>
                    <div class="col-span-1">Cliente</div>
                    <div class="col-span-1">Emisión</div>
                    <div class="col-span-1">Estado</div>
                    <div class="col-span-1">Total</div>
                    <div class="col-span-1 text-right">Acciones</div>
                </div>

                <div class="divide-y divide-gray-100" id="invoices-list">
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
                                Mostrando <span class="font-medium" id="page-start">1</span> a <span class="font-medium" id="page-end">10</span> de <span class="font-medium" id="total-items">0</span> resultados
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
        
        ${mobileNavbar}
    </div>
    </div>

    <!-- Modal de Detalles (Vista Previa Estilo Excel) -->
    <div id="invoice-modal" class="fixed inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" id="modal-backdrop-invoice"></div>
        <div class="bg-white w-full max-w-2xl mx-4 rounded-xl shadow-2xl relative z-10 transform scale-95 transition-transform duration-300 overflow-hidden flex flex-col max-h-[95vh]">
            
            <!-- Header Modal -->
            <div class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md shrink-0">
                <div>
                    <h3 class="font-bold text-lg">Detalles del Documento</h3>
                    <p class="text-gray-400 text-xs text-uppercase" id="modal-doc-type-title">Factura Digital</p>
                </div>
                <button id="btn-close-invoice-modal" class="hover:bg-gray-700 p-2 rounded-full transition-colors"><i class="ri-close-line text-xl"></i></button>
            </div>

            <!-- Cuerpo (Hoja de Papel) -->
            <div class="overflow-y-auto p-4 md:p-8 flex-1 bg-gray-100">
                <div class="bg-white shadow-xl p-8 md:p-12 mx-auto w-full border border-gray-200" id="invoice-paper">
                    
                    <!-- Encabezado del Documento -->
                    <div class="flex justify-between items-start border-b-2 border-gray-800 pb-8 mb-8">
                        <div>
                            <div class="text-3xl font-black text-blue-800 tracking-tight">SUMINISTROS DEPOMED</div>
                            <div class="text-gray-500 font-medium text-xs mt-1">SUMINISTROS DEPOMED, C.A.</div>
                            <div class="text-gray-400 text-[10px] leading-tight mt-1">
                                RIF: J-50123456-7<br>
                                Av. Principal de los Ruices, Caracas.<br>
                                Telf: 0212-1234567
                            </div>
                        </div>
                        
                        <div class="text-right">
                             <div class="text-red-600 font-bold text-lg mb-1" id="modal-control-no">CONTROL: 00-00000</div>
                             <div class="text-gray-800 font-bold text-sm">Factura # <span id="modal-invoice-id-display">0000</span></div>
                             <div class="text-gray-500 text-xs mt-2" id="modal-invoice-date-display">-- de -- de ----</div>
                        </div>
                    </div>

                    <!-- Info Cliente -->
                    <div class="mb-8 p-4 bg-gray-50 border-l-4 border-gray-800">
                        <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CLIENTE:</h4>
                        <div class="text-gray-800 font-bold text-lg" id="modal-client-name">Seleccione un cliente</div>
                    </div>

                    <!-- Tabla de Items -->
                    <div class="border border-gray-200 rounded-lg overflow-hidden mb-8">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-gray-800 text-white text-[10px] font-bold uppercase">
                                    <th class="py-3 pl-4 text-left">Cantidad</th>
                                    <th class="py-3 text-left">Ref</th>
                                    <th class="py-3 text-left">Descripción</th>
                                    <th class="py-3 text-right">Precio Unit.</th>
                                    <th class="py-3 text-right pr-4">Total</th>
                                </tr>
                            </thead>
                            <tbody id="modal-items-list" class="text-sm text-gray-700 divide-y divide-gray-100 italic">
                                <!-- JS Injected -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Totales Inferiores -->
                    <div class="flex justify-end">
                        <div class="w-1/2 space-y-1">
                            <div class="flex justify-between text-gray-500 text-xs px-2">
                                <span>Base Imponible Bs.</span>
                                <span id="modal-subtotal">$0.00</span>
                            </div>
                            
                            <div class="flex justify-between text-gray-500 text-xs px-2">
                                <span>I.V.A (16%)</span>
                                <span id="modal-tax">$0.00</span>
                            </div>
                            
                            <div class="flex justify-between text-base font-black text-gray-800 pt-3 border-t-2 border-gray-800 mt-2 px-2 bg-gray-50">
                                <span>TOTAL DOCUMENTO</span>
                                <span id="modal-invoice-total">$0.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer con Acciones -->
            <div class="bg-white p-4 border-t border-gray-200 flex flex-wrap gap-3 justify-between items-center shrink-0">
                <div class="flex gap-2">
                    <button id="btn-status-void" class="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100 uppercase tracking-wider">
                        Anular
                    </button>
                    <button id="btn-status-paid" class="px-4 py-2 text-xs font-bold text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-100 uppercase tracking-wider">
                        Marcar Pagada
                    </button>
                </div>

                <button id="btn-export-excel-crud" class="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 text-sm">
                    <i class="ri-file-excel-2-line"></i> Descargar Excel
                </button>
                <button id="btn-export-pdf-crud" class="px-6 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 text-sm">
                    <i class="ri-file-pdf-line"></i> Descargar PDF
                </button>
            </div>
        </div>
    </div>
    `
}