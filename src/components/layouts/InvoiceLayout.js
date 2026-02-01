import { GenerateInput } from "../ui/Input"
import { GenerateSelect } from "../ui/Select"
import { Sidebar } from "../ui/SideBar"
import { Navbar } from "../ui/Navbar"

export const InvoiceLayout = async () => { 
    const desktopSidebar = Sidebar('dashboard')
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`

    // --- 1. Cargar Clientes (Async) ---
    let clientOptions = [{ value: "", label: "Cargando clientes..." }];
    try {
        const response = await fetch('http://localhost:3000/api/clients');
        const allClients = await response.json();
        // Filter inactive
        const clients = allClients.filter(c => c.is_active !== 0);
        
        clientOptions = [
            { value: "", label: "Seleccionar Cliente..." },
            ...clients.map(c => ({
                value: c.client_id,
                label: c.client_name 
            }))
        ];
    } catch (error) {
        console.error("Error cargando clientes:", error);
        clientOptions = [{ value: "", label: "Error de conexión" }];
    }

    // --- 2. Preparar Inputs ---
    const clientSelectHTML = GenerateSelect("ri-building-line", "client", clientOptions);
    
    // Wrapper para el Select + Botón
    const clientSection = `
        <div class="flex gap-2 items-end">
            <div class="flex-1">${clientSelectHTML}</div>
            <button id="btn-quick-add-client" class="mb-[2px] h-[42px] px-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Nuevo Cliente Rápido">
                <i class="ri-add-line font-bold"></i>
            </button>
        </div>
    `;
    
    // Obtener fecha actual en formato YYYY-MM-DD para el input type="date"
    const today = new Date().toISOString().split('T')[0];
    
    // Generar inputs con 'today' como valor por defecto

    const dateDue = `
    <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Vencimiento</label>
        <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="ri-calendar-event-line text-gray-400"></i>
            </div>
            <input type="date" name="date_due" value="${today}" 
                class="pl-10 block w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all">
        </div>
    </div>`;

    // --- 3. HTML del Modal de Previsualización ---
    const previewModal = `
    <div id="preview-modal" class="fixed inset-0 z-1001 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
        <!-- Backdrop Oscuro -->
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" id="preview-backdrop"></div>
        
        <!-- Contenido Modal -->
        <div class="bg-gray-100 w-full h-full md:h-[90vh] md:w-[800px] md:rounded-xl relative z-10 flex flex-col overflow-hidden transform scale-95 transition-transform duration-300" id="preview-content">
            
            <!-- Barra Superior Modal -->
            <div class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md shrink-0">
                <div>
                    <h3 class="font-bold text-lg">Vista Previa</h3>
                    <p class="text-gray-400 text-xs">Revisa los datos antes de guardar</p>
                </div>
                <button id="btn-close-preview" class="hover:bg-gray-700 p-2 rounded-full transition-colors"><i class="ri-close-line text-xl"></i></button>
            </div>

            <!-- Cuerpo (Hoja de Papel) -->
            <div class="overflow-y-auto p-4 md:p-8 flex-1 bg-gray-500/10">
                <div class="bg-white shadow-2xl min-h-[800px] p-8 md:p-12 mx-auto max-w-2xl" id="invoice-paper">
                    
                    <!-- Encabezado del Documento -->
                    <div class="flex justify-between items-start border-b-2 border-gray-800 pb-8 mb-8">
                        <div>
                            <div class="text-3xl font-black text-blue-800 tracking-tight" id="paper-type">SUMINISTROS DEPOMED</div>
                            <div class="text-gray-500 font-medium text-xs mt-1">SUMINISTROS DEPOMED, C.A.</div>
                            <div class="text-gray-400 text-[10px] leading-tight mt-1">
                                RIF: J-50123456-7<br>
                                Av. Principal de los Ruices, Caracas.<br>
                                Telf: 0212-1234567
                            </div>
                        </div>
                        
                        <div class="text-right">
                             <div class="text-red-600 font-bold text-lg mb-1" id="paper-control-no">CONTROL: 00-00000</div>
                             <div class="text-gray-800 font-bold text-sm">Factura # <span id="paper-invoice-id">BORRADOR</span></div>
                             <div class="text-gray-500 text-xs mt-2" id="paper-date">-- de -- de ----</div>
                        </div>
                    </div>

                    <!-- Info Cliente -->
                    <div class="mb-8 p-4 bg-gray-50 border-l-4 border-gray-800">
                        <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CLIENTE:</h4>
                        <div class="text-gray-800 font-bold text-lg" id="paper-client">Seleccione un cliente</div>
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
                            <tbody id="paper-items-body" class="text-sm text-gray-700 divide-y divide-gray-100 italic"></tbody>
                        </table>
                    </div>

                    <!-- Totales Inferiores -->
                    <div class="flex justify-end">
                        <div class="w-1/2 space-y-1">
                            <div class="flex justify-between text-gray-500 text-xs px-2">
                                <span>Base Imponible Bs.</span>
                                <span id="paper-subtotal">$0.00</span>
                            </div>
                            
                            <div class="flex justify-between text-gray-500 text-xs px-2">
                                <span>I.V.A (16%)</span>
                                <span id="paper-tax">$0.00</span>
                            </div>
                            
                            <div class="flex justify-between text-base font-black text-gray-800 pt-3 border-t-2 border-gray-800 mt-2 px-2 bg-gray-50">
                                <span>TOTAL DOCUMENTO</span>
                                <span id="paper-total-bottom">$0.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Botones -->
            <div class="bg-white p-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
                <button id="btn-export-excel" class="px-6 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors flex items-center gap-2">
                    <i class="ri-file-excel-2-line"></i> Exportar Excel
                </button>
                <button id="btn-edit-mode" class="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Volver a Editar</button>
                <button id="btn-confirm-invoice" class="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all flex items-center gap-2">
                    <i class="ri-check-double-line"></i> <span id="btn-text-confirm">Confirmar y Emitir</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Modal Nuevo Cliente Rápido -->
    <div id="quick-client-modal" class="fixed inset-0 z-1005 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" id="quick-client-backdrop"></div>
        <div class="bg-white w-full max-w-md mx-4 rounded-xl shadow-2xl relative z-10 transform scale-95 transition-transform duration-300 p-6">
            <h3 class="font-bold text-lg mb-4 text-gray-800">Nuevo Cliente Rápido</h3>
            <form id="quick-client-form" class="space-y-4">
                <div>
                     <input type="text" name="quick_name" placeholder="Nombre / Razón Social" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100" required>
                </div>
                 <div>
                     <input type="text" name="quick_id" placeholder="Documento ID (DNI/NIT)" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100">
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" id="btn-cancel-quick" class="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Cancelar</button>
                    <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Guardar</button>
                </div>
            </form>
        </div>
    </div>
    `

    // --- 4. Renderizado Final ---
    return `
    <div class="layout-wrapper flex min-h-screen bg-gray-50">
        ${desktopSidebar}

        <main class="main-content flex-1 flex flex-col h-screen overflow-hidden relative md:ml-64 transition-all">
            
            <!-- Barra Superior -->
            <header class="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0 z-20">
                <div class="flex items-center gap-4">
                    <h1 class="text-xl font-bold text-gray-800">Crear Documento</h1>
                    <div class="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
                        <button id="btn-mode-invoice" class="px-4 py-1.5 rounded-md bg-white text-blue-600 shadow-sm transition-all active-mode-btn">Factura</button>
                        <button id="btn-mode-quote" class="px-4 py-1.5 rounded-md text-gray-500 hover:text-gray-700 transition-all">Cotización</button>
                    </div>
                </div>
                <div class="hidden md:block">
                    <button id="btn-open-preview" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-blue-500/20 shadow-lg flex items-center gap-2">
                        <i class="ri-eye-line"></i> Previsualizar
                    </button>
                </div>
            </header>

            <!-- Área de Scroll -->
            <div class="flex-1 overflow-y-auto p-4 md:p-8">
                <div class="max-w-5xl mx-auto space-y-6">
                    
                    <!-- Tarjeta 1: Datos Generales -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <i class="ri-information-line"></i> Información General
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="md:col-span-1">${clientSection}</div>
                            <!-- Los inputs ya vienen con valor 'today' -->
                            <div class="md:col-span-1">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Emisión</label>
                                <p class="text-gray-900 text-lg font-semibold">${today}</p>
                                <input type="hidden" name="date_issued" value="${today}">
                            </div>
                            <div class="md:col-span-1">${dateDue}</div>
                        </div>
                    </div>

                    <!-- Tarjeta 2: Conceptos -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                <i class="ri-list-check"></i> Conceptos
                            </h2>
                            <button id="btn-add-item" class="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1 transition-colors">
                                <i class="ri-add-circle-fill text-xl"></i> Agregar Ítem
                            </button>
                        </div>
                        
                        <div class="p-6">
                            <div id="items-container" class="space-y-3"></div>
                            
                            <!-- Sección Inferior (Totales) -->
                            <div class="flex justify-end mt-8 pt-4 border-t border-gray-100">
                                <div class="w-full md:w-1/3 space-y-2">
                                    
                                    <!-- Toggle IVA -->
                                    <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                                        <label for="tax-toggle" class="text-sm font-medium text-gray-600 cursor-pointer select-none">Aplicar IVA (16%)</label>
                                        <div class="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                            <input type="checkbox" name="toggle" id="tax-toggle" class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-blue-600"/>
                                            <label for="tax-toggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer checked:bg-blue-600"></label>
                                        </div>
                                    </div>

                                    <div class="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal:</span>
                                        <span id="form-subtotal" class="font-medium font-mono">$0.00</span>
                                    </div>
                                    <div class="flex justify-between text-gray-600 text-sm transition-all" id="form-tax-row">
                                        <span>Impuestos:</span>
                                        <span id="form-tax" class="font-medium font-mono">$0.00</span>
                                    </div>
                                    <div class="flex justify-between text-gray-900 text-xl font-bold pt-2 border-t border-gray-100 mt-2">
                                        <span>Total:</span>
                                        <span id="form-total" class="font-mono">$0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Espacio extra para scroll en móvil -->
                <div class="h-24 md:h-12"></div>
            </div>
            
            <!-- Botón Flotante Móvil -->
            <div class="md:hidden bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button id="btn-mobile-preview" class="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-lg shadow-lg active:scale-95 transition-transform">
                    Ver Previsualización
                </button>
            </div>
        </main>
        
        ${mobileNavbar}
        ${previewModal}
        
        <!-- CSS Específico para el Toggle -->
        <style>
            .toggle-checkbox:checked { right: 0; border-color: #2563EB; }
            .toggle-checkbox:checked + .toggle-label { background-color: #2563EB; }
            .toggle-checkbox { right: auto; left: 0; transition: all 0.2s ease-in-out; }
            .toggle-label { width: 100%; height: 1.25rem; background-color: #D1D5DB; }
        </style>
    </div>
    `
}