import { LoginLayout } from "./components/layouts/LoginLayout";
import { CrudLayout } from "./components/layouts/CrudLayout";
import { InvoiceLayout } from "./components/layouts/InvoiceLayout";
import { HomeLayout } from "./components/layouts/HomeLayout";
import "./style.css";
import { ProductLayout } from "./components/layouts/ProductLayout";
import { ClientsLayout } from "./components/layouts/ClientsLayout";
import { ProfileLayout } from "./components/layouts/ProfileLayout";

const app = document.querySelector("#app");

const routes = {
  login: LoginLayout,
  home: HomeLayout,
  dashboard: CrudLayout, // Facturas
  create: InvoiceLayout,
  products: ProductLayout,
  clients: ClientsLayout,
  config: ProfileLayout,
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
    case "config":
      handleProfileLogic();
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
    const dateOpts = { year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById("paper-type").innerText = "SUMINISTROS DEPOMED";
    document.getElementById("paper-client").innerText = clientSelect.options[clientSelect.selectedIndex].text;
    document.getElementById("paper-date").innerText = issueDateObj.toLocaleDateString('es-ES', dateOpts);
    
    // Generar un control no. dummy para el preview
    document.getElementById("paper-control-no").innerText = `CONTROL: 00-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`;
    document.getElementById("paper-invoice-id").innerText = "BORRADOR";

    const tbody = document.getElementById("paper-items-body");
    if(items.length === 0){
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-400">Sin ítems</td></tr>`;
    } else {
        tbody.innerHTML = items.map(item => `
            <tr>
                <td class="py-2 pl-4 text-gray-800 border-b border-gray-50">${item.quantity}</td>
                <td class="py-2 text-gray-600 border-b border-gray-50">-</td>
                <td class="py-2 text-gray-800 border-b border-gray-50">${item.description}</td>
                <td class="py-2 text-right text-gray-600 border-b border-gray-50">$${item.unit_price.toFixed(2)}</td>
                <td class="py-2 text-right font-medium text-gray-800 border-b border-gray-50 pr-4">$${item.total_row.toFixed(2)}</td>
            </tr>
        `).join("");
    }

    document.getElementById("paper-subtotal").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("paper-tax").innerText = `$${tax.toFixed(2)}`;
    document.getElementById("paper-total-bottom").innerText = `$${total.toFixed(2)}`;

    previewModal.classList.remove("opacity-0", "pointer-events-none");
    previewModal.querySelector("#preview-content").classList.remove("scale-95");
    previewModal.querySelector("#preview-content").classList.add("scale-100");
  };

  const closePreview = () => {
    previewModal.classList.add("opacity-0", "pointer-events-none");
    previewModal.querySelector("#preview-content").classList.add("scale-95");
    previewModal.querySelector("#preview-content").classList.remove("scale-100");
  };

  const handleExportExcel = async (customId = null) => {
    const { subtotal, tax, total, items } = calculateTotals();
    const clientName = clientSelect.options[clientSelect.selectedIndex].text;
    
    const payload = {
        invoice_id: customId || 'BORRADOR',
        invoice_date: dateIssuedInput.value,
        client_name: clientName,
        items: items,
        subtotal: subtotal,
        tax: tax,
        total_amount: total
    };

    try {
        const btnExport = document.getElementById("btn-export-excel");
        if (btnExport) {
            btnExport.disabled = true;
            btnExport.classList.add("opacity-50");
        }

        const response = await fetch("http://localhost:3000/api/export-excel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Error al generar Excel");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Factura_${clientName.replace(/\s+/g, '_')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        if (btnExport) {
            btnExport.disabled = false;
            btnExport.classList.remove("opacity-50");
        }
    } catch (error) {
        console.error(error);
    }
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
  document.getElementById("btn-export-excel")?.addEventListener("click", () => handleExportExcel());

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

      // 3. Descargar Excel Automáticamente
      await handleExportExcel(newInvoiceId);

      alert(`${currentDocType} #${newInvoiceId} creada exitosamente y descargada.`);
      window.navigateTo("dashboard");

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      btnText.innerText = originalText;
      btnConfirm.disabled = false;
    }
  });

  // --- Quick Client Creation Logic ---
  const quickModal = document.getElementById("quick-client-modal");
  const quickBackdrop = document.getElementById("quick-client-backdrop");
  const btnQuickAdd = document.getElementById("btn-quick-add-client");
  const btnCancelQuick = document.getElementById("btn-cancel-quick");
  const quickForm = document.getElementById("quick-client-form");

  const closeQuickModal = () => {
      quickModal.classList.remove("opacity-100", "pointer-events-auto");
      quickModal.classList.add("opacity-0", "pointer-events-none");
      quickModal.querySelector("div[class*='transform']").classList.remove("scale-100");
      quickModal.querySelector("div[class*='transform']").classList.add("scale-95");
      quickForm.reset();
  };

  const openQuickModal = () => {
      quickModal.classList.remove("opacity-0", "pointer-events-none");
      quickModal.classList.add("opacity-100", "pointer-events-auto");
      quickModal.querySelector("div[class*='transform']").classList.remove("scale-95");
      quickModal.querySelector("div[class*='transform']").classList.add("scale-100");
  };

  btnQuickAdd?.addEventListener("click", (e) => { e.preventDefault(); openQuickModal(); });
  btnCancelQuick?.addEventListener("click", closeQuickModal);
  quickBackdrop?.addEventListener("click", closeQuickModal);

  quickForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const saveBtn = quickForm.querySelector("button[type='submit']");
      const originalText = saveBtn.innerText;
      
      const formData = new FormData(quickForm);
      const payload = {
          client_name: formData.get("quick_name"),
          client_document_id: formData.get("quick_id"),
          client_address: "Dirección Pendiente",
          client_phone: "0000000000",
          is_active: 1
      };

      try {
          saveBtn.innerText = "Guardando...";
          saveBtn.disabled = true;

          const res = await fetch("http://localhost:3000/api/clients", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
          });

          if(res.ok) {
              const newClient = await res.json();
              
              // Recargar clientes y seleccionar el nuevo
              const resClients = await fetch('http://localhost:3000/api/clients');
              const clients = await resClients.json();
              
              // Reconstruir opciones
              // Nota: Se asume que el backend devuelve { id: ... } para el nuevo cliente.
              // Ajustar si la respuesta es diferente.
              
              clientSelect.innerHTML = '<option value="">Seleccionar Cliente...</option>';
              clients.forEach(c => {
                   if(c.is_active !== 0) {
                       const opt = document.createElement("option");
                       opt.value = c.client_id;
                       opt.text = c.client_name;
                       if(c.client_id === newClient.id) opt.selected = true; 
                       clientSelect.appendChild(opt);
                   }
              });
              
              // Si el ID devuelto es diferente al client_id (a veces pasa en INSERTs), buscamos el último
              if(!newClient.id) {
                   clientSelect.lastElementChild.selected = true;
              }

              closeQuickModal();
          } else {
              alert("Error al crear cliente");
          }

      } catch (error) {
          console.error(error);
          alert("Error de conexión");
      } finally {
          saveBtn.innerText = originalText;
          saveBtn.disabled = false;
      }
  });
};

