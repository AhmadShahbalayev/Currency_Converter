window.onload = function () {
    document.getElementById("default-currency").click();
};

let rightInput = document.getElementById('right-input');
let leftInput = document.getElementById('left-input');

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
    calculateRate();

    leftInput.addEventListener('input', calculateRate);
    function calculateRate() {
        fetch(`https://api.ratesapi.io/api/latest?base=${clickedIhave}&symbols=${clickedIwant}`)
            .then(res => res.json()
                .then((res) => {
                    rightInput.value = leftInput.value * +res.rates[clickedIwant].toFixed(5);
                    leftDescription.innerText = `1 ${clickedIhave} = ${+res.rates[clickedIwant].toFixed(5)} ${clickedIwant}`
                    rightDescription.innerText = `1 ${clickedIwant} = ${(1 / +res.rates[clickedIwant]).toFixed(5)} ${clickedIhave}`
                },
                    err => {
                        console.log(err);
                    }
                ));
    }
}

// let leftDiv = document.getElementById('left-div');
// let rightDiv = document.getElementById('right-div');

// let arrowButton = document.getElementById('button');
// arrowButton.addEventListener('click', () => {
    // let cloneRight = rightDiv.cloneNode(true);
    // let cloneLeft = leftDiv.cloneNode(true);
    // rightDiv.replaceWith(cloneLeft);
    // leftDiv.replaceWith(cloneRight);

    // let rectLeftLeft = leftDiv.getBoundingClientRect().left;
    // let rectRightLeft = rightDiv.getBoundingClientRect().left;
    // leftDiv.classList.add('absolute');
    // rightDiv.classList.add('absolute');
    // leftDiv.style.left = rectRightLeft;
    // rightDiv.style.left = rectLeftLeft;
    // leftDiv.classList.remove('absolute');
    // rightDiv.classList.remove('absolute');
    // console.log(rectLeftLeft);
    // console.log(rectRightLeft);
// })