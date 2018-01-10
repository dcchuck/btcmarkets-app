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