import { LoginLayout } from "./components/layouts/LoginLayout";
import { CrudLayout } from "./components/layouts/CrudLayout";
import { InvoiceLayout } from "./components/layouts/InvoiceLayout";
import { HomeLayout } from "./components/layouts/HomeLayout";
import "./style.css";
import { ProductLayout } from "./components/layouts/ProductLayout";
import { ClientsLayout } from "./components/layouts/ClientsLayout";

const app = document.querySelector("#app");

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

// --- ROUTER PRINCIPAL ---
window.navigateTo = async (routeName, params = {}) => {
  if (isNavigating) return;
  isNavigating = true;

  const currentContent = app.firstElementChild;
  if (currentContent) {
    currentContent.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    currentContent.style.opacity = "0";
    currentContent.style.transform = "scale(0.99)";
  }

  setTimeout(async () => {
    try {
      app.innerHTML = await routes[routeName]();
    } catch (error) {
      console.error("Error renderizando ruta:", error);
      app.innerHTML = await routes.login();
      routeName = 'login';
    }

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

// --- ORQUESTADOR DE LISTENERS ---
const setupListeners = (route, params) => {
  setupGlobalNavigation();

  switch (route) {
    case "login":
      handleLoginLogic();
      break;
    case "create":
      handleCreateInvoiceLogic(params);
      break;
    case "clients":
      handleClientsLogic();
      break;
    case "dashboard":
      handleDashboardLogic();
      break;
    case "home":
      handleHomeLogic();
      break;
    case "products":
      handleProductsLogic();
      break;
  }
};

// --- 1. NAVEGACIÓN GLOBAL ---
const setupGlobalNavigation = () => {
  document.querySelectorAll(".sidebar-link").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      // Si es botón de logout
      if (el.innerText.includes("Cerrar Sesión") || el.querySelector('.ri-logout-box-line')) {
        handleLogout();
        return;
      }
      
      const id = el.dataset.link;
      if (id) window.navigateTo(id);
    });
  });

  document.querySelectorAll(".nav-item").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const text = link.innerText.trim();
      if (text === "Inicio") window.navigateTo("home");
      if (text === "Facts") window.navigateTo("dashboard");
      if (text === "Prods") window.navigateTo("products");
      if (text === "Clientes") window.navigateTo("clients");
    });
  });

  const handleCreate = (e) => {
    e.preventDefault();
    window.navigateTo("create");
  };
  document.getElementById("btn-create-invoice")?.addEventListener("click", handleCreate);
  document.getElementById("home-btn-create")?.addEventListener("click", handleCreate);
};

// --- 2. LÓGICA DE LOGIN ---
const handleLoginLogic = () => {
  const loader = document.querySelector('#main-loader');
  if (loader && !loader.classList.contains('hidden-loader')) {
      setTimeout(() => { loader.style.display = 'none'; }, 500);
  }

  const loginForm = document.getElementById("login-form");
  loginForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    const originalText = btn.innerText;

    const formData = new FormData(loginForm);
    const payload = {
      email: formData.get("username"),
      password: formData.get("password"),
    };

    btn.innerText = "Autenticando...";
    btn.disabled = true;
    btn.style.opacity = "0.7";

    try {
      const response = await fetch("http://localhost:2020/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error en credenciales");

      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userData", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token);

      btn.innerText = "¡Éxito!";
      btn.style.backgroundColor = "#27ae60";

      setTimeout(() => window.navigateTo("home"), 500);
    } catch (error) {
      console.error(error);
      btn.innerText = "Error: Verifique datos";
      btn.style.backgroundColor = "#e74c3c";
      setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.backgroundColor = "";
      }, 2000);
    }
  });
};

const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userData");
  window.navigateTo("login");
};

