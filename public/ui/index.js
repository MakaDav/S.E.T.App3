
import createDashboard from "./dashboard.js";
import createLoginBox from "./login-box.js";

export default function displayUI(state, parentElement){
    if(state.uiView!==0){
        const user = state.user
        const name = user.first_name+' '+user.last_name
        document.getElementById('dashboard-label').innerHTML='Dashboard'
        document.getElementById('logged-in-as').innerHTML='Logged in as '+name
        document.getElementById('logout').innerHTML='Logout'
        document.getElementById('logout').addEventListener('click',
            ()=>{
                state.uiView=0
                sessionStorage.removeItem('state')
                location.href='./index.html'
            }
        )
    }
    switch(state.uiView){
        case 0:
            createLoginBox(parentElement, state)
            break;
        case 1:
            createDashboard(parentElement, state)
            break;
        default:
            console.error('Unknown uiView state:', state.uiView)
    }
}