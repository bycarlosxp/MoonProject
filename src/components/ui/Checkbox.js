import './Checkbox.css'

/**
 * Genera un checkbox personalizado con label
 *
 * @param {string} label Texto del label
 * @param {string} name Name del checkbox
 * @param {string} id ID del checkbox
 * @returns {string} Checkbox HTML personalizado
 */

export const GenerateCheckbox = (label, name = "", id = "") => {
  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  return `
    <div class="custom-checkbox-wrapper">
      <input 
        type="checkbox" 
        name="${name || ""}" 
        id="${checkboxId}"
        class="custom-checkbox"
      >
      <label 
        for="${checkboxId}" 
        class="custom-checkbox-label"
      >
        ${label}
      </label>
    </div>
  `
}
