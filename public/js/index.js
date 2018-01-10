/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const trades = __webpack_require__(1);
const orderBook = __webpack_require__(2);
const ticker = __webpack_require__(3);

trades.connectToTrades();
ticker.connectToTicker();
orderBook.connectToOrderBook();


/***/ }),
/* 1 */
/***/ (function(module, exports) {

function connectToTrades() {
    const tradesWB = new WebSocket('wss://api.bitfinex.com/ws/2');

    tradesSubscribeMessage = JSON.stringify({
        event: "subscribe",
        channel: "trades",
        symbol: "tBTCUSD"
    });
    
    tradesWB.onopen = () => {
        tradesWB.send(tradesSubscribeMessage);
    }
    
    const tradeTable = document.getElementById('trades');
    
    tradesWB.onmessage = (msg) => {
        let messageData = JSON.parse(msg.data)
        if (messageData[1] === "te") {
            if (messageData[2][2] > 0) {
                let newTrade = document.createElement('li');
                newTrade.innerText = `New Trade! ${messageData[2][2]}`
                if (tradeTable.children.length === 5) {
                    tradeTable.removeChild(tradeTable.lastChild);
                }
                tradeTable.insertBefore(newTrade, tradeTable.childNodes[0]);
            }
        }
    }
}

module.exports = {
    connectToTrades: connectToTrades
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

function connectToOrderBook() {
    const orderBookWS = new WebSocket('wss://api.bitfinex.com/ws/2');
    const orderBook = [];
    
    orderBookSubscribeMessage = JSON.stringify({
        event: "subscribe",
        channel: "book",
        pair: 'tBTCUSD',
        prec: "P0"
    });
    
    orderBookWS.onopen = () => {
        orderBookWS.send(orderBookSubscribeMessage);
    }
    
    orderBookWS.onmessage = (msg) => {
        let parsedMessage = JSON.parse(msg.data);
        if (Array.isArray(parsedMessage)) {
            processBookMessage(parsedMessage);
        }
    }
    
    function processBookMessage(parsedMessage) {
        let data = parsedMessage[1];
        if (data !== "hb") {
            if (Array.isArray(data[0])) {
                data.forEach(dataPoint => {
                    updateBook(dataPoint);
                })
            } else {
                updateBook(data);
            }    
        }
    }
    
    function updateBook(data) {
        let item = {
            PRICE: data[0],
            ORDERS: data[1],
            SIZE: data[2]
        }
        if (item.ORDERS === 0) {
            orderBook.forEach((bookEntry, index) => {
                if (bookEntry.PRICE === item.PRICE) {
                    orderBook.splice(index, 1);
                    return;
                }
            })
        } else {
            let itemInBook = false;
            orderBook.forEach((bookEntry, index) => {
                if (bookEntry.PRICE === item.PRICE) {
                    itemInBook = true;
                    orderBook[index] = item;
                    return;
                }
            });
            if (!itemInBook) {
                orderBook.push(item);
            }
        }
        orderBook.sort((a,b) => {
            return a.PRICE < b.PRICE ? -1 : 1;
        })
        let orderBookTable = document.getElementById('order-book-table');
        for (let i = orderBookTable.rows.length; i > 1; i--) {
            orderBookTable.deleteRow(i - 1);
        }
        for (let i = 0; i < orderBook.length; i++) {
            let newRow = orderBookTable.insertRow(-1);
            Object.keys(orderBook[i]).forEach((key, index) => {
                let cell = newRow.insertCell(index);
                cell.innerHTML = orderBook[i][key];
            })
        }
    }
    
    function updateInBook(update) {
        return 
    }
}

module.exports = {
    connectToOrderBook: connectToOrderBook
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function connectToTicker() {
    let tickerResponse = {
        BID: undefined,
        SIZE: undefined,
        ASK: undefined,
        SIZE: undefined,
        CHANGE: undefined,
        PERCENTAGE: undefined,
        LAST: undefined,
        VOLUME: undefined,
        HIGH: undefined,
        LOW: undefined
    }
    
    const tickerWS = new WebSocket('wss://api.bitfinex.com/ws/2')
    
    const tickerSubscribeMessage = JSON.stringify({
        event: 'subscribe',
        channel: 'ticker',
        symbol: 'tBTCUSD'
    });
    
    tickerWS.onopen = () => {
        tickerWS.send(tickerSubscribeMessage);
    }
    
    tickerWS.onmessage = (message) => {
        let parsedMessage = JSON.parse(message.data);
        if (isTickerUpdate(parsedMessage)) {
            let tickerUpdate = parsedMessage[1];
            updateTicker(tickerUpdate);
        }
    }
    
    function isTickerUpdate(parsedMessage) {
        return (Array.isArray(parsedMessage) && Array.isArray(parsedMessage[1]));
    }
    
    function updateTicker(tickerUpdate) {
        let tickerTable = document.getElementById('ticker-table');
        if (tickerTable.rows[1]) {
            tickerTable.deleteRow(1)
        }
        let tickerRow = tickerTable.insertRow(-1);
        tickerUpdate.forEach((tickerItem, index) => {
            let cell = tickerRow.insertCell(index);
            cell.innerHTML = tickerItem;
        })
    }
}

module.exports = {
    connectToTicker: connectToTicker
}

/***/ })
/******/ ]);