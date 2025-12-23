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

  setTimeout(async() => {
    app.innerHTML = await routes[routeName]();

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
    // Referencias
    const itemsContainer = document.getElementById("items-container");
    const btnAddItem = document.getElementById("btn-add-item");
    const previewModal = document.getElementById("preview-modal");
    
    // --- LÓGICA DE ÍTEMS DINÁMICOS ---
    
    // Función para crear una fila HTML
    const createRow = () => {
        const rowId = Date.now();
        const row = document.createElement("div");
        row.className = "grid grid-cols-12 gap-3 items-center item-row animate-fade-in";
        row.dataset.id = rowId;
        
        row.innerHTML = `
            <div class="col-span-6 md:col-span-5">
                <input type="text" placeholder="Descripción del producto..." class="item-desc w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none">
            </div>
            <div class="col-span-2 md:col-span-2">
                <input type="number" min="1" value="1" placeholder="Cant." class="item-qty w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-center focus:ring-2 focus:ring-blue-100 outline-none">
            </div>
            <div class="col-span-3 md:col-span-3">
                <input type="number" min="0" step="0.01" placeholder="Precio Unit." class="item-price w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-right focus:ring-2 focus:ring-blue-100 outline-none">
            </div>
            <div class="col-span-1 md:col-span-2 flex justify-center">
                <button class="btn-remove-item text-gray-400 hover:text-red-500 transition-colors">
                    <i class="ri-delete-bin-line text-lg"></i>
                </button>
            </div>
        `;

        // Listeners internos de la fila para recalcular
        const inputs = row.querySelectorAll("input");
        inputs.forEach(input => input.addEventListener("input", calculateTotals));
        
        // Listener borrar
        row.querySelector(".btn-remove-item").addEventListener("click", () => {
            row.remove();
            calculateTotals();
        });

        itemsContainer.appendChild(row);
    };

    // Función de cálculo
    const calculateTotals = () => {
        let subtotal = 0;
        document.querySelectorAll(".item-row").forEach(row => {
            const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
            const price = parseFloat(row.querySelector(".item-price").value) || 0;
            subtotal += qty * price;
        });

        const tax = subtotal * 0.16; // 16% IVA
        const total = subtotal + tax;

        // Actualizar UI del Formulario
        document.getElementById("form-subtotal").innerText = `$${subtotal.toFixed(2)}`;
        document.getElementById("form-tax").innerText = `$${tax.toFixed(2)}`;
        document.getElementById("form-total").innerText = `$${total.toFixed(2)}`;
        
        return { subtotal, tax, total }; // Retornar valores para el modal
    };

    // Inicializar con una fila
    createRow();
    btnAddItem?.addEventListener("click", createRow);


    // --- LÓGICA DEL MODAL DE PREVISUALIZACIÓN ---
    
    const fillModalData = () => {
        const { subtotal, tax, total } = calculateTotals();
        const clientSelect = document.querySelector("select[name='client']");
        const clientName = clientSelect.options[clientSelect.selectedIndex].text;
        
        // Header info
        document.getElementById("paper-client").innerText = clientName !== "Seleccionar Cliente..." ? clientName : "---";
        document.getElementById("paper-date").innerText = "Emisión: " + (document.querySelector("input[name='date_issued']").value || new Date().toLocaleDateString());
        document.getElementById("paper-due").innerText = document.querySelector("input[name='date_due']").value || "---";
        
        // Items Table en el Papel
        const paperBody = document.getElementById("paper-items-body");
        paperBody.innerHTML = ""; // Limpiar
        
        document.querySelectorAll(".item-row").forEach(row => {
            const desc = row.querySelector(".item-desc").value;
            const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
            const price = parseFloat(row.querySelector(".item-price").value) || 0;
            const rowTotal = qty * price;

            if(desc || rowTotal > 0) {
                paperBody.innerHTML += `
                    <tr>
                        <td class="py-2 text-gray-800">${desc || "Ítem sin nombre"}</td>
                        <td class="py-2 text-right text-gray-600">${qty}</td>
                        <td class="py-2 text-right text-gray-600">$${price.toFixed(2)}</td>
                        <td class="py-2 text-right font-medium text-gray-800">$${rowTotal.toFixed(2)}</td>
                    </tr>
                `;
            }
        });

        // Totales Finales Paper
        document.getElementById("paper-subtotal").innerText = `$${subtotal.toFixed(2)}`;
        document.getElementById("paper-tax").innerText = `$${tax.toFixed(2)}`;
        document.getElementById("paper-total-bottom").innerText = `$${total.toFixed(2)}`;
        document.getElementById("paper-total-top").innerText = `$${total.toFixed(2)}`;
    };

    const openPreview = () => {
        fillModalData();
        previewModal.classList.add("opacity-100", "pointer-events-auto");
        previewModal.querySelector("#preview-content").classList.remove("scale-95");
        previewModal.querySelector("#preview-content").classList.add("scale-100");
    };

    const closePreview = () => {
        previewModal.classList.remove("opacity-100", "pointer-events-auto");
        previewModal.querySelector("#preview-content").classList.add("scale-95");
        previewModal.querySelector("#preview-content").classList.remove("scale-100");
    };

    // Listeners Modal
    document.getElementById("btn-open-preview")?.addEventListener("click", openPreview);
    document.getElementById("btn-mobile-preview")?.addEventListener("click", openPreview); // Mobile
    document.getElementById("btn-close-preview")?.addEventListener("click", closePreview);
    document.getElementById("btn-edit-mode")?.addEventListener("click", closePreview);
    
    // Toggle Factura / Cotización
    document.getElementById("btn-mode-quote").addEventListener("click", () => {
        document.getElementById("paper-type").innerText = "COTIZACIÓN";
        document.getElementById("btn-mode-quote").classList.replace("text-gray-500", "bg-white");
        document.getElementById("btn-mode-quote").classList.add("text-blue-600", "shadow-sm");
        document.getElementById("btn-mode-invoice").classList.remove("bg-white", "text-blue-600", "shadow-sm");
        document.getElementById("btn-mode-invoice").classList.add("text-gray-500");
    });
    
    document.getElementById("btn-mode-invoice").addEventListener("click", () => {
        document.getElementById("paper-type").innerText = "FACTURA";
        // ... reversa de clases (puedes optimizar esto con una función toggle)
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

 if (route === "clients") {
    const modal = document.getElementById("client-modal");
    const modalContent = document.getElementById("modal-content");
    const form = document.getElementById("client-form");
    const modalTitle = document.getElementById("modal-title");
    const btnSave = document.getElementById("btn-save-client");
    
    // Inputs de búsqueda (Desktop y Mobile)
    const searchInputs = [
        document.getElementById("client-search-desktop"), 
        document.getElementById("client-search-mobile")
    ];

    // Funciones del Modal
    const openModal = (isEdit = false) => {
        modal.classList.add("modal-open");
        modalContent.classList.add("modal-content-open");
        if(!isEdit) {
            form.reset();
            document.getElementById("client-id-field").value = ""; // Limpiar ID
            modalTitle.innerText = "Nuevo Cliente";
            btnSave.innerHTML = "<span>Guardar Cliente</span>";
        }
    };

    const closeModal = () => {
        modal.classList.remove("modal-open");
        modalContent.classList.remove("modal-content-open");
        setTimeout(() => {
            form.reset();
            document.getElementById("client-id-field").value = "";
        }, 300); // Esperar animación
    };

    // Listeners Apertura/Cierre
    document.getElementById("btn-open-modal")?.addEventListener("click", () => openModal(false));
    document.getElementById("mobile-add-btn")?.addEventListener("click", () => openModal(false));
    document.getElementById("btn-close-modal")?.addEventListener("click", closeModal);
    document.getElementById("btn-cancel-modal")?.addEventListener("click", closeModal);
    document.getElementById("modal-backdrop")?.addEventListener("click", closeModal);

    // --- LÓGICA DE EDICIÓN ---
    // Usamos delegación de eventos porque los botones se crean dinámicamente
    document.querySelectorAll(".btn-edit-client").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            // 1. Obtener datos del atributo
            const clientData = JSON.parse(btn.dataset.client);
            
            // 2. Rellenar formulario
            form.elements["client_name"].value = clientData.client_name;
            form.elements["client_document_id"].value = clientData.client_document_id;
            form.elements["client_address"].value = clientData.client_address;
            form.elements["client_phone"].value = clientData.client_phone;
            
            // IMPORTANTE: Setear el ID en el input hidden
            // Asumo que tu objeto client tiene un campo 'id' o '_id'. Ajusta según tu BD.
            form.elements["id"].value = clientData.id || clientData._id; 

            // 3. Cambiar UI del modal
            modalTitle.innerText = "Editar Cliente";
            btnSave.innerHTML = "<span>Actualizar Cliente</span>";
            
            // 4. Abrir
            openModal(true);
        });
    });

    // --- LÓGICA DE GUARDADO (POST/PUT) ---
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = btnSave;
        const originalContent = btn.innerHTML;
        const formData = new FormData(form);
        const clientId = formData.get("id"); // Verificar si existe ID

        // Datos básicos
        const payload = {
            client_name: formData.get("client_name"),
            client_document_id: formData.get("client_document_id"),
            client_address: formData.get("client_address"),
            client_phone: formData.get("client_phone")
        };

        btn.innerHTML = "<span class='animate-pulse'>Procesando...</span>";
        btn.disabled = true;

        try {
            let url = 'http://localhost:3000/api/clients';
            let method = 'POST';

            // Si hay ID, cambiamos a modo EDICION
            if (clientId) {
                url = `http://localhost:3000/api/clients/${clientId}`;
                method = 'PUT'; // O 'PATCH' dependiendo de tu backend
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                closeModal();
                window.navigateTo("clients"); // Recargar vista
            } else {
                alert("Error al procesar la solicitud");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor");
        } finally {
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    });

    // --- Lógica de Filtro Unificada ---
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        const rows = document.querySelectorAll(".crud-row");

        rows.forEach(row => {
            const name = row.querySelector(".client-name-text")?.innerText.toLowerCase() || "";
            const phone = row.querySelector(".client-phone-text")?.innerText.toLowerCase() || "";
            
            if (name.includes(term) || phone.includes(term)) {
                row.style.display = "flex"; // Grid rows suelen ser flex en mi diseño
            } else {
                row.style.display = "none";
            }
        });
    };

    // Conectar ambos inputs de búsqueda a la misma lógica
    searchInputs.forEach(input => input?.addEventListener("input", handleSearch));
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
