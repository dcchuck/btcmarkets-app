const trades = require('./trades');
const orderBook = require('./orderBook');
const ticker = require('./ticker');

trades.connectToTrades();
ticker.connectToTicker();
orderBook.connectToOrderBook();
