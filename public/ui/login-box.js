import displayUI from "./index.js";
import authenticateUser from "../api-clients/authenticate-user.JS";

export default function createLoginBox(parentElement, state) {
    const loginBox = document.createElement('div');
    loginBox.id = 'login-box';
    loginBox.innerHTML = `
        <div class="set-container set-ui-element" id="set-container">
            <div class="set-header header">
                <div class="logo-slot">
                    <!-- Place your logo here -->
                    <img src="images/unzalogo.png" alt="UNZA Logo" />
                </div>
                <div class='unza-label' class="university-name">University of Zambia</div>
                <div class="app-title">Student Evaluation of Teaching</div>
            </div>
            <div class="login-page" id="login-page">
                <div class="login-box">
                <div class="login-prompt">Login</div>
                <form id="login-form">
                    <div class="form-group">
                    <input type="text" id="username" placeholder="Username" required>
                    </div>
                    <div class="form-group">
                    <input type="password" id="password" placeholder="Password" required>
                    </div>
                    <button type="submit">Login</button>
                </form>
                </div>
            </div>
            </div>

    `;
    parentElement.innerHTML= loginBox.outerHTML;

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        authenticateUser(username,password).then(
            token=>{
                console.log('Authenticated with token:', token)
                state.uiView=1
                state.user=token
                state.user.configuredCourses = []
                sessionStorage.setItem('state', JSON.stringify(state))
                parentElement.innerHTML = ''
                if(state.user.status.length === 0){
                    initialiseStudent(state.user.student_id).then(
                        response=>{
                            state.configStatus = 'pending'
                        }
                    )
                }else{
                    displayUI(state, parentElement)
                }
            }).catch(err=>{
            console.error('Authentication failed:', err)
        })
        console.log('Logging in with', username, password);
    });
}
async function initialiseStudent(studentID) {
    console.log('init....', studentID);

    try {
        const response = await fetch('/api/auth/student/initialize/unfiltered', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ student_id: studentID })
        });

        if (!response.ok) {
            throw new Error("Problem initialising student");
        }

        const status = await response.json();
        console.log(status);
        return status;
    } catch (err) {
        console.error(err);
        return { error: err.message };
    }
}
