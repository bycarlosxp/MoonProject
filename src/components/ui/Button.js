import './Button.css'

/**
 * Genera un botón personalizado
 *
 * @param {string} text Texto del botón
 * @param {string} type Type del botón (button, submit, reset)
 * @param {string} variant Variante del botón (primary, secondary)
 * @returns {string} Button HTML personalizado
 */

export const GenerateButton = (text, type = "button", variant = "primary") => {
  const variantClass = variant === "secondary" ? "custom-button-secondary" : "custom-button-primary"

  return `
    <button 
      type="${type}" 
      class="custom-button ${variantClass}"
    >
      ${text}
    </button>
  `
}
