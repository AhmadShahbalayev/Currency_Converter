window.onload = function () {
    document.getElementById("default-currency").click();
};

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
    rightInput.addEventListener('input', calculateLeft);
    function calculateLeft() {
        fetch(`https://api.ratesapi.io/api/latest?base=${clickedIwant}&symbols=${clickedIhave}`)
            .then(res => res.json()
                .then((res) => {
                    leftInput.value = rightInput.value * +res.rates[clickedIhave].toFixed(4);
                    leftDescription.innerText = `1 ${clickedIwant} = ${+res.rates[clickedIhave].toFixed(4)} ${clickedIhave}`
                    rightDescription.innerText = `1 ${clickedIhave} = ${(1 / +res.rates[clickedIhave]).toFixed(4)} ${clickedIwant}`
                },
                    err => {
                        console.log(err);
                    }
                ));
    }
}

let leftDiv = document.getElementById('left-div');
let rightDiv = document.getElementById('right-div');

let left = leftDiv.getBoundingClientRect().left;
let right = rightDiv.getBoundingClientRect().left;

let arrowButton = document.getElementById('button');
arrowButton.addEventListener('click', toggle);

function toggle() {
    leftDiv.classList.add('absolute');
    rightDiv.classList.add('absolute');
    leftDiv.style.right = 0;
    rightDiv.style.left = 0;
    leftDiv.style.left = '';
    arrowButton.removeEventListener('click', toggle);
    arrowButton.addEventListener('click', reverseToggle);
}

function reverseToggle() {
    leftDiv.style.left = 0;
    rightDiv.style.right = 0;
    rightDiv.style.left = '';
    arrowButton.removeEventListener('click', reverseToggle);
    arrowButton.addEventListener('click', toggle);
}