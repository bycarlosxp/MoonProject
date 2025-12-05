import './ProductDrawer.css'
import { GenerateInput } from './Input'
import { GenerateSelect } from './Select'
import { GenerateButton } from './Button'

export const ProductDrawer = () => {
    const nameInput = GenerateInput("ri-text", "Nombre del Producto", "text", "prod_name")
    const skuInput = GenerateInput("ri-barcode-line", "Código / SKU", "text", "prod_sku")
    const priceInput = GenerateInput("ri-money-dollar-circle-line", "Precio Unitario", "number", "prod_price")
    
    const typeSelect = GenerateSelect("ri-list-settings-line", "prod_type", [
        { value: "product", label: "Producto Físico (Control de Stock)" },
        { value: "service", label: "Servicio (Intangible)" }
    ])

    const saveBtn = GenerateButton("Guardar Producto", "button", "primary")

    return `
        <div class="drawer-overlay" id="product-drawer">
            <div class="drawer-panel">
                <div class="drawer-header">
                    <span class="drawer-title">Nuevo Producto</span>
                    <button class="drawer-close" id="close-drawer-btn"><i class="ri-close-line"></i></button>
                </div>
                
                <div class="drawer-content">
                    <form id="product-form" style="display: flex; flex-direction: column; gap: 1rem;">
                        <!-- Icon Upload Simulation -->
                        <div style="display:flex; justify-content:center; margin-bottom:1rem;">
                            <div style="width:80px; height:80px; background:#f5f5f5; border-radius:1rem; border:2px dashed #ccc; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#95a5a6; cursor:pointer;">
                                <i class="ri-camera-line" style="font-size:1.5rem;"></i>
                                <span style="font-size:0.7rem;">Foto</span>
                            </div>
                        </div>

                        ${nameInput}
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
                            ${skuInput}
                            ${priceInput}
                        </div>
                        
                        <label style="font-size:0.9rem; color:#6b5674; font-weight:600; margin-top:0.5rem;">Tipo & Categoría</label>
                        ${typeSelect}

                        <!-- Stock Section (Solo si es producto fisico visualmente) -->
                        <div style="background:#f9f9f9; padding:1rem; border-radius:0.5rem; margin-top:0.5rem;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                                <span style="font-size:0.9rem;">Stock Inicial</span>
                                <span style="font-weight:bold; color:#2c3e50;">0</span>
                            </div>
                            <input type="range" min="0" max="100" value="0" style="width:100%; accent-color:#6b5674;">
                        </div>

                        <div style="margin-top: 2rem;">
                            ${saveBtn}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
}