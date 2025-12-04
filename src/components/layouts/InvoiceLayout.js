import './InvoiceLayout.css'
import { GenerateInput } from "../ui/Input"
import { GenerateSelect } from "../ui/Select"
import { GenerateButton } from "../ui/Button"
import { Navbar } from "../ui/Navbar"
import { Sidebar } from "../ui/SideBar"

export const InvoiceLayout = () => {
    
    // Generar Sidebar Desktop (marcado como activo 'create')
    // Nota: 'create' no está en el array original del sidebar, pero no importa, no se iluminará ninguno o puedes agregar uno dummy.
    const desktopSidebar = Sidebar('invoices') 
    
    // Mobile Navbar
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`

    // Elementos del formulario
    const clientSelect = GenerateSelect("ri-building-line", "client", [
        { value: "", label: "Seleccionar Cliente" },
        { value: "client1", label: "Tech Solutions Inc." },
        { value: "client2", label: "Studio Creativo" },
        { value: "client3", label: "Global Ventures" }
    ])

    const currencySelect = GenerateSelect("ri-money-dollar-circle-line", "currency", [
        { value: "USD", label: "USD - Dólar Americano" },
        { value: "EUR", label: "EUR - Euro" }
    ])

    const dateInput = GenerateInput("ri-calendar-line", "Fecha de Vencimiento", "date", "duedate")
    const descriptionInput = GenerateInput("ri-file-text-line", "Concepto / Descripción", "text", "description")
    
    // Botones
    const createButton = GenerateButton("Emitir Factura", "submit", "primary")
    const cancelButton = GenerateButton("Cancelar", "button", "secondary")

    return `
    <div class="invoice-page-wrapper">
        ${desktopSidebar}

        <main class="invoice-content">
            <div class="desktop-split-container">
                
                <!-- PANEL IZQUIERDO: Formulario (Desktop) / Top (Mobile) -->
                <div class="form-panel">
                    <div class="invoice-header">
                        <h2 style="margin:0; color:#2c3e50; font-size:1.8rem;">Nueva Factura</h2>
                        <p style="color:#95a5a6; margin:0.5rem 0 0 0;">Complete los detalles para generar el cobro.</p>
                    </div>

                    <form id="invoice-form-inputs">
                        <h4 style="color:#6b5674; margin-bottom:1rem;">Información del Cliente</h4>
                        ${clientSelect}
                        ${dateInput}

                        <h4 style="color:#6b5674; margin-bottom:1rem; margin-top:2rem;">Detalles</h4>
                        ${descriptionInput}
                        ${currencySelect}
                        
                        <!-- Botones movidos aquí para Desktop -->
                        <div class="hidden-mobile" style="margin-top:2rem; display:flex; gap:1rem;">
                            ${createButton}
                            <div style="width:100px">${cancelButton}</div>
                        </div>
                    </form>
                </div>

                <!-- PANEL DERECHO: Preview / Big Input (Desktop) / Bottom (Mobile) -->
                <div class="invoice-card preview-panel">
                    
                    <div class="big-amount-wrapper">
                        <span class="currency-label">Total a Pagar</span>
                        <!-- El input está aquí para dar efecto de "Calculator" -->
                        <input type="number" 
                               class="big-amount-input" 
                               placeholder="0.00" 
                               step="0.01" 
                               id="amount-trigger"
                               name="amount">
                        <div style="margin-top:0.5rem; font-size:0.9rem; opacity:0.7;">
                            Incluye impuestos
                        </div>
                    </div>

                    <div style="margin-top: auto;">
                        <div class="summary-row">
                            <span class="summary-label">Subtotal</span>
                            <span class="summary-value" id="preview-subtotal">$0.00</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">IVA (16%)</span>
                            <span class="summary-value" id="preview-tax">$0.00</span>
                        </div>
                        <div class="summary-row" style="border:none; margin-top:1rem; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.2)">
                            <span class="summary-label" style="font-weight:bold; color: inherit">Total Estimado</span>
                            <span class="summary-value" id="preview-total" style="font-size:1.2rem">$0.00</span>
                        </div>
                    </div>

                    <!-- Botón flotante para Mobile solamente -->
                    <div class="mobile-only-action" style="margin-top: 2rem;">
                        ${createButton}
                    </div>
                </div>

            </div>
        </main>
        
        ${mobileNavbar}
    </div>
    
    <style>
        /* CSS Inline helper para ocultar/mostrar botones según dispositivo en este layout */
        .mobile-only-action { display: block; }
        .hidden-mobile { display: none; }
        
        @media (min-width: 1024px) {
            .mobile-only-action { display: none; }
            .hidden-mobile { display: flex; }
        }
    </style>
    `
}