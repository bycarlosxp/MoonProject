import { LoginLayout } from "./components/layouts/LoginLayout";
import { CrudLayout } from "./components/layouts/CrudLayout";
import { InvoiceLayout } from "./components/layouts/InvoiceLayout";
import { HomeLayout } from "./components/layouts/HomeLayout";
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

  setTimeout(async () => {
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
      if (id === "home") window.navigateTo("home");
      if (id === "dashboard") window.navigateTo("dashboard");
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
    const loginForm = document.getElementById("login-form");

    loginForm?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = e.target.querySelector("button");
      const originalText = btn.innerText;

      // 1. Obtener datos del formulario
      const formData = new FormData(loginForm);
      // Nota: En tu LoginLayout el input se llama "username", pero la API espera "email"
      const payload = {
        email: formData.get("username"),
        password: formData.get("password"),
      };

      // UI Feedback: Cargando
      btn.innerText = "Autenticando...";
      btn.disabled = true;
      btn.style.opacity = "0.7";

      try {
        // 2. Petición al Backend
        const response = await fetch("http://localhost:2020/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error en credenciales");
        }

        // 3. Guardar en LocalStorage (Vital para la creación de facturas)
        // Guardamos el ID suelto para fácil acceso
        localStorage.setItem("userId", data.user.id);
        // Guardamos el objeto usuario completo por si necesitamos el nombre
        localStorage.setItem("userData", JSON.stringify(data.user));
        // Guardamos el token para futuras peticiones protegidas
        localStorage.setItem("authToken", data.token);

        // UI Feedback: Éxito
        btn.innerText = "¡Éxito!";
        btn.style.backgroundColor = "#27ae60"; // Verde

        // 4. Redirigir
        setTimeout(() => {
          window.navigateTo("home");
        }, 500);
      } catch (error) {
        console.error(error);
        // UI Feedback: Error
        btn.innerText = "Error: Verifique datos";
        btn.style.backgroundColor = "#e74c3c"; // Rojo

        // Restaurar botón después de 2 segundos
        setTimeout(() => {
          btn.innerText = originalText;
          btn.disabled = false;
          btn.style.opacity = "1";
          btn.style.backgroundColor = ""; // Volver al color original (clase CSS)
        }, 2000);
      }
    });
  }

  if (route === "create") {
    // --- Referencias DOM ---
    const itemsContainer = document.getElementById("items-container");
    const btnAddItem = document.getElementById("btn-add-item");
    const previewModal = document.getElementById("preview-modal");
    const btnClosePreview = document.getElementById("btn-close-preview");
    const btnEditMode = document.getElementById("btn-edit-mode");
    const btnConfirm = document.getElementById("btn-confirm-invoice"); // El botón importante

    // Referencias Inputs Header
    const clientSelect = document.querySelector("select[name='client']");
    const dateIssuedInput = document.querySelector("input[name='date_issued']");
    const dateDueInput = document.querySelector("input[name='date_due']");

    // Toggle Type
    let currentDocType = "FACTURA"; // Estado local

    // --- 1. GESTIÓN DE ÍTEMS ---
    const createRow = () => {
      const row = document.createElement("div");
      row.className =
        "grid grid-cols-12 gap-3 items-center item-row animate-fade-in mb-2";
      row.innerHTML = `
            <div class="col-span-6 md:col-span-5">
                <input type="text" placeholder="Descripción..." class="item-desc w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all">
            </div>
            <div class="col-span-2 md:col-span-2">
                <input type="number" min="1" value="1" class="item-qty w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-center outline-none focus:bg-white focus:ring-2 focus:ring-blue-100">
            </div>
            <div class="col-span-3 md:col-span-3">
                <input type="number" min="0" step="0.01" placeholder="0.00" class="item-price w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-right outline-none focus:bg-white focus:ring-2 focus:ring-blue-100">
            </div>
            <div class="col-span-1 md:col-span-2 flex justify-center">
                <button class="btn-remove-item text-gray-400 hover:text-red-500 p-2"><i class="ri-delete-bin-line"></i></button>
            </div>
        `;

      // Listeners para recálculo
      row
        .querySelectorAll("input")
        .forEach((i) => i.addEventListener("input", calculateTotals));
      row.querySelector(".btn-remove-item").addEventListener("click", () => {
        row.remove();
        calculateTotals();
      });
      itemsContainer.appendChild(row);
    };

    const calculateTotals = () => {
      let subtotal = 0;
      const items = [];

      document.querySelectorAll(".item-row").forEach((row) => {
        const desc = row.querySelector(".item-desc").value;
        const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
        const price = parseFloat(row.querySelector(".item-price").value) || 0;
        const total = qty * price;

        subtotal += total;

        // Guardamos datos limpios de cada fila
        if (desc && qty > 0) {
          items.push({
            description: desc,
            quantity: qty,
            unit_price: price,
            total_row: total,
          });
        }
      });

      const tax = subtotal * 0.16;
      const total = subtotal + tax;

      document.getElementById("form-subtotal").innerText = `$${subtotal.toFixed(
        2
      )}`;
      document.getElementById("form-tax").innerText = `$${tax.toFixed(2)}`;
      document.getElementById("form-total").innerText = `$${total.toFixed(2)}`;

      return { subtotal, tax, total, items };
    };

    // Iniciar con una fila vacía
    createRow();
    btnAddItem?.addEventListener("click", createRow);

    // --- 2. MODAL Y PREVISUALIZACIÓN ---
    const openPreview = () => {
      const { subtotal, tax, total, items } = calculateTotals();

      // Validar selección de cliente
      if (!clientSelect.value) {
        alert("Por favor selecciona un cliente");
        return;
      }

      const clientName = clientSelect.options[clientSelect.selectedIndex].text;

      // Rellenar Papel
      document.getElementById("paper-type").innerText = currentDocType;
      document.getElementById("paper-client").innerText = clientName;
      document.getElementById(
        "paper-date"
      ).innerText = `Fecha: ${dateIssuedInput.value}`;
      document.getElementById("paper-due").innerText = dateDueInput.value;

      // Renderizar Tabla Papel
      const tbody = document.getElementById("paper-items-body");
      tbody.innerHTML = items
        .map(
          (item) => `
            <tr>
                <td class="py-2 text-gray-800 border-b border-gray-50">${
                  item.description
                }</td>
                <td class="py-2 text-right text-gray-600 border-b border-gray-50">${
                  item.quantity
                }</td>
                <td class="py-2 text-right text-gray-600 border-b border-gray-50">$${item.unit_price.toFixed(
                  2
                )}</td>
                <td class="py-2 text-right font-medium text-gray-800 border-b border-gray-50">$${item.total_row.toFixed(
                  2
                )}</td>
            </tr>
        `
        )
        .join("");

      // Totales Papel
      document.getElementById(
        "paper-subtotal"
      ).innerText = `$${subtotal.toFixed(2)}`;
      document.getElementById("paper-tax").innerText = `$${tax.toFixed(2)}`;
      document.getElementById(
        "paper-total-bottom"
      ).innerText = `$${total.toFixed(2)}`;
      document.getElementById("paper-total-top").innerText = `$${total.toFixed(
        2
      )}`;

      // Mostrar Modal
      previewModal.classList.remove("opacity-0", "pointer-events-none");
      previewModal
        .querySelector("#preview-content")
        .classList.remove("scale-95");
      previewModal.querySelector("#preview-content").classList.add("scale-100");
    };

    const closePreview = () => {
      previewModal.classList.add("opacity-0", "pointer-events-none");
      previewModal.querySelector("#preview-content").classList.add("scale-95");
      previewModal
        .querySelector("#preview-content")
        .classList.remove("scale-100");
    };

    document
      .getElementById("btn-open-preview")
      ?.addEventListener("click", openPreview);
    document
      .getElementById("btn-mobile-preview")
      ?.addEventListener("click", openPreview);
    btnClosePreview?.addEventListener("click", closePreview);
    btnEditMode?.addEventListener("click", closePreview);
    document
      .getElementById("preview-backdrop")
      ?.addEventListener("click", closePreview);

    // --- 3. LÓGICA DE GUARDADO (DB + WEBHOOK) ---
    btnConfirm?.addEventListener("click", async () => {
      const btnText = document.getElementById("btn-text-confirm");
      const originalText = btnText.innerText;

      // 1. Recopilar Datos Finales
      const { total, items } = calculateTotals();
      const currentUserId = localStorage.getItem("userId");

      if (!currentUserId) {
        alert("Sesión expirada. Por favor inicie sesión nuevamente.");
        window.navigateTo("login");
        return;
      }
      // Objeto Maestro (Para Webhook y lógica interna)
      const fullInvoiceObject = {
        client_id: parseInt(clientSelect.value),
        created_by_user_id: parseInt(currentUserId), // HARDCODED: Deberías obtenerlo de localStorage o sesión
        invoice_type: currentDocType, // 'FACTURA' o 'COTIZACION'
        invoice_status: "PENDIENTE",
        total_amount: total,
        created_at: new Date().toISOString(), // Para el webhook
        items: items, // Array con detalles
      };

      console.log("Datos listos para enviar:", fullInvoiceObject);

      try {
        btnText.innerText = "Procesando...";
        btnConfirm.disabled = true;

        // A. ENVIAR CABECERA (Tabla `invoice`)
        const invoiceResponse = await fetch(
          "http://localhost:3000/api/invoices",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              client_id: fullInvoiceObject.client_id,
              created_by_user_id: fullInvoiceObject.created_by_user_id,
              invoice_type: fullInvoiceObject.invoice_type,
              invoice_status: fullInvoiceObject.invoice_status,
              total_amount: fullInvoiceObject.total_amount,
            }),
          }
        );

        if (!invoiceResponse.ok)
          throw new Error("Error creando factura cabecera");

        const invoiceResult = await invoiceResponse.json();
        const newInvoiceId = invoiceResult.id; // El ID generado por MySQL
        console.log("Factura creada ID:", newInvoiceId);

        // B. ENVIAR DETALLES (Tabla `invoice_details`)
        // Iteramos sobre los items y los enviamos uno por uno (o en lote si tu API lo soporta)
        for (const item of items) {
          await fetch("http://localhost:3000/api/invoice_details", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              invoice_id: newInvoiceId,
              description: item.description, // <--- CAMBIO CLAVE: Texto libre
              quantity: item.quantity,
              unit_price: item.unit_price,
            }),
          });
        }

        // C. ENVIAR A WEBHOOK (Con toda la data junta + el ID nuevo)
        fullInvoiceObject.invoice_id = newInvoiceId; // Agregamos el ID real

        // Simulación de Webhook (Descomenta y pon tu URL)
        /*
            await fetch('https://tu-webhook-url.com', {
                method: 'POST',
                body: JSON.stringify(fullInvoiceObject)
            });
            */

        alert(`Documento ${newInvoiceId} creado exitosamente`);
        window.navigateTo("dashboard"); // Redirigir al listado
      } catch (error) {
        console.error(error);
        alert("Error al procesar el documento: " + error.message);
      } finally {
        btnText.innerText = originalText;
        btnConfirm.disabled = false;
      }
    });

    // --- 4. TOGGLE TIPO DOCUMENTO ---
    const btnInvoice = document.getElementById("btn-mode-invoice");
    const btnQuote = document.getElementById("btn-mode-quote");

    const setMode = (mode) => {
      if (mode === "invoice") {
        currentDocType = "FACTURA";
        btnInvoice.classList.add("bg-white", "text-blue-600", "shadow-sm");
        btnInvoice.classList.remove("text-gray-500");
        btnQuote.classList.remove("bg-white", "text-blue-600", "shadow-sm");
        btnQuote.classList.add("text-gray-500");
      } else {
        currentDocType = "COTIZACION"; // O 'QUOTE' según tu Enum en BD
        btnQuote.classList.add("bg-white", "text-blue-600", "shadow-sm");
        btnQuote.classList.remove("text-gray-500");
        btnInvoice.classList.remove("bg-white", "text-blue-600", "shadow-sm");
        btnInvoice.classList.add("text-gray-500");
      }
    };

    btnInvoice?.addEventListener("click", () => setMode("invoice"));
    btnQuote?.addEventListener("click", () => setMode("quote"));
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
    // Referencias a inputs de búsqueda
    const inputs = [
      document.getElementById("mobile-search-input"),
      document.getElementById("desktop-search-input"),
    ];

    // Lógica de filtrado en vivo
    const handleSearch = (e) => {
      const term = e.target.value.toLowerCase();
      const rows = document.querySelectorAll(".crud-row");

      rows.forEach((row) => {
        // Obtenemos todo el texto visible de la fila (ID, Nombre Cliente, Estado, Fecha)
        const textContent = row.innerText.toLowerCase();

        // Si el término existe en el texto, mostramos, si no, ocultamos
        if (textContent.includes(term)) {
          // Restauramos el display según el tamaño de pantalla
          // Nota: Si usas la clase md:grid de Tailwind en el HTML, 
          // simplemente quitar 'none' permite que CSS tome el control
           row.style.display = ""; 
        } else {
          row.style.display = "none";
        }
      });
    };

    // Listeners de búsqueda
    inputs.forEach((input) => input?.addEventListener("keyup", handleSearch));

    // Navegación a Crear Factura
    const goToCreate = () => window.navigateTo("create");
    
    document
      .getElementById("desktop-create-btn")
      ?.addEventListener("click", goToCreate);
      
    document
      .getElementById("mobile-create-btn")
      ?.addEventListener("click", goToCreate);
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
      document.getElementById("client-search-mobile"),
    ];

    // Funciones del Modal
    const openModal = (isEdit = false) => {
      modal.classList.add("modal-open");
      modalContent.classList.add("modal-content-open");
      if (!isEdit) {
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
    document
      .getElementById("btn-open-modal")
      ?.addEventListener("click", () => openModal(false));
    document
      .getElementById("mobile-add-btn")
      ?.addEventListener("click", () => openModal(false));
    document
      .getElementById("btn-close-modal")
      ?.addEventListener("click", closeModal);
    document
      .getElementById("btn-cancel-modal")
      ?.addEventListener("click", closeModal);
    document
      .getElementById("modal-backdrop")
      ?.addEventListener("click", closeModal);

    // --- LÓGICA DE EDICIÓN ---
    // Usamos delegación de eventos porque los botones se crean dinámicamente
    document.querySelectorAll(".btn-edit-client").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        // 1. Obtener datos del atributo
        const clientData = JSON.parse(btn.dataset.client);

        // 2. Rellenar formulario
        form.elements["client_name"].value = clientData.client_name;
        form.elements["client_document_id"].value =
          clientData.client_document_id;
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
        client_phone: formData.get("client_phone"),
      };

      btn.innerHTML = "<span class='animate-pulse'>Procesando...</span>";
      btn.disabled = true;

      try {
        let url = "http://localhost:3000/api/clients";
        let method = "POST";

        // Si hay ID, cambiamos a modo EDICION
        if (clientId) {
          url = `http://localhost:3000/api/clients/${clientId}`;
          method = "PUT"; // O 'PATCH' dependiendo de tu backend
        }

        const res = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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

      rows.forEach((row) => {
        const name =
          row.querySelector(".client-name-text")?.innerText.toLowerCase() || "";
        const phone =
          row.querySelector(".client-phone-text")?.innerText.toLowerCase() ||
          "";

        if (name.includes(term) || phone.includes(term)) {
          row.style.display = "flex"; // Grid rows suelen ser flex en mi diseño
        } else {
          row.style.display = "none";
        }
      });
    };

    // Conectar ambos inputs de búsqueda a la misma lógica
    searchInputs.forEach((input) =>
      input?.addEventListener("input", handleSearch)
    );
  }
};

// Init
app.innerHTML = routes.login();
setupListeners("login");