// --- 3. LÓGICA DE CREAR FACTURA (COMPLETA) ---
const handleCreateInvoiceLogic = (params) => {
  // Referencias DOM
  const itemsContainer = document.getElementById("items-container");
  const btnAddItem = document.getElementById("btn-add-item");
  const previewModal = document.getElementById("preview-modal");
  const btnClosePreview = document.getElementById("btn-close-preview");
  const btnEditMode = document.getElementById("btn-edit-mode");
  const btnConfirm = document.getElementById("btn-confirm-invoice");
  const previewBackdrop = document.getElementById("preview-backdrop");
  
  const clientSelect = document.querySelector("select[name='client']");
  const dateIssuedInput = document.querySelector("input[name='date_issued']");
  const dateDueInput = document.querySelector("input[name='date_due']");
  const taxToggle = document.getElementById("tax-toggle");

  const btnInvoice = document.getElementById("btn-mode-invoice");
  const btnQuote = document.getElementById("btn-mode-quote");

  // Estado Local
  let currentDocType = params && params.mode === 'quote' ? "COTIZACION" : "FACTURA";

  // --- DEFINICIÓN DE FUNCIONES INTERNAS ---

  const updateDocTypeUI = (type) => {
      currentDocType = type;
      const activeClass = ["bg-white", "text-blue-600", "shadow-sm"];
      const inactiveClass = ["text-gray-500"];

      if (type === "FACTURA") {
          btnInvoice?.classList.add(...activeClass);
          btnInvoice?.classList.remove(...inactiveClass);
          btnQuote?.classList.remove(...activeClass);
          btnQuote?.classList.add(...inactiveClass);
      } else {
          btnQuote?.classList.add(...activeClass);
          btnQuote?.classList.remove(...inactiveClass);
          btnInvoice?.classList.remove(...activeClass);
          btnInvoice?.classList.add(...inactiveClass);
      }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    const items = [];

    document.querySelectorAll(".item-row").forEach((row) => {
      const desc = row.querySelector(".item-desc").value;
      const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
      const price = parseFloat(row.querySelector(".item-price").value) || 0;
      const totalRow = qty * price;
      
      subtotal += totalRow;

      if (desc && qty > 0) {
        items.push({ description: desc, quantity: qty, unit_price: price, total_row: totalRow });
      }
    });

    const applyTax = taxToggle?.checked ?? false;
    const tax = applyTax ? subtotal * 0.16 : 0;
    const total = subtotal + tax;

    document.getElementById("form-subtotal").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("form-tax").innerText = `$${tax.toFixed(2)}`;
    document.getElementById("form-total").innerText = `$${total.toFixed(2)}`;

    return { subtotal, tax, total, items, applyTax };
  };

  const createRow = () => {
    const row = document.createElement("div");
    row.className = "grid grid-cols-12 gap-3 items-center item-row animate-fade-in mb-2";
    row.innerHTML = `
        <div class="col-span-6 md:col-span-5"><input type="text" placeholder="Descripción..." class="item-desc w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"></div>
        <div class="col-span-2 md:col-span-2"><input type="number" min="1" value="1" class="item-qty w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-center outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"></div>
        <div class="col-span-3 md:col-span-3"><input type="number" min="0" step="0.01" placeholder="0.00" class="item-price w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-right outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"></div>
        <div class="col-span-1 md:col-span-2 flex justify-center"><button class="btn-remove-item text-gray-400 hover:text-red-500 p-2 transition-colors"><i class="ri-delete-bin-line"></i></button></div>
    `;

    row.querySelectorAll("input").forEach((i) => i.addEventListener("input", calculateTotals));
    row.querySelector(".btn-remove-item").addEventListener("click", () => {
      row.remove();
      calculateTotals();
    });

    itemsContainer.appendChild(row);
  };

  const openPreview = () => {
    const { subtotal, tax, total, items } = calculateTotals();
    
    if (!clientSelect.value) return alert("Por favor selecciona un cliente.");
    if (!dateIssuedInput.value) return alert("La fecha de emisión es obligatoria.");

    // Formato de fechas
    const [yIssue, mIssue, dIssue] = dateIssuedInput.value.split('-').map(Number);
    const issueDateObj = new Date(yIssue, mIssue - 1, dIssue);
    const [yDue, mDue, dDue] = dateDueInput.value.split('-').map(Number);
    const dueDateObj = new Date(yDue, mDue - 1, dDue);
    const dateOpts = { year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById("paper-type").innerText = currentDocType;
    document.getElementById("paper-client").innerText = clientSelect.options[clientSelect.selectedIndex].text;
    document.getElementById("paper-date").innerText = issueDateObj.toLocaleDateString('es-ES', dateOpts);
    document.getElementById("paper-due").innerText = dueDateObj.toLocaleDateString('es-ES', dateOpts);

    const tbody = document.getElementById("paper-items-body");
    if(items.length === 0){
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-gray-400">Sin ítems</td></tr>`;
    } else {
        tbody.innerHTML = items.map(item => `
            <tr>
                <td class="py-2 text-gray-800 border-b border-gray-50">${item.description}</td>
                <td class="py-2 text-right text-gray-600 border-b border-gray-50">${item.quantity}</td>
                <td class="py-2 text-right text-gray-600 border-b border-gray-50">$${item.unit_price.toFixed(2)}</td>
                <td class="py-2 text-right font-medium text-gray-800 border-b border-gray-50">$${item.total_row.toFixed(2)}</td>
            </tr>
        `).join("");
    }

    document.getElementById("paper-subtotal").innerText = `$${subtotal.toFixed(2)}`;
    
    const paperTaxRow = document.getElementById("paper-tax-row");
    if(paperTaxRow) {
        if (tax > 0) {
            paperTaxRow.style.display = "flex";
            document.getElementById("paper-tax").innerText = `$${tax.toFixed(2)}`;
        } else {
            paperTaxRow.style.display = "none";
        }
    }

    document.getElementById("paper-total-bottom").innerText = `$${total.toFixed(2)}`;
    
    // Verificamos si existe el elemento antes de escribir (Corrección del error anterior)
    const totalTop = document.getElementById("paper-total-top");
    if (totalTop) totalTop.innerText = `$${total.toFixed(2)}`;

    previewModal.classList.remove("opacity-0", "pointer-events-none");
    previewModal.querySelector("#preview-content").classList.remove("scale-95");
    previewModal.querySelector("#preview-content").classList.add("scale-100");
  };

  const closePreview = () => {
    previewModal.classList.add("opacity-0", "pointer-events-none");
    previewModal.querySelector("#preview-content").classList.add("scale-95");
    previewModal.querySelector("#preview-content").classList.remove("scale-100");
  };

  // --- EJECUCIÓN INICIAL ---
  updateDocTypeUI(currentDocType);
  createRow();

  // Listeners
  btnAddItem?.addEventListener("click", createRow);
  taxToggle?.addEventListener("change", calculateTotals);
  btnInvoice?.addEventListener("click", (e) => { e.preventDefault(); updateDocTypeUI("FACTURA"); });
  btnQuote?.addEventListener("click", (e) => { e.preventDefault(); updateDocTypeUI("COTIZACION"); });

  document.getElementById("btn-open-preview")?.addEventListener("click", openPreview);
  document.getElementById("btn-mobile-preview")?.addEventListener("click", openPreview);
  btnClosePreview?.addEventListener("click", closePreview);
  btnEditMode?.addEventListener("click", closePreview);
  previewBackdrop?.addEventListener("click", closePreview);

  // --- SUBMIT (Guardado en 2 Pasos) ---
  btnConfirm?.addEventListener("click", async () => {
    const btnText = document.getElementById("btn-text-confirm");
    const originalText = btnText.innerText;
    
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
        alert("Tu sesión ha expirado.");
        return handleLogout();
    }

    const { total, items } = calculateTotals();
    const fullInvoiceObject = {
      client_id: parseInt(clientSelect.value),
      created_by_user_id: parseInt(currentUserId),
      invoice_type: currentDocType,
      invoice_status: "PENDIENTE",
      total_amount: total,
      invoice_date: dateIssuedInput.value, 
      due_date: dateDueInput.value,
      items: items,
    };

    try {
      btnText.innerText = "Procesando...";
      btnConfirm.disabled = true;

      // 1. Crear Cabecera
      const resInvoice = await fetch("http://localhost:3000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: fullInvoiceObject.client_id,
          created_by_user_id: fullInvoiceObject.created_by_user_id,
          invoice_type: fullInvoiceObject.invoice_type,
          invoice_status: fullInvoiceObject.invoice_status,
          total_amount: fullInvoiceObject.total_amount,
          invoice_date: fullInvoiceObject.invoice_date,
          due_date: fullInvoiceObject.due_date
        }),
      });

      if (!resInvoice.ok) throw new Error("Error al crear la cabecera.");
      
      const responseData = await resInvoice.json();
      const newInvoiceId = responseData.id;

      // 2. Crear Detalles
      for (const item of items) {
        await fetch("http://localhost:3000/api/invoice_details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            invoice_id: newInvoiceId,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
          }),
        });
      }

      // 3. Webhook
      fullInvoiceObject.invoice_id = newInvoiceId;
      await fetch('https://n8n.srv1278121.hstgr.cloud/webhook-test/b0df5e30-0447-444a-bcfc-d05c78750870', {
        method: 'POST',
        body: JSON.stringify(fullInvoiceObject)
      }).catch(e => console.warn(e));

      alert(`${currentDocType} #${newInvoiceId} creada exitosamente.`);
      window.navigateTo("dashboard");

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      btnText.innerText = originalText;
      btnConfirm.disabled = false;
    }
  });
};

