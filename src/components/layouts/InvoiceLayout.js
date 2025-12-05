import './InvoiceLayout.css'
import { GenerateInput } from "../ui/Input"
import { GenerateSelect } from "../ui/Select"
import { GenerateButton } from "../ui/Button"
import { Navbar } from "../ui/Navbar"
import { Sidebar } from "../ui/SideBar"

export const InvoiceLayout = () => {
    const desktopSidebar = Sidebar('invoices')
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`

    // Inputs
    const clientSelect = GenerateSelect("ri-building-line", "client", [
        { value: "", label: "Seleccionar Cliente" },
        { value: "c1", label: "Tech Solutions" },
        { value: "c2", label: "Studio Design" }
    ])
    const currencySelect = GenerateSelect("ri-money-dollar-circle-line", "currency", [
        { value: "USD", label: "USD - Dólar" },
        { value: "VES", label: "VES - Bolívar" }
    ])
    
    const dateInput = GenerateInput("ri-calendar-line", "Vencimiento / Validez", "date", "duedate")
    const descriptionInput = GenerateInput("ri-file-text-line", "Descripción", "text", "description")
    
    // Botones con IDs dinámicos
    const actionButton = GenerateButton("Emitir Factura", "submit", "primary")

    return `
    <div class="invoice-page-wrapper">
        ${desktopSidebar}

        <main class="invoice-content">
            <div class="desktop-split-container">
                
                <!-- PANEL IZQUIERDO -->
                <div class="form-panel">
                    
                    <!-- TOGGLE FACTURA / COTIZACION -->
                    <div class="type-toggle-container">
                        <button class="toggle-btn active" id="btn-mode-invoice">Factura</button>
                        <button class="toggle-btn" id="btn-mode-quote">Cotización</button>
                    </div>

                    <div class="invoice-header">
                        <h2 style="margin:0; color:#2c3e50; font-size:1.8rem;" id="form-title">Nueva Factura</h2>
                        <p style="color:#95a5a6; margin:0.5rem 0 0 0;" id="form-subtitle">Documento fiscal válido</p>
                    </div>

                    <form id="invoice-form-inputs">
                        <h4 style="color:#6b5674; margin-bottom:1rem; font-size:0.9rem;">Datos Principales</h4>
                        ${clientSelect}
                        ${dateInput}
                        <div style="margin-top:1rem;">${descriptionInput}</div>
                        <div style="margin-top:1rem;">${currencySelect}</div>

                        <div class="hidden-mobile" style="margin-top:2rem;">
                            <div id="desktop-submit-container">${actionButton}</div>
                        </div>
                    </form>
                </div>

                <!-- PANEL DERECHO (Preview) -->
                <div class="invoice-card preview-panel" id="preview-card">
                    <div style="opacity:0.6; font-size:0.8rem; letter-spacing:2px; margin-bottom:1rem;" id="preview-badge">
                        FACTURA #DRAFT
                    </div>

                    <div class="big-amount-wrapper">
                        <span class="currency-label">Total</span>
                        <input type="number" class="big-amount-input" placeholder="0.00" step="0.01" id="amount-trigger">
                    </div>

                    <div style="margin-top: auto;">
                        <div class="summary-row">
                            <span class="summary-label">Subtotal</span>
                            <span class="summary-value" id="preview-subtotal">$0.00</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Impuestos</span>
                            <span class="summary-value" id="preview-tax">$0.00</span>
                        </div>
                        <div class="summary-row" style="border-top:1px solid rgba(255,255,255,0.2); margin-top:1rem; padding-top:1rem; border-bottom:none;">
                            <span class="summary-label" style="color:white; font-weight:bold;">Total</span>
                            <span class="summary-value" id="preview-total" style="font-size:1.2rem;">$0.00</span>
                        </div>
                    </div>
                    
                    <!-- Botón Mobile -->
                    <div class="mobile-only-action" style="margin-top: 2rem;">
                        <div id="mobile-submit-container">${actionButton}</div>
                    </div>
                </div>

            </div>
        </main>
        
        ${mobileNavbar}
    </div>
    `
}