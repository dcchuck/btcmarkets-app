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