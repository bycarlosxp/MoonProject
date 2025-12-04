import { LoginLayout } from "./components/layouts/LoginLayout"
import { CrudLayout } from "./components/layouts/CrudLayout"
import { InvoiceLayout } from "./components/layouts/InvoiceLayout"
import "./style.css"

const app = document.querySelector("#app")

const routes = {
    login: LoginLayout,
    dashboard: CrudLayout,
    create: InvoiceLayout
}

// Estado para evitar clics múltiples durante la transición
let isNavigating = false;

window.navigateTo = (routeName) => {
    if (isNavigating) return;
    isNavigating = true;

    // 1. ANIMACIÓN DE SALIDA
    // Agregamos clase para desvanecer o deslizar hacia afuera
    const currentContent = app.firstElementChild;
    if (currentContent) {
        currentContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        currentContent.style.opacity = '0';
        currentContent.style.transform = 'scale(0.99)';
    }

    // Esperamos a que termine la animación de salida (200ms)
    setTimeout(() => {
        // 2. CAMBIO DE DOM
        app.innerHTML = routes[routeName]();
        
        // Reset de estilos base del contenedor
        if (routeName === 'login') {
            app.style.alignItems = 'center';
            app.style.display = 'flex';
        } else {
            app.style.alignItems = 'flex-start';
            app.style.display = 'block';
        }
        
        // 3. ANIMACIÓN DE ENTRADA (Manejada por CSS keyframes, pero aseguramos la opacidad)
        app.style.opacity = '1';
        
        // Inicializar listeners
        setupListeners(routeName);
        
        // Liberar bloqueo de navegación
        isNavigating = false;
        
    }, 200);
}

const setupListeners = (route) => {
    // --- Global Navigation Listeners ---
    
    // Sidebar links (Desktop) & Navbar items (Mobile)
    const handleNavClick = (e, targetRoute) => {
        e.preventDefault();
        if(route !== targetRoute) window.navigateTo(targetRoute);
    };

    document.querySelectorAll('[data-link="dashboard"]').forEach(el => 
        el.addEventListener('click', (e) => handleNavClick(e, 'dashboard')));
        
    document.querySelectorAll('[data-link="invoices"]').forEach(el => 
        el.addEventListener('click', (e) => handleNavClick(e, 'dashboard'))); // Asumimos que va al crud

    // Botones específicos para "Crear"
    document.getElementById('btn-create-invoice')?.addEventListener('click', (e) => handleNavClick(e, 'create'));
    document.getElementById('desktop-create-btn')?.addEventListener('click', (e) => handleNavClick(e, 'create'));
    
    // Botones del Navbar Mobile (Texto)
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const text = link.innerText.trim();
            if(text === 'Crear') handleNavClick(e, 'create');
            if(text === 'Facts' || text === 'Inicio') handleNavClick(e, 'dashboard');
        })
    });

    // --- Route Specific Logic ---

    if(route === 'login') {
        document.getElementById("login-form")?.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            btn.innerText = "Iniciando...";
            // Simular carga más fluida
            setTimeout(() => window.navigateTo('dashboard'), 800);
        });
    }

    if(route === 'create') {
        // Lógica de "Calculadora en vivo"
        const amountInput = document.getElementById('amount-trigger');
        
        const updateCalculations = (val) => {
             const amount = parseFloat(val) || 0;
             const subtotal = amount / 1.16; // Asumiendo impuesto incluido
             const tax = amount - subtotal;
             
             document.getElementById('preview-subtotal').innerText = '$' + subtotal.toFixed(2);
             document.getElementById('preview-tax').innerText = '$' + tax.toFixed(2);
             document.getElementById('preview-total').innerText = '$' + amount.toFixed(2);
        }

        amountInput?.addEventListener('input', (e) => {
            updateCalculations(e.target.value);
        });
        
        // Cancel button
        document.querySelectorAll('.custom-button-secondary').forEach(btn => {
            btn.addEventListener('click', () => window.navigateTo('dashboard'));
        });
    }
}

// Init
app.innerHTML = routes.login();
setupListeners('login');