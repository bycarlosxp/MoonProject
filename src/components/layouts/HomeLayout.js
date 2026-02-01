import './HomeLayout.css'
import { Sidebar } from '../ui/SideBar'
import { Navbar } from '../ui/Navbar'

export const HomeLayout = async () => { // <--- 1. Ahora es ASYNC
    const mobileNavbar = `<div class="mobile-nav-container md:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200">${Navbar()}</div>`
    const desktopSidebar = Sidebar('home')

    // --- VARIABLES DE ESTADO ---
    let totalInvoiced = 0;
    let totalPending = 0;
    let pendingCount = 0;
    let quotesCount = 0;
    let weeklyData = [0, 0, 0, 0]; // Semanas 1, 2, 3, 4

    // Formateador de moneda
    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    try {
        // --- 2. FETCH DE DATOS ---
        const res = await fetch('http://localhost:3000/api/invoices');
        const invoices = await res.json();

        // Obtener mes actual
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // --- 3. PROCESAMIENTO DE DATOS ---
        invoices.forEach(inv => {
            const amount = parseFloat(inv.total_amount);
            const invDate = new Date(inv.invoice_date);

            // Filtros Globales (Acumulados Históricos o del Mes)
            // Aquí usaremos lógica del MES ACTUAL para que el dashboard sea relevante
            const isCurrentMonth = invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;

            if (isCurrentMonth) {
                // KPI 1: Facturado (Solo Facturas, no Cotizaciones)
                if (inv.invoice_type === 'FACTURA' && inv.invoice_status !== 'ANULADA') {
                    totalInvoiced += amount;

                    // Lógica para el Gráfico (Agrupar por semanas del mes)
                    // Día del mes / 7 nos da un índice aproximado (0 a 4)
                    const day = invDate.getDate();
                    const weekIndex = Math.floor((day - 1) / 7);
                    if (weeklyData[weekIndex] !== undefined) {
                        weeklyData[weekIndex] += amount;
                    }
                }

                // KPI 2: Por Cobrar (Facturas Pendientes)
                if (inv.invoice_type === 'FACTURA' && inv.invoice_status === 'PENDIENTE') {
                    totalPending += amount;
                    pendingCount++;
                }

                // KPI 3: Cotizaciones (Conteo)
                if (inv.invoice_type === 'COTIZACION') {
                    quotesCount++;
                }
            }
        });

    } catch (error) {
        console.error("Error calculando dashboard:", error);
    }

    // --- 4. GENERAR BARRAS DEL GRÁFICO ---
    // Encontrar el valor máximo para calcular porcentajes de altura CSS
    const maxVal = Math.max(...weeklyData, 1); // Evitar división por 0

    const chartBarsHTML = weeklyData.map((val, index) => {
        const heightPercentage = Math.round((val / maxVal) * 100); // 0 a 100%
        // Si es la semana actual (aprox), le ponemos clase 'active'
        const currentWeekIndex = Math.floor((new Date().getDate() - 1) / 7);
        const isActive = index === currentWeekIndex ? 'active' : '';

        return `
            <div class="bar-group" title="$${val}">
                <div class="bar ${isActive}" style="height: ${heightPercentage}%"></div>
                <span class="bar-label">S${index + 1}</span>
            </div>
        `;
    }).join('');


    // --- RENDERIZADO ---
    return `
    <div class="layout-wrapper flex min-h-screen bg-gray-50">
        ${desktopSidebar}
        
        <main class="home-container main-content flex-1 p-4 md:p-8 md:ml-64 transition-all mb-16 md:mb-0">
            <!-- Header -->
            <div class="dashboard-header-row flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 style="margin:0; font-size:1.5rem; color:#2c3e50;">Resumen Mensual</h1>
                    <p style="margin:0; color:#95a5a6; font-size:0.9rem;">Datos de ${new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</p>
                </div>
                
                <!-- El filtro es visual por ahora, requeriría re-renderizar todo el componente para funcionar -->
                <div class="date-filter-wrapper hidden md:flex">
                    <i class="ri-calendar-event-line" style="color:#6b5674"></i>
                    <span class="text-sm font-medium text-gray-600">Este Mes</span>
                </div>
            </div>

            <!-- KPIs Financieros -->
            <div class="finance-grid">
                <!-- Card 1 -->
                <div class="fin-card">
                    <span class="fin-label">Facturado (Mes)</span>
                    <span class="fin-value">${formatMoney(totalInvoiced)}</span>
                    <span class="fin-trend trend-up text-xs text-green-500 flex items-center gap-1">
                        <i class="ri-wallet-3-line"></i> Total procesado
                    </span>
                </div>
                
                <!-- Card 2 -->
                <div class="fin-card">
                    <span class="fin-label">Por Cobrar</span>
                    <span class="fin-value" style="color:#e67e22">${formatMoney(totalPending)}</span>
                    <span class="fin-trend text-xs" style="color:#95a5a6">
                        ${pendingCount} Facturas pendientes
                    </span>
                </div>

                <!-- Card 3 -->
                <div class="fin-card">
                    <span class="fin-label">Cotizaciones</span>
                    <span class="fin-value">${quotesCount}</span>
                    <span class="fin-trend text-xs text-blue-500">
                        Generadas este mes
                    </span>
                </div>
            </div>

            <!-- Gráfico de Facturación -->
            <div class="chart-card">
                <div class="chart-header">
                    <span style="font-weight:700; color:#2c3e50">Rendimiento Semanal (Ingresos)</span>
                    <i class="ri-bar-chart-fill" style="color:#95a5a6"></i>
                </div>
                <!-- Barras generadas dinámicamente -->
                <div class="bars-container">
                    ${chartBarsHTML}
                </div>
            </div>

            <!-- Accesos directos -->
            <div style="display:flex; gap:1rem; margin-top: 2rem;">
                <button class="custom-button custom-button-primary shadow-lg shadow-blue-500/20" id="home-create-inv" style="flex:1; display:flex; justify-content:center; align-items:center; gap:0.5rem;">
                    <i class="ri-file-text-line"></i> Nueva Factura
                </button>
            </div>

        </main>
        
        ${mobileNavbar}
    </div>
    `
}