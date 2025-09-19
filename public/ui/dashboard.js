import setUpUser from "./setup-users.js";

export default function createDashboard(parentElement, state){
   console.log('In dashboard..',state)
    const dashboard = document.createElement('div');
    dashboard.id = 'dashboard';
    dashboard.innerHTML = ` 
        <div class='data-cards'>
            ${createDataCard('Courses', 5, 3).outerHTML}
            ${createDataCard('Lecturers', 10, 7).outerHTML}
        </div>
        <div class='data-cards'>
            <button class="set-prompt-button" id='set-prompt-button'>Select Your Courses</button>
        </div>
    `;
    parentElement.innerHTML = '';
    parentElement.append(dashboard);
    console.log(state)
    handleEvents(parentElement, state)
}

function handleEvents(parentElement, state){
    const setPromptButton = document.getElementById('set-prompt-button');
    setPromptButton.addEventListener('click', () => {
        setUpUser(state, parentElement);
    });
}

function createDataCard(title, total, evaluated) {
    const status = evaluated ? 'Completed' : 'Pending';
    const progress = total ? ((evaluated / total) * 100).toFixed(0) : 0;
    const card = document.createElement('div');
    card.className = 'data-card';
    card.innerHTML = `
        <div class='data-card-title'>${title}</div>
        <div class='card-entry'>
            <div class='card-value total'>${total}</div>
            <div class='data-card-key'> Total</div>
        </div>
        <div class='card-entry'>
            <div class='card-value evaluate'>${evaluated}</div>
            <div class='data-card-key'> Evaluated</div>
        </div>
        <div class='card-entry'>
            <div class='card-value status'>${progress}%</div>
            <div class='data-card-key'> Status</div>
        </div>
    `;
    return card;
}