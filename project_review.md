# Revisión del Proyecto - Moony

Este documento detalla el estado actual del proyecto "moony", identificando funcionalidades pendientes, áreas de mejora y problemas detectados.

## 🚀 Estado General
El proyecto es una aplicación web de facturación construida con **Vanilla JavaScript**, **Vite** y **Tailwind CSS 4.0**. Utiliza un sistema de navegación basado en rutas por componentes inyectados en el DOM.

---

## 🛠️ Lo que funciona
- **Navegación**: El router principal en `main.js` permite cambiar entre secciones (Inicio, Facturas, Clientes, Productos, Login).
- **Login (UI & Lógica)**: Existe un formulario de login que intenta autenticar contra un backend en `localhost:2020`.
- **Gestión de Clientes (Casi Completo)**:
    - Listado de clientes desde API (`localhost:3000`).
    - Creación y edición de clientes (Modal funcional).
    - Búsqueda en tiempo real del lado del cliente.
- **Creación de Facturas**:
    - Formulario dinámico para agregar ítems.
    - Cálculo automático de totales e impuestos (IVA 16%).
    - Vista previa detallada antes de confirmar.
    - Envío de datos a la API y a un webhook de n8n.
- **Dashboard (Facturación)**:
    - Listado de facturas cruzando datos con la lista de clientes para mostrar nombres.

---

## ❌ Lo que NO funciona o falta implementar

### 1. Gestión de Productos (Incompleto)
- **Datos Mock**: La lista de productos en `ProductList.js` usa datos estáticos (mock data) en lugar de una API.
- **Formulario de Productos**: El "Drawer" para nuevos productos es puramente visual; no tiene lógica de guardado en `main.js`.
- **Filtros/Búsqueda**: No están implementados para la sección de productos.

### 2. Funcionalidades de Facturación
- **Visualización de Detalles**: El botón "Ver Detalles" en la lista de facturas no tiene funcionalidad.
- **Descarga de PDF**: El botón "Descargar PDF" no está implementado.
- **Eliminación/Anulación**: No hay lógica para anular o eliminar facturas.

### 3. Acciones de Clientes
- **Eliminación**: El botón de eliminar en la lista de clientes tiene el icono pero carece de un *listener* o lógica en el backend.

### 4. Perfil y Configuración
- No existe una sección para configurar los datos de la empresa (Nombre, RIF/NIT, Logo) que deberían aparecer en las facturas generadas.

---

## ⚠️ Observaciones Técnicas & Deuda

- **Dependencia de Backend Local**: Todas las peticiones apuntan a `localhost:3000` y `localhost:2020`. La aplicación no funcionará sin estos servicios externos activos.
- **Acoplamiento de Datos**: Los componentes de layout (ej. `InvoiceLayout`, `ClientsLayout`) realizan los *fetches* directamente. Esto dificulta las pruebas y la reutilización.
- **Manejo de Estado**: Se usa `localStorage` para el token y datos de usuario, pero no hay un sistema centralizado para el estado de la aplicación (como los clientes o productos cargados).
- **Hardcode de Webhooks**: La URL del webhook de n8n está hardcodeada en `main.js`.

---

## 📋 Próximos Pasos Sugeridos
1. **Implementar Backend de Productos**: Crear los endpoints para CRUD de productos y conectar `ProductList.js`.
2. **Lógica de Guardado de Productos**: Agregar el listener en `main.js` para procesar el formulario del `ProductDrawer`.
3. **Acciones de Factura**: Implementar una vista de detalle (posiblemente reutilizando el modal de vista previa) y la generación de PDF (ej. usando `jspdf`).
4. **Eliminación de Registros**: Agregar confirmación y llamadas a API para los botones de "Eliminar" en clientes y productos.
5. **Configuración Global**: Crear una sección de "Ajustes" para parametrizar los datos del emisor de las facturas.
