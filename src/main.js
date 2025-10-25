import { LoginLayout } from "./components/layouts/LoginLayout"
import "./style.css"

// Renderizar el layout de login
document.querySelector("#app").innerHTML = LoginLayout()

// Event listener para el formulario
document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  }

  console.log("Login data:", data)
  // Aquí puedes agregar tu lógica de autenticación
})
