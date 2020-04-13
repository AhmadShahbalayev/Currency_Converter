// This runs our script on

window.addEventListener('load', runApp);

// All variables and event listeners are stored here: 

let leftInput = document.getElementById('left-input');
let rightInput = document.getElementById('right-input');

let iHaves = document.querySelectorAll('.i-have');
let iWants = document.querySelectorAll('.i-want');

let leftDescription = document.getElementById('left-description');
let rightDescription = document.getElementById('right-description');

let clickedIhave;
let clickedIwant;

iHaves.forEach(item => item.addEventListener('click', clicked));
iWants.forEach(item => item.addEventListener('click', clicked));

let leftResponse;
let rightResponse;

let leftDiv = document.getElementById('left-div');
let rightDiv = document.getElementById('right-div');

let left = leftDiv.getBoundingClientRect().left;
let right = rightDiv.getBoundingClientRect().left;

let arrowButton = document.getElementById('button');
arrowButton.addEventListener('click', toggle);

// When script loads, it gets response:

function runApp() {
    clickedIhave = 'RUB';
    clickedIwant = 'USD';
    getResponse();
    leftInput.addEventListener('input', calculateRight);
    rightInput.addEventListener('input', calculateLeft);
}

function calculateRight() {
    let cleanLeftInput = cleaner(leftInput.value);
    setTimeout(() => {
        leftInput.value = cleanLeftInput;
    }, 0);
    rightInput.value = cleanLeftInput * +leftResponse.rates[clickedIwant].toFixed(4);
    leftDescription.innerText = `1 ${clickedIhave} = ${+leftResponse.rates[clickedIwant].toFixed(4)} ${clickedIwant}`
    rightDescription.innerText = `1 ${clickedIwant} = ${(1 / +leftResponse.rates[clickedIwant]).toFixed(4)} ${clickedIhave}`
}

function calculateLeft() {
    let cleanRightInput = cleaner(rightInput.value);
    setTimeout(() => {
        rightInput.value = cleanRightInput;
    }, 0);
    leftInput.value = cleanRightInput * +rightResponse.rates[clickedIhave].toFixed(4);
}

// This function provides us with the neccessary information from server:

function clicked(e) {
    if (e.target.classList.contains('i-have')) {
        iHaves.forEach(item => item.classList.remove('clicked'));
        if (e.target.classList.contains('currency')) {
            clickedIhave = e.target.innerText;
        } else if (e.target.classList.contains('select')) {
            clickedIhave = e.target.value;
        }
    }
    if (e.target.classList.contains('i-want')) {
        iWants.forEach(item => item.classList.remove('clicked'));
        if (e.target.classList.contains('currency')) {
            clickedIwant = e.target.innerText;
        } else if (e.target.classList.contains('select')) {
            clickedIwant = e.target.value;
        }
    }
    e.target.classList.add('clicked');
    getResponse();
}

// This function provide us with responses: 

function getResponse() {
    document.querySelector('.ghost').classList.remove('hidden');
    let responseL = fetch(`https://api.ratesapi.io/api/latest?base=${clickedIhave}&symbols=${clickedIwant}`);
    let responseR = fetch(`https://api.ratesapi.io/api/latest?base=${clickedIwant}&symbols=${clickedIhave}`);
    Promise.all([
        responseL,
        responseR
    ]).then(
        responses => Promise.all([
            responses[0].json(),
            responses[1].json()
        ]).then(
            (res) => {
                leftResponse = res[0];
                rightResponse = res[1];
                console.log('LEFT', leftResponse);
                console.log('RIGHT', rightResponse)
                calculateRight();
            }
        )
    )
        .catch(() => alert('Right now our server is not responding.\n\nPlease try again later'))
        .finally(() => document.querySelector('.ghost').classList.add('hidden'));
}

// This function automatically updates variables when user came back:

// window.addEventListener('mousemove', update);

// function update() {
//     setTimeout(() => {
//         getResponse();
//     }, 60000)
// }

// This functions toggles divs:

function toggle() {
    leftDiv.classList.add('absolute');
    rightDiv.classList.add('absolute');
    leftDiv.style.right = 0;
    rightDiv.style.left = 0;
    leftDiv.style.left = '';
    document.getElementById('left-p').innerText = 'Хочу приобрести';
    document.getElementById('right-p').innerText = 'У меня есть';
    arrowButton.removeEventListener('click', toggle);
    arrowButton.addEventListener('click', reverseToggle);
}

function reverseToggle() {
    leftDiv.style.left = 0;
    rightDiv.style.right = 0;
    rightDiv.style.left = '';
    document.getElementById('left-p').innerText = 'У меня есть';
    document.getElementById('right-p').innerText = 'Хочу приобрести';
    arrowButton.removeEventListener('click', reverseToggle);
    arrowButton.addEventListener('click', toggle);
}

// This function for changing commas to dots:

function cleaner(input) {
    let dirty = input;
    let clean = '';
    let isFirstDot = true;
    for (let i = 0; i < dirty.length; i++) {
        if (isFirstDot && (dirty[i] === '.' || dirty[i] === ',')) {
            clean += dirty[i];
            isFirstDot = false;
        }
        if (!isNaN(dirty[i])) {
            clean += dirty[i];
        }
    }
    return clean.replace(',', '.');
}