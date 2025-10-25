import './Input.css'

/**
 * Genera un input personalizado con icono opcional usando remixicon
 *
 * @param {string} iconClass Clase del icono de remixicon (ej: "ri-user-line")
 * @param {string} placeholder Placeholder del Input
 * @param {string} type Type del input
 * @param {string} name Name del input
 * @param {string} id ID del input
 * @returns {string} Input HTML personalizado
 */

export const GenerateInput = (iconClass, placeholder, type = "text", name = "", id = "") => {
  const inputType = ["text", "email", "password", "number"].includes(type) ? type : "text"

  return `
    <div class="custom-input-wrapper">
      ${
        iconClass
          ? `
        <div class="custom-input-icon">
          <i class="${iconClass}"></i>
        </div>
      `
          : ""
      }
      <input 
        type="${inputType}" 
        name="${name || ""}" 
        id="${id || name || ""}"
        placeholder="${placeholder || ""}"
        class="custom-input-field"
      >
    </div>
  `
}
