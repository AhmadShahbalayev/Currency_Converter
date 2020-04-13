// When script loads, it simulates like user have clicked RUB:

window.onload = function () {
    document.getElementById("default-currency").click();
};

// Variables and event listeners for click event are stored here: 

let leftInput = document.getElementById('left-input');
let rightInput = document.getElementById('right-input');

let iHaves = document.querySelectorAll('.i-have');
let iWants = document.querySelectorAll('.i-want');

let leftDescription = document.getElementById('left-description');
let rightDescription = document.getElementById('right-description');

let clickedIhave = 'RUB';
let clickedIwant = 'USD';

iHaves.forEach(item => item.addEventListener('click', clicked));
iWants.forEach(item => item.addEventListener('click', clicked));

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
    calculateRight();
    calculateLeft();

    leftInput.addEventListener('input', calculateRight);
    function calculateRight() {
        fetch(`https://api.ratesapi.io/api/latest?base=${clickedIhave}&symbols=${clickedIwant}`)
            .then(res => res.json()
                .then((res) => {
                    rightInput.value = leftInput.value * +res.rates[clickedIwant].toFixed(4);
                    leftDescription.innerText = `1 ${clickedIhave} = ${+res.rates[clickedIwant].toFixed(4)} ${clickedIwant}`
                    rightDescription.innerText = `1 ${clickedIwant} = ${(1 / +res.rates[clickedIwant]).toFixed(4)} ${clickedIhave}`
                },
                    err => {
                        console.log(err);
                    }
                ));
    }
    function calculateLeft() {
        fetch(`https://api.ratesapi.io/api/latest?base=${clickedIwant}&symbols=${clickedIhave}`)
            .then(res => res.json()
                .then((res) => {
                    leftInput.value = rightInput.value * +res.rates[clickedIhave].toFixed(4);
                    leftDescription.innerText = `1 ${clickedIhave} = ${+res.rates[clickedIhave].toFixed(4)} ${clickedIwant}`
                    rightDescription.innerText = `1 ${clickedIwant} = ${(1 / +res.rates[clickedIhave]).toFixed(4)} ${clickedIhave}`
                },
                    err => {
                        console.log(err);
                    }
                ));
    }
    rightInput.addEventListener('input', calculateLeft);
}

// Variables and event listeners to toggle divs are stored here:

let leftDiv = document.getElementById('left-div');
let rightDiv = document.getElementById('right-div');

let left = leftDiv.getBoundingClientRect().left;
let right = rightDiv.getBoundingClientRect().left;

let arrowButton = document.getElementById('button');
arrowButton.addEventListener('click', toggle);

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

// This function clears input from strings and commas:

let leftVal = +leftInput.value;
let rightVal = +rightInput.value;

let cleanLeftInput = '';
let cleanRightInput = '';

function cleaner(input, cleanInput) {
    for (let i = 0; i < input.length; i++) {
        if (input[i] === ',') {
            input[i] = '.';
            cleanInput += input[i];
        } 
        if (isNaN(input[i])) {
            input[i] = '.';
            cleanInput += input[i];
        } else {
            cleanInput += input[i];
        }
    }
    return cleanInput;
}

console.log(cleaner(leftVal, cleanLeftInput));