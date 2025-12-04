import "./Select.css";
/**
    Genera un select personalizado
    @param {string} iconClass Clase del icono (remixicon)
    @param {string} name Name del select
    @param {Array<{value: string, label: string}>} options Opciones del select
    @returns {string} Select HTML
*/
export const GenerateSelect = (iconClass, name, options = []) => {
  const optionsHtml = options
    .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
    .join("")
  return `
  <div class="custom-select-wrapper"> 
    <div class="custom-select-icon"> 
            <i class="${iconClass}"></i> 
    </div> 
    <select name="${name}" class="custom-select-field"> ${optionsHtml} </select> 
    <div class="custom-select-arrow"> 
        <i class="ri-arrow-down-s-line"></i> 
    </div> 
  </div>`
}
