import './ProductList.css'

const mockProducts = [
    { id: 1, name: 'Diseño Web Básico', sku: 'SRV-001', price: 450.00, stock: 999, type: 'service' },
    { id: 2, name: 'Hosting Anual', sku: 'SRV-002', price: 120.00, stock: 999, type: 'service' },
    { id: 3, name: 'Mouse Ergonómico', sku: 'PRD-104', price: 45.50, stock: 12, type: 'product' },
    { id: 4, name: 'Teclado Mecánico', sku: 'PRD-105', price: 120.00, stock: 3, type: 'product' },
    { id: 5, name: 'Monitor 24"', sku: 'PRD-201', price: 180.00, stock: 0, type: 'product' },
]

const getStockBadge = (stock, type) => {
    if (type === 'service') return '<span class="stock-badge stock-high">Ilimitado</span>';
    if (stock === 0) return '<span class="stock-badge stock-out">Agotado</span>';
    if (stock < 5) return `<span class="stock-badge stock-low">Bajo (${stock})</span>`;
    return `<span class="stock-badge stock-high">En Stock (${stock})</span>`;
}

const getIcon = (type) => type === 'service' ? 'ri-service-line' : 'ri-box-3-line';

export const ProductList = () => {
    const rows = mockProducts.map(p => `
        <div class="product-card">
            <div class="product-icon">
                <i class="${getIcon(p.type)}"></i>
            </div>
            
            <div class="product-info">
                <span class="product-name">${p.name}</span>
                <span class="product-sku">SKU: ${p.sku}</span>
            </div>

            <!-- Estos divs se comportan diferente en grid desktop -->
            <div class="desktop-only-cell" style="display:none;">${p.type === 'service' ? 'Servicio' : 'Producto Fisico'}</div>
            
            <div class="product-meta">
                <span class="product-price">$${p.price.toFixed(2)}</span>
            </div>

            <div class="desktop-only-cell" style="display:none;">${getStockBadge(p.stock, p.type)}</div>

            <!-- Mobile Badge (visible solo mobile via CSS hacks o structure) -->
            <div class="mobile-only-badge" style="font-size:0.8rem; margin-top:0.2rem;">
               ${window.innerWidth < 1024 ? getStockBadge(p.stock, p.type) : ''} 
            </div>

            <div style="text-align:right;">
                <button class="action-btn"><i class="ri-more-2-fill"></i></button>
            </div>
        </div>
    `).join('')

    return `
        <div style="background:white; border-radius:1rem; box-shadow:0 4px 15px rgba(0,0,0,0.02); overflow:hidden;">
            <div class="products-table-header">
                <span>Img</span>
                <span>Nombre / SKU</span>
                <span>Tipo</span>
                <span>Precio</span>
                <span>Stock</span>
                <span></span>
            </div>
            <div class="products-list-body">
                ${rows}
            </div>
        </div>
        <style>
            @media (min-width: 1024px) {
                .desktop-only-cell { display: block !important; display: flex; align-items: center; }
                .mobile-only-badge { display: none !important; }
            }
        </style>
    `
}