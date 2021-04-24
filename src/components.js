export default (editor, opts = {}) => {
  const domc = editor.DomComponents;
  const pfx = editor.getConfig('stylePrefix');

  const getCoinsOptions = coins => {
    return coins.map(coin => {
      const value = coin.coinSymbol;
      return { value, name: value };
    });
  }

  const idTrait = {
    name: 'id'
  };

  const titleTrait = {
    name: 'title'
  }

  const coinTrait = {
    type: 'select',
    name: 'coin',
    options: getCoinsOptions(opts.coinsList),
    changeProp: true,
  }

  const currencyTrait = {
    type: 'select',
    name: 'currencyType',
    label: 'Currency',
    options: [
      { value: 'COIN', name: 'COIN' },
      { value: 'USD', name: 'USD' }
    ],
    changeProp: true,
  }

  const amountTrait = {
    type: 'number',
    name: 'amount',
    placeholder: '10',
    min: 0,
    changeProp: true,
  }

  const noteTrait = {
    name: 'note',
    placeholder: 'note...',
    changeProp: true,
  }

  const toolbar = [{
    attributes: {
      class: 'fa fa-code'
    },
    command: 'widget-code'
  }, {
    attributes: {
      class: 'fa fa-arrow-up'
    },
    command: e => e.runCommand('core:component-exit', {
      force: 1
    })
  }, {
    attributes: {
      class: 'fa fa-arrows gjs-no-touch-actions',
      draggable: true
    },
    command: 'tlb-move'
  }, {
    attributes: {
      class: 'fa fa-clone'
    },
    command: 'tlb-clone'
  }, {
    attributes: {
      class: 'fa fa-trash-o'
    },
    command: 'tlb-delete'
  }]

  domc.addType('widget', {
    model: {
      defaults: {
        // Default props
        icon: '<i class="fa fa-puzzle-piece"></i>',
        toolbar,
        traits: [
          idTrait,
          titleTrait,
          coinTrait
        ],
        coin: 'SKOT',
        'script-props': ['coin'],
      },
      ...opts.widgetComponent
    },
  });

  function scriptTicker({ coin, image, endpoint }) {
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

  domc.addType('price-ticker', {
    extend: 'widget',
    model: {
      defaults: {
        // Default props
        icon: '<i class="fa fa-usd"></i>',
        image: 'https://images-cc-dev.s3-us-west-2.amazonaws.com/images/SkotLeach_Coin.png',
        endpoint: opts.rallyUrl,
        script: scriptTicker,
        'script-props': ['coin', 'image', 'endpoint'],
        attributes: {
          style: 'padding:10px'
        },
        components: `<div class="pt-container">
            <img src="img.png" alt="coin-icon" class="pt-icon"/>
            <div class="pt-meta">
              <span class="c-name">COIN</span>
              <p class="cp">$0.00</p>
            </div>
            <div class="cp-container">
              <svg fill="currentColor" focusable="false" viewBox="0 0 24 24" aria-hidden="true" class="indicator rotate green">
                <path d="M7 10l5 5 5-5z">
                </path>
              </svg>
              <p class="change green">0.00%</p>
            </div>
          </div>
          <style>
            .pt-container{
              display:flex;
              margin-left: 10px;
              font-family:Helvetica, sans-serif;
            }
            .cp-container{
              display:flex;
              align-items:center;
            }
            .cp {
              margin: 0;
              margin-top: 5px
            }
            .pt-meta{
              display:flex;
              flex-direction:column;
              margin-left: 10px;
            }
            .pt-icon{
              width:50px;
              height:50px;
              border-radius: 5px;
            }
            .c-name{
              font-weight:700;
              font-size:20px;
            }
            .cp{
              font-size:25px;
              font-weight:700;
            }
            .indicator{
              width: 25px;
              height: 25px;
            }
            .red {
              color: rgb(219, 105, 105);
            }
            .green {
              color: rgb(81, 146, 81);
            }
            .rotate {
              transform: rotate(180deg);
            }
          </style>`
      },
      init() {
        this.updateCoinImage();
        this.on("change:coin", this.updateCoinImage);
      },
      updateCoinImage() {
        const currentCoinSymbol = this.get('coin');
        const currentCoin = opts.coinsList.find(coin => coin.coinSymbol === currentCoinSymbol);
        this.set('image', currentCoin.coinImagePath);
      }
    },
  });

  function scriptDeeplink({ coin }) {
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

  domc.addType('rally-deeplink', {
    extend: 'widget',
    model: {
      defaults: {
        // Default props
        icon: '<i class="fa fa-link"></i>',
        script: scriptDeeplink,
        components: `<form action="" class="deeplink">
            <div class="header">Donate</div>
            <div class="tab">
              <p>
                <select class="input" name="currency" id="currency">
                  <option value="COIN">COIN</option>
                  <option value="USD">USD</option>
                </select>
              </p>
              <p><input class="input" type="text" placeholder="amount"/></p>
            </div>
            <div class="tab">
              <p><textarea class="input" name="note" id="note" placeholder="optional note..."></textarea></p>
            </div>
            <div class="tab">
              <a target="_blank" href="#">Link</a>
            </div>
            <div>
              <button data-${pfx}type="button-basic" type="button" class="prev">Prev</button>
              <button data-${pfx}type="button-basic" type="button" class="next">Next</button>
            </div>
            <div><span class="step"></span><span class="step"></span><span class="step"></span></div>
          </form>
          <style>
            .deeplink {
              background-color: #ffffff;
              margin: 100px auto;
              padding: 40px;
              width: 70%;
              min-width: 300px
            }

            .input {
              padding: 10px;
              width: 100%;
              font-size: 17px;
              border: 1px solid #aaaaaa;
            }

            .input.invalid {
              background-color: #ffdddd;
            }

            .tab {
              display: none;
            }

            .step {
              height: 15px;
              width: 15px;
              margin: 0 2px;
              background-color: #bbbbbb;
              border: none;
              border-radius: 50%;
              display: inline-block;
              opacity: 0.5;
            }

            .step.active {
              opacity: 1
            }

            .step.finish {
              background-color: #4caf50;
            }
          </style>`
      },
    },
  });

  domc.addType('rally-deeplink-predefined', {
    extend: 'widget',
    model: {
      defaults: {
        // Default props
        icon: '<i class="fa fa-shopping-cart"></i>',
        traits: [
          idTrait,
          titleTrait,
          coinTrait,
          currencyTrait,
          amountTrait,
          noteTrait
        ],
        currencyType: 'COIN',
        amount: 10,
        note: 'service/product description',
        'script-props': ['coin', 'currencyType', 'amount', 'note'],
        script({ coin, currencyType, amount, note }) {
          this.querySelector('button').addEventListener('click', function () {
            window.open(`https://www.rally.io/creator/${coin}/?inputType=${currencyType}&amount=${amount}&note=${note}`, '_blank');
          });
        },
        components: `<button data-${pfx}type="button-basic" class="btn-rly">Buy Product</button>
        <style>
          .btn-rly {
            cursor: pointer;
            padding: 13px 18px;
            background-color: #424242;
            font-family: inherit;
            color: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            border: 1px solid #e9ebeb;
            border-bottom-color: #e1e3e3;
            border-radius: 4px;
            background-color: #fff;
            color: rgba(14, 30, 37, .87);
            box-shadow: 0 2px 4px 0 rgba(14, 30, 37, .12);
            transition: all .2s ease;
            transition-property: background-color, color, border, box-shadow;
            outline: 0;
            font-weight: 500;
            background: #f40;
            color: #fff;
            border-color: transparent;
          }
        </style>`
      }
    },
  });

  domc.addType('rally-buy-coin', {
    extend: 'widget',
    model: {
      defaults: {
        // Default props
        icon: '<i class="fa fa-credit-card"></i>',
        script({ coin }) {
          this.querySelector('button').addEventListener('click', function () {
            window.open(`https://www.rally.io/creator/${coin}/`, '_blank');
          });
        },
        components: `<button data-${pfx}type="button-basic" class="btn-rly">Buy Coin</button>
        <style>
          .btn-rly {
            cursor: pointer;
            padding: 13px 18px;
            background-color: #424242;
            font-family: inherit;
            color: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            border: 1px solid #e9ebeb;
            border-bottom-color: #e1e3e3;
            border-radius: 4px;
            background-color: #fff;
            color: rgba(14, 30, 37, .87);
            box-shadow: 0 2px 4px 0 rgba(14, 30, 37, .12);
            transition: all .2s ease;
            transition-property: background-color, color, border, box-shadow;
            outline: 0;
            font-weight: 500;
            background: #f40;
            color: #fff;
            border-color: transparent;
          }
        </style>`
      },
    },
  });
};