// --- 4. LÓGICA DE CLIENTES ---
const handleClientsLogic = async () => {
    let clients = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    const clientsList = document.getElementById("clients-list");
    
    // --- Render Logic ---
    const renderTable = (page = 1, filterText = "") => {
        currentPage = page;
        
        let filtered = clients;
        if(filterText) {
            const lowerFilter = filterText.toLowerCase();
            filtered = clients.filter(c => 
                c.client_name.toLowerCase().includes(lowerFilter) ||
                (c.client_document_id || "").includes(lowerFilter)
            );
        }

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

        // Update List
        if (paginatedItems.length === 0) {
            clientsList.innerHTML = '<div class="flex flex-col items-center justify-center p-12 text-center text-gray-400"><i class="ri-user-unfollow-line text-4xl mb-2"></i><p>No se encontraron clientes</p></div>';
        } else {
            const rowsHTML = paginatedItems.map(c => {
                const clientJson = JSON.stringify(c).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
                return `
                <div class="md:crud-row transition-all hover:bg-gray-50 border-b border-gray-100 last:border-0 flex flex-col md:grid md:grid-cols-12 gap-2 p-4 animate-slide-up">
                    <div class="md:col-span-3 flex justify-between md:block">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Nombre</span>
                        <span class="font-bold text-gray-700">${c.client_name}</span>
                    </div>
                    <div class="md:col-span-2 flex justify-between md:block">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">ID Fiscal</span>
                         <span class="text-sm text-gray-600">${c.client_document_id || '-'}</span>
                    </div>
                    <div class="md:col-span-3 flex justify-between md:block">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Dirección</span>
                        <span class="text-sm text-gray-500 truncate block" title="${c.client_address}">${c.client_address}</span>
                    </div>
                    <div class="md:col-span-2 flex justify-between md:block">
                         <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Teléfono</span>
                        <span class="text-sm text-gray-500">${c.client_phone}</span>
                    </div>
                    <div class="md:col-span-2 flex justify-end items-center gap-2 mt-2 md:mt-0 border-t md:border-t-0 border-gray-50 pt-2 md:pt-0">
                        <button class="btn-edit-client w-8 h-8 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors flex items-center justify-center" data-client='${clientJson}'>
                            <i class="ri-pencil-line"></i>
                        </button>
                        <button class="btn-delete-client w-8 h-8 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center" data-id="${c.client_id}">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </div>`;
            }).join('');
            clientsList.innerHTML = rowsHTML;
        }

        // Update Pagination Controls
        document.getElementById("page-start").textContent = totalItems === 0 ? 0 : startIndex + 1;
        document.getElementById("page-end").textContent = Math.min(startIndex + itemsPerPage, totalItems);
        document.getElementById("total-items").textContent = totalItems;
        document.getElementById("page-indicator").textContent = `Página ${currentPage}`;
        
        const btnPrev = document.getElementById("btn-prev");
        const btnNext = document.getElementById("btn-next");
        const btnPrevMob = document.getElementById("btn-prev-mobile");
        const btnNextMob = document.getElementById("btn-next-mobile");
        const isFirst = currentPage === 1;
        const isLast = currentPage === totalPages;

        [btnPrev, btnPrevMob].forEach(b => b && (b.disabled = isFirst, b.classList.toggle("opacity-50", isFirst)));
        [btnNext, btnNextMob].forEach(b => b && (b.disabled = isLast, b.classList.toggle("opacity-50", isLast)));

        // Re-attach listeners
        attachRowListeners();
    };

    const attachRowListeners = () => {
         // --- DELETE LOGIC ---
        document.querySelectorAll(".btn-delete-client").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                if(!confirm("¿Estás seguro de eliminar este cliente?")) return;
                
                const id = btn.dataset.id;
                try {
                    const res = await fetch(`http://localhost:3000/api/clients/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ is_active: 0 })
                    });
    
                    if(res.ok) {
                        // Refresh data
                        fetchClients();
                    } else {
                        alert("Error al eliminar cliente");
                    }
                } catch(error) {
                    console.error(error);
                    alert("Error de conexión");
                }
            });
        });

        // --- EDIT LOGIC ---
        document.querySelectorAll(".btn-edit-client").forEach(btn => {
            btn.addEventListener("click", () => {
                const client = JSON.parse(btn.dataset.client);
                document.getElementById("client-id-field").value = client.client_id;
                document.querySelector("[name='client_name']").value = client.client_name;
                document.querySelector("[name='client_document_id']").value = client.client_document_id;
                document.querySelector("[name='client_phone']").value = client.client_phone;
                document.querySelector("[name='client_address']").value = client.client_address;
                
                document.getElementById("modal-title").innerText = "Editar Cliente";
                openModal();
            });
        });
    };

    const fetchClients = async () => {
         try {
             const res = await fetch('http://localhost:3000/api/clients');
             clients = (await res.json()).filter(c => c.is_active !== 0);
             renderTable(currentPage);
         } catch(e) { console.error(e); }
    };
    
    // Initial Fetch
    fetchClients();

    // --- Search & Page Events ---
    const searchInputs = [document.getElementById("client-search-desktop"), document.getElementById("client-search-mobile")];
    searchInputs.forEach(input => {
        input?.addEventListener("input", (e) => {
            renderTable(1, e.target.value);
        });
    });

    const handlePageChange = (delta) => {
        const currentSearch = searchInputs.find(i => i && i.offsetParent !== null)?.value || "";
        renderTable(currentPage + delta, currentSearch);
    };

    document.getElementById("btn-prev")?.addEventListener("click", () => handlePageChange(-1));
    document.getElementById("btn-next")?.addEventListener("click", () => handlePageChange(1));
    document.getElementById("btn-prev-mobile")?.addEventListener("click", () => handlePageChange(-1));
    document.getElementById("btn-next-mobile")?.addEventListener("click", () => handlePageChange(1));

    // --- MODAL LOGIC (Existing reduced) ---
    const modal = document.getElementById("client-modal");
    const openBtn = document.getElementById("btn-open-modal");
    const mobileAddBtn = document.getElementById("mobile-add-btn");
    const closeBtn = document.getElementById("btn-close-modal");
    const cancelBtn = document.getElementById("btn-cancel-modal");
    const backdrop = document.getElementById("modal-backdrop");
    const form = document.getElementById("client-form");

    const openModal = () => {
        modal.classList.remove("opacity-0", "pointer-events-none");
        modal.classList.add("opacity-100", "pointer-events-auto");
        modal.querySelector("#modal-content").classList.remove("scale-95");
        modal.querySelector("#modal-content").classList.add("scale-100");
    };

    const closeModal = () => {
        modal.classList.remove("opacity-100", "pointer-events-auto");
        modal.classList.add("opacity-0", "pointer-events-none");
        modal.querySelector("#modal-content").classList.remove("scale-100");
        modal.querySelector("#modal-content").classList.add("scale-95");
        setTimeout(() => {
            form.reset();
            document.getElementById("client-id-field").value = "";
            document.getElementById("modal-title").innerText = "Nuevo Cliente";
        }, 300);
    };

    openBtn?.addEventListener("click", openModal);
    mobileAddBtn?.addEventListener("click", openModal);
    closeBtn?.addEventListener("click", closeModal);
    cancelBtn?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", closeModal);

    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const id = formData.get("id");
        
        const payload = {
            client_name: formData.get("client_name"),
            client_document_id: formData.get("client_document_id"),
            client_address: formData.get("client_address"),
            client_phone: formData.get("client_phone"),
            is_active: 1
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:3000/api/clients/${id}` : 'http://localhost:3000/api/clients';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if(res.ok) {
                closeModal();
                fetchClients(); // Refresh list logic
            } else {
                alert("Error al guardar");
            }
        } catch(error) {
            console.error(error);
            alert("Error de conexión");
        }
    });

    /* REMOVED OLD LOGIC
    document.querySelectorAll(".btn-delete-client").forEach((btn) => {
        ...
    });
    const inputs = [...] ...
    */
};


