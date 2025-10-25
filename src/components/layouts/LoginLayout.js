import './Login.css'

import { GenerateInput } from "../ui/Input"
import { GenerateButton } from "../ui/Button"
import { GenerateCheckbox } from "../ui/Checkbox"
import { GenerateLink } from "../ui/Link"

/**
 * Genera el layout de login completo
 *
 * @returns {string} Login layout HTML
 */

export const LoginLayout = () => {
  const emailInput = GenerateInput("ri-user-line", "Nombre de usuario", "username", "username", "username")
  const passwordInput = GenerateInput("ri-lock-line", "Contraseña", "password", "password", "password")
  const loginButton = GenerateButton("Iniciar Sesion", "submit", "primary")

  return `
    <div class="login-background">
      <div class="login-card-wrapper">
        <!-- Avatar Circle -->
        <div class="login-avatar-circle">
          <div class="login-avatar-inner">
            <i class="ri-user-line login-avatar-icon"></i>
          </div>
        </div>
        
        <!-- Login Card -->
        <div class="login-form-card">
          <form id="login-form">
            <!-- Email Input -->
            ${emailInput}
            
            <!-- Password Input -->
            ${passwordInput}
            
            <!-- Remember & Forgot -->
            
            <!-- Login Button -->
            ${loginButton}
          </form>
        </div>
      </div>
    </div>
  `
}
