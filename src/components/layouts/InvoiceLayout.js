import { GenerateInput } from "../ui/Input"
import { GenerateSelect } from "../ui/Select"
import { Sidebar } from "../ui/SideBar"
import { Navbar } from "../ui/Navbar"

export const InvoiceLayout = async () => { 
    const desktopSidebar = Sidebar('invoices')
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`

    // --- Cargar Clientes Dinámicamente ---
    let clientOptions = [{ value: "", label: "Cargando clientes..." }];
    try {

        const response = await fetch('http://localhost:3000/api/clients');
        const clients = await response.json();
        
       // Mapear los clientes a las opciones del select
        clientOptions = [
            { value: "", label: "Seleccionar Cliente..." },
            ...clients.map(c => ({
                value: c.client_id, // El ID que irá a la BD
                label: c.client_name // Lo que ve el usuario
            }))
        ];
    } catch (error) {
        console.error("Error cargando clientes:", error);
        clientOptions = [{ value: "", label: "Error al cargar clientes" }];
    }

    // --- Inputs Superiores ---
    // Usamos las opciones dinámicas
    const clientSelect = GenerateSelect("ri-building-line", "client", clientOptions);
    
    // Fechas (con valores por defecto hoy)
    const today = new Date().toISOString().split('T')[0];
    const dateIssued = GenerateInput("ri-calendar-check-line", "Emisión", "date", "date_issued", today);
    const dateDue = GenerateInput("ri-calendar-event-line", "Vencimiento", "date", "date_due", today);

    // Modal HTML 
    const previewModal = `
    <div id="preview-modal" class="fixed inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" id="preview-backdrop"></div>
        
        <div class="bg-gray-100 w-full h-full md:h-[90vh] md:w-[800px] md:rounded-xl relative z-10 flex flex-col overflow-hidden transform scale-95 transition-transform duration-300" id="preview-content">
            <div class="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md shrink-0">
                <div>
                    <h3 class="font-bold text-lg">Vista Previa</h3>
                    <p class="text-gray-400 text-xs">Confirma los datos antes de emitir</p>
                </div>
                <button id="btn-close-preview" class="hover:bg-gray-700 p-2 rounded-full transition-colors"><i class="ri-close-line text-xl"></i></button>
            </div>

            <div class="overflow-y-auto p-4 md:p-8 flex-1 bg-gray-500/10">
                <div class="bg-white shadow-2xl min-h-[800px] p-8 md:p-12 mx-auto max-w-2xl" id="invoice-paper">
                    <div class="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
                        <div>
                            <div class="text-4xl font-bold text-gray-800 tracking-tight mb-2" id="paper-type">FACTURA</div>
                            <div class="text-gray-500 font-mono text-sm"># BORRADOR</div>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-gray-800 text-xl" id="paper-total-top">$0.00</div>
                            <div class="text-gray-500 text-sm mt-1" id="paper-date">Fecha: --/--/----</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cobrar a:</h4>
                            <div class="text-gray-800 font-medium text-lg" id="paper-client">Cliente no seleccionado</div>
                            <div class="text-gray-500 text-sm mt-1" id="paper-client-address">Dirección...</div>
                        </div>
                        <div class="text-right">
                            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detalles:</h4>
                            <div class="text-gray-600 text-sm">Vence: <span id="paper-due">--/--/----</span></div>
                        </div>
                    </div>

                    <table class="w-full mb-8">
                        <thead>
                            <tr class="text-left text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                                <th class="py-3">Descripción</th>
                                <th class="py-3 text-right">Cant.</th>
                                <th class="py-3 text-right">Precio</th>
                                <th class="py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody id="paper-items-body" class="text-sm text-gray-700 divide-y divide-gray-100"></tbody>
                    </table>

                    <div class="flex justify-end border-t border-gray-200 pt-8">
                        <div class="w-1/2">
                            <div class="flex justify-between mb-2 text-gray-600">
                                <span>Subtotal</span>
                                <span id="paper-subtotal">$0.00</span>
                            </div>
                            <div class="flex justify-between mb-4 text-gray-600">
                                <span>Impuestos (16%)</span>
                                <span id="paper-tax">$0.00</span>
                            </div>
                            <div class="flex justify-between text-xl font-bold text-gray-800 pt-4 border-t border-gray-100">
                                <span>Total</span>
                                <span id="paper-total-bottom">$0.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
                <button id="btn-edit-mode" class="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Volver a Editar</button>
                <button id="btn-confirm-invoice" class="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all flex items-center gap-2">
                    <i class="ri-check-double-line"></i> <span id="btn-text-confirm">Confirmar y Emitir</span>
                </button>
            </div>
        </div>
    </div>
    `

    return `
    <div class="layout-wrapper flex min-h-screen bg-gray-50">
        ${desktopSidebar}

        <main class="main-content flex-1 flex flex-col h-screen overflow-hidden relative md:ml-64 transition-all">
            
            <header class="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shrink-0 z-20 sticky top-0">
                <div class="flex items-center gap-4">
                    <h1 class="text-xl font-bold text-gray-800">Crear Documento</h1>
                    <div class="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
                        <button id="btn-mode-invoice" class="px-4 py-1.5 rounded-md bg-white text-blue-600 shadow-sm transition-all active-mode-btn">Factura</button>
                        <button id="btn-mode-quote" class="px-4 py-1.5 rounded-md text-gray-500 hover:text-gray-700 transition-all">Cotización</button>
                    </div>
                </div>
                <div class="hidden md:block">
                    <button id="btn-open-preview" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-blue-500/20 shadow-lg">
                        Previsualizar
                    </button>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto p-4 md:p-8">
                <div class="max-w-5xl mx-auto space-y-6">
                    <!-- Formulario -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4">Información del Cliente</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="md:col-span-1">${clientSelect}</div>
                            <div class="md:col-span-1">${dateIssued}</div>
                            <div class="md:col-span-1">${dateDue}</div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 class="text-sm font-bold text-gray-400 uppercase tracking-wide">Conceptos</h2>
                            <button id="btn-add-item" class="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1">
                                <i class="ri-add-circle-fill text-lg"></i> Agregar Ítem
                            </button>
                        </div>
                        
                        <div class="p-6">
                            <div id="items-container" class="space-y-3"></div>
                            
                            <div class="flex justify-end mt-8 pt-4 border-t border-gray-100">
                                <div class="w-full md:w-1/3 space-y-2">
                                    <div class="flex justify-between text-gray-600 text-sm">
                                        <span>Subtotal:</span>
                                        <span id="form-subtotal" class="font-medium">$0.00</span>
                                    </div>
                                    <div class="flex justify-between text-gray-600 text-sm">
                                        <span>Impuestos (16%):</span>
                                        <span id="form-tax" class="font-medium">$0.00</span>
                                    </div>
                                    <div class="flex justify-between text-gray-900 text-xl font-bold pt-2">
                                        <span>Total:</span>
                                        <span id="form-total">$0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="h-20"></div>
            </div>
            
            <div class="md:hidden bg-white border-t border-gray-200 p-4 fixed bottom-0 left-0 right-0 z-30">
                <button id="btn-mobile-preview" class="w-full py-3 bg-blue-600 text-white rounded-lg font-bold text-lg">
                    Ver Previsualización
                </button>
            </div>
        </main>
        
        ${mobileNavbar}
        ${previewModal}
    </div>
    `
}