// --- 5. LÓGICA DASHBOARD ---
const handleDashboardLogic = async () => {
    let invoices = [];
    let clients = [];
    let clientMap = {};
    
    // Pagination State
    let currentPage = 1;
    const itemsPerPage = 10;
    
    // Elements
    const invoicesList = document.getElementById("invoices-list");

    // --- Helpers ---
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const getStatusBadge = (status) => {
        const s = status?.toUpperCase() || "PENDIENTE";
        const styles = {
            'PAGADA': 'bg-green-100 text-green-700 border border-green-200',
            'PENDIENTE': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            'ANULADA': 'bg-red-50 text-red-700 border border-red-200'
        };
        const className = styles[s] || styles['PENDIENTE'];
        return `<span class="px-2 py-1 rounded-md text-xs font-bold ${className}">${s}</span>`;
    };

    // --- Render Logic ---
    const renderTable = (page = 1, filterText = "") => {
        currentPage = page;
        
        let filtered = invoices;
        if(filterText) {
            const lowerFilter = filterText.toLowerCase();
            filtered = invoices.filter(inv => {
                const clientName = clientMap[inv.client_id]?.toLowerCase() || "";
                return (
                    inv.invoice_id.toString().includes(lowerFilter) ||
                    clientName.includes(lowerFilter) ||
                    inv.invoice_status.toLowerCase().includes(lowerFilter)
                );
            });
        }

        const totalItems = filtered.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        
        // Ensure page is valid
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);

        // Update List
        if (paginatedItems.length === 0) {
            invoicesList.innerHTML = `
                <div class="flex flex-col items-center justify-center p-12 text-center">
                    <div class="bg-gray-50 p-4 rounded-full mb-3">
                        <i class="ri-file-list-3-line text-3xl text-gray-300"></i>
                    </div>
                    <p class="text-gray-500 font-medium">No se encontraron facturas</p>
                </div>`;
        } else {
            const rowsHTML = paginatedItems.map((inv, index) => {
                const clientName = clientMap[inv.client_id] || `Cliente Desconocido (${inv.client_id})`;
                const delay = index * 0.05;

                return `
                <div class="crud-row transition-all hover:bg-gray-50 border-b border-gray-100 last:border-0 flex flex-col md:grid md:grid-cols-6 md:items-center gap-2 p-4 animate-slide-up" style="animation-delay: ${delay}s">
                    <div class="md:col-span-1 flex justify-between md:block">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Documento</span>
                        <div class="flex flex-col">
                            <span class="font-bold text-gray-800">#${inv.invoice_id.toString().padStart(4, '0')}</span>
                            <span class="text-xs text-gray-400 uppercase tracking-wider">${inv.invoice_type}</span>
                        </div>
                    </div>
                    <div class="md:col-span-1 flex justify-between md:block">
                         <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Cliente</span>
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-bold">
                                ${clientName.charAt(0).toUpperCase()}
                            </div>
                            <span class="font-medium text-gray-700 truncate max-w-[150px]" title="${clientName}">${clientName}</span>
                        </div>
                    </div>
                    <div class="md:col-span-1 flex justify-between md:block">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Fecha</span>
                        <span class="text-sm text-gray-500">${formatDate(inv.invoice_date)}</span>
                    </div>
                    <div class="md:col-span-1 flex justify-between md:block">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Estado</span>
                        <div>${getStatusBadge(inv.invoice_status)}</div>
                    </div>
                    <div class="md:col-span-1 flex justify-between md:block">
                        <span class="md:hidden text-xs font-bold text-gray-400 uppercase">Total</span>
                        <span class="font-bold text-gray-800">${formatCurrency(inv.total_amount)}</span>
                    </div>
                    <div class="md:col-span-1 flex justify-end gap-2 mt-2 md:mt-0">
                        <button class="btn-view-invoice w-8 h-8 rounded-full hover:bg-blue-50 text-blue-500 transition-colors flex items-center justify-center" title="Ver Detalles" 
                            data-invoice_id="${inv.invoice_id}"
                            data-client="${clientName}" 
                            data-date="${formatDate(inv.invoice_date)}" 
                            data-total="${formatCurrency(inv.total_amount)}" 
                            data-status="${inv.invoice_status}">
                            <i class="ri-eye-line"></i>
                        </button>
                    </div>
                </div>`;
            }).join('');
            invoicesList.innerHTML = rowsHTML;
        }

        // Update Pagination Controls
        document.getElementById("page-start").textContent = totalItems === 0 ? 0 : startIndex + 1;
        document.getElementById("page-end").textContent = Math.min(startIndex + itemsPerPage, totalItems);
        document.getElementById("total-items").textContent = totalItems;
        document.getElementById("page-indicator").textContent = `Página ${currentPage}`;
        
        const btnPrev = document.getElementById("btn-prev");
        const btnNext = document.getElementById("btn-next");
        const btnPrevMob = document.getElementById("btn-prev-mobile");
        const btnNextMob = document.getElementById("btn-next-mobile");

        const isFirst = currentPage === 1;
        const isLast = currentPage === totalPages;

        [btnPrev, btnPrevMob].forEach(b => b && (b.disabled = isFirst, b.classList.toggle("opacity-50", isFirst)));
        [btnNext, btnNextMob].forEach(b => b && (b.disabled = isLast, b.classList.toggle("opacity-50", isLast)));

        // Re-attach listeners for new buttons
        document.querySelectorAll(".btn-view-invoice").forEach(btn => {
            btn.addEventListener("click", () => openModal(btn));
        });
    };

    // --- Init Fetch ---
    try {
        const [invoicesRes, clientsRes] = await Promise.all([
            fetch('http://localhost:3000/api/invoices'),
            fetch('http://localhost:3000/api/clients')
        ]);
        invoices = await invoicesRes.json();
        const allClients = await clientsRes.json();
        clients = allClients;
        allClients.forEach(c => clientMap[c.client_id] = c.client_name);
        
        renderTable(1);
    } catch (error) {
         console.error(error);
         invoicesList.innerHTML = '<p class="text-center text-red-500 p-4">Error cargando datos</p>';
    }

    // --- Events ---
    const searchInput = document.getElementById("search-input");
    searchInput?.addEventListener("input", (e) => {
        renderTable(1, e.target.value);
    });

    const handlePageChange = (delta) => {
        renderTable(currentPage + delta, searchInput?.value || "");
    };

    document.getElementById("btn-prev")?.addEventListener("click", () => handlePageChange(-1));
    document.getElementById("btn-next")?.addEventListener("click", () => handlePageChange(1));
    document.getElementById("btn-prev-mobile")?.addEventListener("click", () => handlePageChange(-1));
    document.getElementById("btn-next-mobile")?.addEventListener("click", () => handlePageChange(1));
    
    // --- DETAILS MODAL Logic (Existing) ---
    const detailModal = document.getElementById("invoice-modal");
    const backdrop = document.getElementById("modal-backdrop-invoice");
    const closeBtn = document.getElementById("btn-close-invoice-modal");
    
    // Status Buttons
    const btnVoid = document.getElementById("btn-status-void");
    const btnPaid = document.getElementById("btn-status-paid");
    
    let currentInvoiceId = null;

    const closeModal = () => {
        detailModal.classList.remove("opacity-100", "pointer-events-auto");
        detailModal.classList.add("opacity-0", "pointer-events-none");
        detailModal.querySelector("div[class*='transform']").classList.remove("scale-100");
        detailModal.querySelector("div[class*='transform']").classList.add("scale-95");
    };

    const openModal = async (btn) => {
        const id = btn.dataset.invoice_id;
        currentInvoiceId = id;
        
        // Basic Info from dataset
        document.getElementById("modal-doc-type-title").innerText = btn.dataset.status === "COTIZACION" ? "COTIZACIÓN DIGITAL" : "FACTURA DIGITAL";
        document.getElementById("modal-control-no").innerText = `CONTROL: 00-${id.toString().padStart(5, '0')}`;
        document.getElementById("modal-invoice-id-display").innerText = id.toString().padStart(4,'0');
        document.getElementById("modal-client-name").innerText = btn.dataset.client;
        document.getElementById("modal-invoice-date-display").innerText = btn.dataset.date;
        
        // Update Totals (from dataset)
        document.getElementById("modal-invoice-total").innerText = btn.dataset.total;

        // Fetch Items
        const list = document.getElementById("modal-items-list");
        list.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-400"><i class="ri-loader-4-line animate-spin text-2xl"></i></td></tr>';

        try {
            const res = await fetch(`http://localhost:3000/api/invoice_details`);
            const allItems = await res.json();
            const items = allItems.filter(item => item.invoice_id == id);
            
            if(items.length === 0) {
                 list.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-400">Sin detalles</td></tr>';
            } else {
                let subtotalValue = 0;
                list.innerHTML = items?.map(item => {
                    const rowTotal = item.quantity * item.unit_price;
                    subtotalValue += rowTotal;
                    return `
                    <tr>
                        <td class="py-2 pl-4 text-gray-800 border-b border-gray-50 text-center">${item.quantity}</td>
                        <td class="py-2 text-gray-600 border-b border-gray-50 text-center">-</td>
                        <td class="py-2 text-gray-800 border-b border-gray-50">${item.description}</td>
                        <td class="py-2 text-right text-gray-600 border-b border-gray-50">$${item.unit_price.toFixed(2)}</td>
                        <td class="py-2 text-right font-medium text-gray-800 border-b border-gray-50 pr-4">$${rowTotal.toFixed(2)}</td>
                    </tr>
                `}).join('');

                // Update stylized totals
                document.getElementById("modal-subtotal").innerText = `$${subtotalValue.toFixed(2)}`;
                document.getElementById("modal-tax").innerText = `$${(subtotalValue * 0.16).toFixed(2)}`;
                document.getElementById("modal-invoice-total").innerText = `$${(subtotalValue * 1.16).toFixed(2)}`;
            }

            detailModal.classList.remove("opacity-0", "pointer-events-none");
            detailModal.classList.add("opacity-100", "pointer-events-auto");
            detailModal.querySelector("div[class*='transform']").classList.remove("scale-95");
            detailModal.querySelector("div[class*='transform']").classList.add("scale-100");

        } catch (error) {
            console.error(error);
            list.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Error cargando detalles</td></tr>';
        }
    };

    const updateStatus = async (newStatus) => {
        if(!currentInvoiceId) return;
        if(!confirm(`¿Cambiar estado a ${newStatus}?`)) return;

        try {
            const res = await fetch(`http://localhost:3000/api/invoices/${currentInvoiceId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoice_status: newStatus })
            });

            if(res.ok) {
                closeModal();
                // Refresh Page to see changes
                window.navigateTo("dashboard");
            } else {
                alert("Error actualizando estado");
            }
        } catch (e) {
            console.error(e);
            alert("Error de conexión");
        }
    };

    const handleExportFromCrud = async () => {
        if (!currentInvoiceId) return;

        // Necesitamos recolectar los datos para el export
        const btn = document.querySelector(`.btn-view-invoice[data-invoice_id="${currentInvoiceId}"]`);
        if (!btn) return;

        // Fetch de los items para tener la data completa
        try {
            const res = await fetch(`http://localhost:3000/api/invoice_details`);
            const allItems = await res.json();
            const items = allItems.filter(item => item.invoice_id == currentInvoiceId);
            
            const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
            
            const payload = {
                invoice_id: currentInvoiceId,
                invoice_date: btn.dataset.date,
                client_name: btn.dataset.client,
                items: items,
                subtotal: subtotal,
                tax: subtotal * 0.16,
                total_amount: subtotal * 1.16
            };

            const btnExport = document.getElementById("btn-export-excel-crud");
            const originalText = btnExport.innerHTML;
            btnExport.innerHTML = '<i class="ri-loader-4-line animate-spin"></i>...';
            btnExport.disabled = true;

            const response = await fetch("http://localhost:3000/api/export-excel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Error al generar Excel");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Factura_${btn.dataset.client.replace(/\s+/g, '_')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            btnExport.innerHTML = originalText;
            btnExport.disabled = false;
        } catch (error) {
            console.error(error);
            alert("Error al exportar");
        }
    };

    document.querySelectorAll(".btn-view-invoice").forEach(btn => 
        btn.addEventListener("click", () => openModal(btn))
    );

    backdrop?.addEventListener("click", closeModal);
    closeBtn?.addEventListener("click", closeModal);
    btnVoid?.addEventListener("click", () => updateStatus("ANULADA"));
    btnPaid?.addEventListener("click", () => updateStatus("PAGADA"));
    document.getElementById("btn-export-excel-crud")?.addEventListener("click", handleExportFromCrud);
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

// --- 8. LÓGICA CONFIGURACIÓN ---
const handleProfileLogic = () => {
    const form = document.getElementById("config-form");
    const saveBtn = document.getElementById("btn-save-config");
    
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        // Guardamos todo en localStorage como campos individuales para fácil acceso
        localStorage.setItem("config_company_name", form.elements["company_name"].value);
        localStorage.setItem("config_company_id", form.elements["company_id"].value);
        localStorage.setItem("config_company_address", form.elements["company_address"].value);
        localStorage.setItem("config_company_logo", form.elements["company_logo"].value);

        // Feedback visual
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="ri-check-line"></i> Guardado';
        saveBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
        saveBtn.classList.add("bg-green-600", "hover:bg-green-700");
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
            saveBtn.classList.remove("bg-green-600", "hover:bg-green-700");
        }, 2000);
    });
};


// --- INICIALIZACIÓN ---
const token = localStorage.getItem("authToken");
if (token) {
  window.navigateTo("home");
} else {
  app.innerHTML = routes.login();
  setupListeners("login");
}