// --- 4. LÓGICA DE CLIENTES ---
const handleClientsLogic = () => {
    const modal = document.getElementById("client-modal");
    const modalContent = document.getElementById("modal-content");
    const form = document.getElementById("client-form");
    const modalTitle = document.getElementById("modal-title");
    const btnSave = document.getElementById("btn-save-client");
    const searchInputs = [document.getElementById("client-search-desktop"), document.getElementById("client-search-mobile")];

    const openModal = (isEdit = false) => {
        modal.classList.add("modal-open");
        modalContent.classList.add("modal-content-open");
        if (!isEdit) {
            form.reset();
            document.getElementById("client-id-field").value = "";
            modalTitle.innerText = "Nuevo Cliente";
            btnSave.innerHTML = "<span>Guardar Cliente</span>";
        }
    };

    const closeModal = () => {
        modal.classList.remove("modal-open");
        modalContent.classList.remove("modal-content-open");
        setTimeout(() => { form.reset(); }, 300);
    };

    document.getElementById("btn-open-modal")?.addEventListener("click", () => openModal(false));
    document.getElementById("mobile-add-btn")?.addEventListener("click", () => openModal(false));
    document.getElementById("btn-close-modal")?.addEventListener("click", closeModal);
    document.getElementById("btn-cancel-modal")?.addEventListener("click", closeModal);
    document.getElementById("modal-backdrop")?.addEventListener("click", closeModal);

    document.querySelectorAll(".btn-edit-client").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const data = JSON.parse(btn.dataset.client);
            form.elements["client_name"].value = data.client_name;
            form.elements["client_document_id"].value = data.client_document_id;
            form.elements["client_address"].value = data.client_address;
            form.elements["client_phone"].value = data.client_phone;
            form.elements["id"].value = data.client_id;
            
            modalTitle.innerText = "Editar Cliente";
            btnSave.innerHTML = "<span>Actualizar</span>";
            openModal(true);
        });
    });

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const originalText = btnSave.innerHTML;
        const formData = new FormData(form);
        const id = formData.get("id");
        
        btnSave.innerHTML = "Procesando...";
        btnSave.disabled = true;

        try {
            const url = id ? `http://localhost:3000/api/clients/${id}` : "http://localhost:3000/api/clients";
            const method = id ? "PUT" : "POST";
            
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (res.ok) {
                closeModal();
                window.navigateTo("clients");
            } else {
                alert("Error al guardar");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            btnSave.innerHTML = originalText;
            btnSave.disabled = false;
        }
    });

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll(".crud-row").forEach(row => {
            const txt = row.innerText.toLowerCase();
            row.style.display = txt.includes(term) ? "flex" : "none";
        });
    };
    searchInputs.forEach(input => input?.addEventListener("input", handleSearch));
};

