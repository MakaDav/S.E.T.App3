import authenticateUser from "./api-clients/authenticate-user.js"
import displayUI from "./ui/index.js"
import createLoginBox from "./ui/login-box.js"
const state = JSON.parse(sessionStorage.getItem('state')) || {
    uiView:0
}

const mainContent = document.getElementById('main-content')

displayUI(state, mainContent)

