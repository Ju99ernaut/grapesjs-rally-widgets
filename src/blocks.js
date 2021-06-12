import { ticker, deeplink, deeplinkAlt, buy, profile } from './consts';

export default (editor, opts = {}) => {
  const bm = editor.BlockManager;
  const { tickerBlock, deeplinkBlock, deeplink2Block, buyBlock, profileBlock } = opts;

  tickerBlock && bm.add(ticker, {
    category: 'Rally',
    label: 'Price Ticker',
    attributes: { class: 'fa fa-usd' },
    content: { type: ticker },
    ...tickerBlock
  });

  deeplink2Block && bm.add(deeplinkAlt, {
    category: 'Rally',
    label: 'Product Button',
    attributes: { class: 'fa fa-shopping-cart' },
    content: { type: deeplinkAlt },
    ...deeplink2Block
  });

  buyBlock && bm.add(buy, {
    category: 'Rally',
    label: 'Buy Coin',
    attributes: { class: 'fa fa-credit-card' },
    content: { type: buy },
    ...buyBlock
  });

  deeplinkBlock && bm.add(deeplink, {
    category: 'Rally',
    label: 'Deeplink',
    content: { type: deeplink },
    media: '<svg viewBox="0 0 16 16"><path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/><path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/></svg>',
    ...deeplinkBlock
  });

  profileBlock && bm.add(profile, {
    category: 'Rally',
    label: 'Profile Card',
    content: { type: profile },
    media: '<svg viewBox="0 0 16 16"><path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0h-7zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492V2.5z"/></svg>',
    ...profileBlock
  });
}