// --- 5. LÓGICA DASHBOARD ---
const handleDashboardLogic = () => {
    const inputs = [document.getElementById("mobile-search-input"), document.getElementById("desktop-search-input")];
    const goToCreate = () => window.navigateTo("create");
    
    document.getElementById("desktop-create-btn")?.addEventListener("click", goToCreate);
    document.getElementById("mobile-create-btn")?.addEventListener("click", goToCreate);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll(".crud-row").forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
        });
    };
    inputs.forEach(i => i?.addEventListener("keyup", handleSearch));
};

// --- 6. LÓGICA HOME ---
const handleHomeLogic = () => {
    document.getElementById("home-create-inv")?.addEventListener("click", () => window.navigateTo("create", { mode: "invoice" }));
    document.getElementById("home-create-quote")?.addEventListener("click", () => window.navigateTo("create", { mode: "quote" }));
    document.getElementById("month-filter")?.addEventListener("change", (e) => console.log("Filtro:", e.target.value));
};

// --- 7. LÓGICA PRODUCTOS ---
const handleProductsLogic = () => {
    const drawer = document.getElementById("product-drawer");
    const open = () => drawer.classList.add("open");
    const close = () => drawer.classList.remove("open");
    document.getElementById("desktop-add-prod")?.addEventListener("click", open);
    document.getElementById("mobile-add-prod")?.addEventListener("click", open);
    document.getElementById("close-drawer-btn")?.addEventListener("click", close);
    drawer?.addEventListener("click", (e) => { if(e.target === drawer) close(); });
};


// --- INICIALIZACIÓN ---
const token = localStorage.getItem("authToken");
if (token) {
  window.navigateTo("home");
} else {
  app.innerHTML = routes.login();
  setupListeners("login");
}