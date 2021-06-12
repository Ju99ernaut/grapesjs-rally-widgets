import {
  widget, ticker, deeplink, deeplinkAlt, buy, profile,
  btnCss, tickerHtml, tickerCss, deeplinkHtml, deeplinkCss,
  profileHtml, profileCss
} from './consts';
import { scriptTicker, scriptDeeplink, scriptProfile } from './scripts';

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

  domc.addType(widget, {
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

  domc.addType(ticker, {
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
        components: `${tickerHtml}<style>${tickerCss}</style>`
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

  domc.addType(deeplink, {
    extend: 'widget',
    model: {
      defaults: {
        // Default props
        icon: '<i class="fa fa-link"></i>',
        script: scriptDeeplink,
        components: `${deeplinkHtml}<style>${deeplinkCss}</style>`
      },
    },
  });

  domc.addType(deeplinkAlt, {
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
        <style>${btnCss}</style>`
      }
    },
  });

  domc.addType(buy, {
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
        <style>${btnCss}</style>`
      },
    },
  });

  domc.addType(profile, {
    extend: 'widget',
    model: {
      defaults: {
        // Default props
        script: scriptProfile,
        components: `${profileHtml}<style>${profileCss}</style>`
      },
    },
  });
};
