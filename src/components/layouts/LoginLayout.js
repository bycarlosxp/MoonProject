import './Login.css'

import { GenerateInput } from "../ui/Input"
import { GenerateButton } from "../ui/Button"
import { MainLoader } from '../ui/MainLoader'


/**
 * Genera el layout de login completo
 *
 * @returns {string} Login layout HTML
 */

export const LoginLayout = () => {
  const emailInput = GenerateInput("ri-user-line", "Nombre de usuario", "username", "username", "username")
  const passwordInput = GenerateInput("ri-lock-line", "Contraseña", "password", "password", "password")
  const loginButton = GenerateButton("Entrar", "submit", "primary")
  const mainLoader = MainLoader()

  document.addEventListener('DOMContentLoaded', () =>
    {
      const loader = document.querySelector('#main-loader')
  
    setTimeout(() => {
        loader.classList.add('hidden-loader')
        setTimeout(() => {
          loader.style.display = 'none';
        }, 2000)
      }, 500)
    }
  )
  return `
    ${mainLoader}
    <div class="login-background">
      <div class="login-card-wrapper">
        <!-- Logo -->
        <div class="flex items-center justify-center mb-4 ">
          <i class="ri-moon-fill logo"></i>
          <span class="text-5xl font-bold login-title">MoonProject</span>
        </div>
        
        <!-- Login Card -->
        <div class="login-form-card">
        <span class="text-xl text-gray-500 font-medium block mb-6">Bienvenido de nuevo!</span>
          <form id="login-form"">
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
