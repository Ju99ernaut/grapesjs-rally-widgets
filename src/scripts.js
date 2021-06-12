export function scriptTicker({ coin, image, endpoint }) {
    const el = this;
    const change = el.querySelector('.change');
    const price = el.querySelector('.cp');
    el.querySelector('img').src = image;
    el.querySelector('.c-name').innerHTML = `$${coin}`;
    refreshPrice();
    setInterval(refreshPrice, 60000);

    function refreshPrice() {
        fetch(endpoint + `creator_coins/${coin}/price`)
            .then(function (res) { return res.json() })
            .then(function (res) { updatePrice(res) })
            .catch(function (err) { console.log(err) });
    }

    function updatePrice(res) {
        change.style.display = 'none';
        price.innerHTML = `$${res.priceInUSD.toFixed(4)}`;
    }
}

export function scriptDeeplink({ coin }) {
    let currentTab = 0;
    const el = this;
    const tabs = el.querySelectorAll('.tab');
    const prev = el.querySelector('.prev');
    const next = el.querySelector('.next');
    const steps = el.querySelectorAll('.step');
    const link = el.querySelector('a');

    showTab(currentTab);
    prev.addEventListener('click', function () {
        nextPrev(-1);
    });
    next.addEventListener('click', function () {
        nextPrev(1);
    });

    function deeplink() {
        let currencyType = el.querySelector('select').value;
        let amount = el.querySelector('input').value;
        let note = el.querySelector('textarea').value;
        let url = `https://www.rally.io/creator/${coin}/?inputType=${currencyType}&amount=${amount}`;
        if (note) {
            url += `&note=${note}`;
        }
        link.href = url;
        link.innerHTML = url;
    }

    function showTab(n) {
        for (let i = 0; i < tabs.length; i++) tabs[i].style.display = 'none';
        tabs[n].style.display = 'block';
        if (n === 0) prev.style.display = 'none';
        else prev.style.display = 'inline';
        if (n === (tabs.length - 1)) next.style.display = 'none';
        else next.style.display = 'inline';
        stepIndicator(n);
    }

    function stepIndicator(n) {
        for (let i = 0; i < steps.length; i++) steps[i].classList.remove('active');
        steps[n].classList.add('active');
    }

    function nextPrev(n) {
        if (n === 1 && !validate()) return false;
        if (currentTab >= tabs.length) return false;
        currentTab += n;
        showTab(currentTab)
    }

    function validate() {
        let valid = true;
        input = el.querySelector('input');
        if (input.value === '') {
            input.classList.add('invalid');
            valid = false;
        }
        if (valid) steps[currentTab].classList.add('finish');
        deeplink();
        return valid;
    }
}

export function scriptProfile({ coin }) {
    const el = this;
    const messageBox = el.querySelector('.js-message');
    const btn = el.querySelector('.js-message-btn');
    const card = el.querySelector('.js-profile-card');
    const closeBtn = el.querySelectorAll('.js-message-close');

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        card.classList.add('active');
    });

    closeBtn.forEach(function (element, index) {
        console.log(element);
        element.addEventListener('click', function (e) {
            e.preventDefault();
            card.classList.remove('active');
        });
    });
}