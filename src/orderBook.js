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