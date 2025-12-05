import './HomeLayout.css'
import { Sidebar } from '../ui/SideBar'
import { Navbar } from '../ui/Navbar'

export const HomeLayout = () => {
    const mobileNavbar = `<div class="mobile-nav-container">${Navbar()}</div>`
    const desktopSidebar = Sidebar('dashboard')

    return `
    <div class="layout-wrapper">
        ${desktopSidebar}
        
        <main class="home-container">
            <!-- Header con Filtro de Mes -->
            <div class="dashboard-header-row">
                <div>
                    <h1 style="margin:0; font-size:1.5rem; color:#2c3e50;">Resumen</h1>
                    <p style="margin:0; color:#95a5a6; font-size:0.9rem;">Flujo de caja</p>
                </div>
                
                <div class="date-filter-wrapper">
                    <i class="ri-calendar-event-line" style="color:#6b5674"></i>
                    <select class="date-select" id="month-filter">
                        <option value="current">Noviembre 2023</option>
                        <option value="last">Octubre 2023</option>
                        <option value="last2">Septiembre 2023</option>
                    </select>
                    <i class="ri-arrow-down-s-line filter-icon-arrow"></i>
                </div>
            </div>

            <!-- KPIs Financieros -->
            <div class="finance-grid">
                <div class="fin-card">
                    <span class="fin-label">Facturado (Neto)</span>
                    <span class="fin-value">$12,450</span>
                    <span class="fin-trend trend-up"><i class="ri-arrow-up-line"></i> +12% vs mes ant.</span>
                </div>
                
                <div class="fin-card">
                    <span class="fin-label">Por Cobrar</span>
                    <span class="fin-value" style="color:#e67e22">$3,200</span>
                    <span class="fin-trend" style="color:#95a5a6">4 Facturas pendientes</span>
                </div>

                <div class="fin-card">
                    <span class="fin-label">Cotizaciones</span>
                    <span class="fin-value">8</span>
                    <span class="fin-trend trend-up"><i class="ri-check-double-line"></i> 5 Aprobadas</span>
                </div>

                <div class="fin-card">
                    <span class="fin-label">Gastos Op.</span>
                    <span class="fin-value" style="color:#c0392b">$1,100</span>
                    <span class="fin-trend trend-down"><i class="ri-arrow-down-line"></i> -5% (Mejor)</span>
                </div>
            </div>

            <!-- Gráfico de Facturación (CSS Puro) -->
            <div class="chart-card">
                <div class="chart-header">
                    <span style="font-weight:700; color:#2c3e50">Rendimiento Semanal</span>
                    <i class="ri-more-fill" style="color:#95a5a6"></i>
                </div>
                <div class="bars-container">
                    <div class="bar-group"><div class="bar" style="height: 40%"></div><span class="bar-label">S1</span></div>
                    <div class="bar-group"><div class="bar" style="height: 65%"></div><span class="bar-label">S2</span></div>
                    <div class="bar-group"><div class="bar active" style="height: 85%"></div><span class="bar-label">S3</span></div>
                    <div class="bar-group"><div class="bar" style="height: 50%"></div><span class="bar-label">S4</span></div>
                    <div class="bar-group"><div class="bar" style="height: 30%"></div><span class="bar-label">S5</span></div>
                </div>
            </div>

            <!-- Accesos directos a crear -->
            <div style="display:flex; gap:1rem;">
                <button class="custom-button custom-button-primary" id="home-create-inv" style="flex:1; display:flex; justify-content:center; align-items:center; gap:0.5rem;">
                    <i class="ri-file-text-line"></i> Nueva Factura
                </button>
                <button class="custom-button custom-button-secondary" id="home-create-quote" style="flex:1; display:flex; justify-content:center; align-items:center; gap:0.5rem; background-color:white; color:#6b5674; border:1px solid #6b5674;">
                    <i class="ri-draft-line"></i> Cotización
                </button>
            </div>

        </main>
        
        ${mobileNavbar}
    </div>
    `
}