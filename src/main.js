import { LoginLayout } from "./components/layouts/LoginLayout";
import { CrudLayout } from "./components/layouts/CrudLayout";
import { InvoiceLayout } from "./components/layouts/InvoiceLayout";
import { HomeLayout } from "./components/layouts/HomeLayout"; // Importar Home
import "./style.css";
import { ProductLayout } from "./components/layouts/ProductLayout";
import { ClientsLayout } from "./components/layouts/ClientsLayout";

const app = document.querySelector("#app");
let currentMode = "invoice";

const routes = {
  login: LoginLayout,
  home: HomeLayout,
  dashboard: CrudLayout, // Facturas
  create: InvoiceLayout,
  products: ProductLayout,
  clients: ClientsLayout,
};

// Estado para navegación
let isNavigating = false;

window.navigateTo = (routeName, params = {}) => {
  if (isNavigating) return;
  isNavigating = true;

  const currentContent = app.firstElementChild;
  if (currentContent) {
    currentContent.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    currentContent.style.opacity = "0";
    currentContent.style.transform = "scale(0.99)";
  }

  setTimeout(() => {
    app.innerHTML = routes[routeName]();

    if (routeName === "login") {
      app.style.alignItems = "center";
      app.style.display = "flex";
    } else {
      app.style.alignItems = "flex-start";
      app.style.display = "block";
    }

    app.style.opacity = "1";
    setupListeners(routeName, params);
    isNavigating = false;
  }, 200);
};

const setupListeners = (route, params) => {
  // --- Global Nav Listeners ---

  document.querySelectorAll(".sidebar-link").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const id = el.dataset.link;
      if (id === "dashboard") window.navigateTo("home");
      if (id === "invoices") window.navigateTo("dashboard");
      if (id === "products") window.navigateTo("products");
      if (id === "clients") window.navigateTo("clients");
    });
  });
  // Nav Items Mobile
  document.querySelectorAll(".nav-item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const text = link.innerText.trim();

      // Mapeo de texto a rutas
      if (text === "Inicio") window.navigateTo("home");
      if (text === "Facts") window.navigateTo("dashboard");
      if (text === "Prods") window.navigateTo("products"); // Nuevo
      if (text === "Clientes") window.navigateTo("clients"); // Nuevo
    });
  });

  // Create Buttons
  const handleCreate = (e) => {
    e.preventDefault();
    window.navigateTo("create");
  };
  document
    .getElementById("btn-create-invoice")
    ?.addEventListener("click", handleCreate);
  document
    .getElementById("desktop-create-btn")
    ?.addEventListener("click", handleCreate);
  document
    .getElementById("home-btn-create")
    ?.addEventListener("click", handleCreate); // Botón en Home

  // --- Route Specific Logic ---

  if (route === "products") {
    const drawer = document.getElementById("product-drawer");
    const openDrawer = () => drawer.classList.add("open");
    const closeDrawer = () => drawer.classList.remove("open");

    // Buttons to open drawer
    document
      .getElementById("desktop-add-prod")
      ?.addEventListener("click", openDrawer);
    document
      .getElementById("mobile-add-prod")
      ?.addEventListener("click", openDrawer);

    // Close actions
    document
      .getElementById("close-drawer-btn")
      ?.addEventListener("click", closeDrawer);

    // Click outside to close
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) closeDrawer();
    });

    // Save Logic Mock
    document
      .getElementById("product-form")
      ?.querySelector("button")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        const btn = e.target;
        btn.innerText = "Guardando...";
        setTimeout(() => {
          closeDrawer();
          btn.innerText = "Guardar Producto";
          // Todo: Agregar lógica real de guardado
          alert("Producto agregado (Simulación)");
        }, 800);
      });
  }

  if (route === "login") {
    document.getElementById("login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = e.target.querySelector("button");
      btn.innerText = "Iniciando...";
      setTimeout(() => window.navigateTo("home"), 800); // Redirigir a Home al login
    });
  }

  if (route === "create") {
    // Inicializar modo basado en params
    if (params && params.mode === "quote") {
      setQuoteMode();
    } else {
      setInvoiceMode();
    }

    // Toggle Listeners
    document
      .getElementById("btn-mode-invoice")
      .addEventListener("click", (e) => {
        e.preventDefault();
        setInvoiceMode();
      });

    document.getElementById("btn-mode-quote").addEventListener("click", (e) => {
      e.preventDefault();
      setQuoteMode();
    });

    // Calculadora en vivo
    const amountInput = document.getElementById("amount-trigger");
    amountInput?.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value) || 0;
      const subtotal = val / 1.16; // Simple 16% tax logic

      document.getElementById("preview-subtotal").innerText =
        "$" + subtotal.toFixed(2);
      document.getElementById("preview-tax").innerText =
        "$" + (val - subtotal).toFixed(2);
      document.getElementById("preview-total").innerText = "$" + val.toFixed(2);
    });
  }

  if (route === "home") {
    // Boton Factura
    document
      .getElementById("home-create-inv")
      ?.addEventListener("click", () => {
        window.navigateTo("create", { mode: "invoice" });
      });
    // Boton Cotización
    document
      .getElementById("home-create-quote")
      ?.addEventListener("click", () => {
        window.navigateTo("create", { mode: "quote" });
      });

    // Filtro de Mes (Simulación)
    document.getElementById("month-filter")?.addEventListener("change", (e) => {
      console.log("Filtro cambiado a:", e.target.value);
      // Todo: Actualizar datos del dashboard basado en el filtro
      const grid = document.querySelector(".finance-grid");
      grid.style.opacity = "0.5";
      setTimeout(() => (grid.style.opacity = "1"), 300);
    });
  }

  // Lógica simple de búsqueda (Visual)
  if (route === "dashboard") {
    const searchInput = document.getElementById("mobile-search-input");
    searchInput?.addEventListener("keyup", (e) => {
      console.log("Buscando: " + e.target.value);
      // Todo: Filtrar tabla basado en input
    });
  }
};

const setInvoiceMode = () => {
  currentMode = "invoice";
  // Update Toggle UI
  document.getElementById("btn-mode-invoice").classList.add("active");
  document.getElementById("btn-mode-quote").classList.remove("active");

  // Update Texts
  document.getElementById("form-title").innerText = "Nueva Factura";
  document.getElementById("form-subtitle").innerText =
    "Documento fiscal válido";
  document.getElementById("preview-badge").innerText = "FACTURA #DRAFT";

  // Update Button Text
  const btns = document.querySelectorAll(".custom-button-primary");
  btns.forEach((b) => (b.innerText = "Emitir Factura"));

  // Remove Quote Styles
  document
    .querySelector(".invoice-content")
    .classList.remove("quote-mode-active");
};

const setQuoteMode = () => {
  currentMode = "quote";
  // Update Toggle UI
  document.getElementById("btn-mode-quote").classList.add("active");
  document.getElementById("btn-mode-invoice").classList.remove("active");

  // Update Texts
  document.getElementById("form-title").innerText = "Crear Cotización";
  document.getElementById("form-subtitle").innerText =
    "Presupuesto sin validez fiscal";
  document.getElementById("preview-badge").innerText = "COTIZACIÓN";

  // Update Button Text
  const btns = document.querySelectorAll(".custom-button-primary");
  btns.forEach((b) => (b.innerText = "Enviar Presupuesto"));

  // Add Quote Styles (Changes color to Blue)
  document.querySelector(".invoice-content").classList.add("quote-mode-active");
};

// Init
app.innerHTML = routes.login();
setupListeners("login");
