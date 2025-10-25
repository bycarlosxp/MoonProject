/**
 * Genera un link personalizado
 *
 * @param {string} text Texto del link
 * @param {string} href URL del link
 * @returns {string} Link HTML personalizado
 */

export const GenerateLink = (text, href = "#") => {
  return `
    <a 
      href="${href}" 
      class="custom-link"
    >
      ${text}
    </a>
  `
}
