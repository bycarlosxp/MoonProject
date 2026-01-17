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

    let invoices = []
    let clients = []
    let clientMap = {} 

    // 1. Fetch de Datos Cruzados
    try {
        const [invoicesRes, clientsRes] = await Promise.all([
            fetch('http://localhost:3000/api/invoices'),
            fetch('http://localhost:3000/api/clients')
        ]);

        invoices = await invoicesRes.json();
        clients = await clientsRes.json();

        // 2. Crear Diccionario de Clientes (ID -> Nombre)
        // Esto evita recorrer el array de clientes por cada factura (O(1) vs O(n))
        clients.forEach(c => {
            clientMap[c.client_id] = c.client_name;
        });

    } catch (error) {
        console.error("Error cargando datos:", error);
    }

    // --- Helpers de Formato ---
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const getStatusBadge = (status) => {
        const s = status?.toUpperCase() || "PENDIENTE";
        const styles = {
            'PAGADA': 'bg-green-100 text-green-700 border border-green-200',
            'PENDIENTE': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            'ANULADA': 'bg-red-50 text-red-700 border border-red-200'
        };
        const className = styles[s] || styles['PENDIENTE'];
        return `<span class="px-2 py-1 rounded-md text-xs font-bold ${className}">${s}</span>`;
    };

    // --- Generación de Filas ---
    const rows = invoices?.map(inv => {
        // Recuperamos el nombre usando el ID guardado en la factura
        const clientName = clientMap[inv.client_id] || `Cliente Desconocido (${inv.client_id})`;
        
        return `
        <div class="crud-row transition-all hover:bg-gray-50 border-b border-gray-100 last:border-0 flex flex-col md:grid md:grid-cols-6 md:items-center gap-2 p-4">
            
            <!-- Col 1: Documento -->
            <div class="md:col-span-1 flex justify-between md:block" data-label="Documento">
                <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Documento</span>
                <div class="flex flex-col">
                    <span class="font-bold text-gray-800">#${inv.invoice_id.toString().padStart(4, '0')}</span>
                    <span class="text-xs text-gray-400 uppercase tracking-wider">${inv.invoice_type}</span>
                </div>
            </div>

            <!-- Col 2: Cliente -->
            <div class="md:col-span-1 flex justify-between md:block" data-label="Cliente">
                 <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Cliente</span>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-bold">
                        ${clientName.charAt(0).toUpperCase()}
                    </div>
                    <span class="font-medium text-gray-700 truncate max-w-[150px]" title="${clientName}">${clientName}</span>
                </div>
            </div>

            <!-- Col 3: Emisión -->
            <div class="md:col-span-1 flex justify-between md:block" data-label="Emisión">
                <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Fecha</span>
                <span class="text-sm text-gray-500">${formatDate(inv.invoice_date)}</span>
            </div>

            <!-- Col 4: Estado -->
            <div class="md:col-span-1 flex justify-between md:block" data-label="Estado">
                <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Estado</span>
                <div>${getStatusBadge(inv.invoice_status)}</div>
            </div>

            <!-- Col 5: Total -->
            <div class="md:col-span-1 flex justify-between md:block" data-label="Total">
                <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Total</span>
                <span class="font-bold text-gray-800">${formatCurrency(inv.total_amount)}</span>
            </div>

            <!-- Col 6: Acciones -->
            <div class="md:col-span-1 flex justify-end gap-2 mt-2 md:mt-0">
                <button class="w-8 h-8 rounded-full hover:bg-blue-50 text-blue-500 transition-colors flex items-center justify-center" title="Ver Detalles">
                    <i class="ri-eye-line"></i>
                </button>
                <button class="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 transition-colors flex items-center justify-center" title="Descargar PDF">
                    <i class="ri-download-line"></i>
                </button>
            </div>
        </div>
    `}).join('');

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
                    ${rows.length > 0 ? rows : `
                        <div class="flex flex-col items-center justify-center p-12 text-center">
                            <div class="bg-gray-50 p-4 rounded-full mb-3">
                                <i class="ri-file-list-3-line text-3xl text-gray-300"></i>
                            </div>
                            <p class="text-gray-500 font-medium">No se encontraron facturas</p>
                        </div>
                    `}
                </div>
            </div>
        </main>
        
        ${mobileNavbar}
    </div>
    `
}