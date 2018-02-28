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

// Drag out Order Book

let orderBookWindow = window;

let orderBookChildWindow = new fin.desktop.Window({
    name: 'orderBookChild',
    url: 'orderbook.html',
    autoShow: false
});

const orderBookHeadline = document.getElementById('order-book-headline');
orderBookColumn = document.getElementById('order-book-column');

orderBookHeadline.addEventListener('dragend', ()=> {
    orderBookColumn.style.display = 'none';
    orderBookChildWindow.show();
    orderBookWindow = orderBookChildWindow.nativeWindow;
}, false);

orderBookChildWindow.addEventListener('closed', () => {
    orderBookColumn.style.display = '';
    orderBookWindow = window;
    orderBookChildWindow = new fin.desktop.Window({
        name: 'orderBookChild',
        url: 'orderbook.html',
        autoShow: false
    });
})

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
    let orderBookTable = orderBookWindow.document.getElementById('order-book-table');
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

            //Add Trades to the List

            let newTrade = document.createElement('li');
            newTrade.innerText = `Trade Alert! ${messageData[2][2]} BTC Sold @ ${messageData[2][3]}`
            if (tradeTable.children.length === 5) {
                tradeTable.removeChild(tradeTable.lastChild);
            }
            tradeTable.insertBefore(newTrade, tradeTable.childNodes[0]);

            // Show an OpenFin Notification Instead

            // let tradeNotification = new fin.desktop.Notification({
            //     url: 'notification.html',
            //     message: `Trade Alert! ${messageData[2][2]} BTC Sold @ ${messageData[2][3]}`
            // })

        }
    }
}

// Add a close button

const closeButton = document.getElementById('close');

closeButton.onclick = () => {
    fin.desktop.Application.getCurrent().close();
}




//Open the research page in a 2nd OpenFin Window

const researchPageLink = document.getElementById('research-page');

let researchPageWindow;

researchPageLink.onclick = (e) => {
    e.preventDefault();
    if (typeof fin !== 'undefined') {
        researchPageWindow = new fin.desktop.Window({
            name: 'researchPage',
            url: 'research.html',
            autoShow: true
        })
    } else {
        window.location.href = 'research.html';
    }
}