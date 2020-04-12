window.addEventListener('load', calculateRate);

let rightInput = document.getElementById('right-input');
let leftInput = document.getElementById('left-input');

let iHaves = document.querySelectorAll('.i-have');
let iWants = document.querySelectorAll('.i-want');

let clickedIhave = 'RUB';
let clickedIwant = 'USD';

iHaves.forEach(item => item.addEventListener('click', clicked));
iWants.forEach(item => item.addEventListener('click', clicked));


leftInput.addEventListener('input', calculateRate);

function calculateRate() {
    if (clickedIhave === 'RUB' && clickedIwant === 'USD') {
        rightInput.value = leftInput.value * 1.7025;
    }
}

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
}

let response = fetch('https://api.ratesapi.io/api/latest?base=USD&symbols=RUB')
response.then(res => res.json()).then(res => console.log(res))