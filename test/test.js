const assert = require('assert');

const demoBook = [
    {
        price: 12345,
        orders: 1,
        quantity: 0.123
    },
    {
        price: 12346,
        orders: 1,
        quantity: 0.123
    },
    {
        price: 12347,
        orders: 1,
        quantity: 0.123
    },
    {
        price: 12348,
        orders: 1,
        quantity: 0.123
    },
    {
        price: 12349,
        orders: 1,
        quantity: 0.123
    }
]

const updateQuantity = {
    price: 12346,
    orders: 2,
    quantity: 0.2
}

const removeBookEntry = {
    price: 12349,
    orders: 0,
    quantity: 1
}

const addBookEntry = {
    price: 12350,
    orders: 1,
    quantity: 0.4
}

function updateOrderBook(item) {
    if (item.orders === 0) {
        demoBook.forEach((bookEntry, index) => {
            if (bookEntry.price === item.price) {
                demoBook.splice(index, 1);
                return;
            }
        })
    } else {
        let itemInBook = false;
        demoBook.forEach((bookEntry, index) => {
            if (bookEntry.price === item.price) {
                itemInBook = true;
                demoBook[index] = item;
                return;
            }
        });
        if (!itemInBook) {
            demoBook.push(item);
        }
    }
}

updateOrderBook(updateQuantity);
assert.equal(demoBook[1].orders, 2);
updateOrderBook(removeBookEntry);
assert.equal(demoBook.length, 4);
updateOrderBook(addBookEntry);
assert.equal(demoBook.length, 5);

const demoBookToSort = [
    {
        price: 5000,
        orders: 1,
        quantity: 0.123
    },
    {
        price: 4000,
        orders: 1,
        quantity: 0.123
    },
    {
        price: 6000,
        orders: 1,
        quantity: 0.123
    },
    {
        price: 7000,
        orders: 1,
        quantity: 0.123
    },
    {
        price: 9000,
        orders: 1,
        quantity: 0.123
    }
]

console.log(demoBookToSort)

demoBookToSort.sort((a,b) => {
    return a.price < b.price ? -1 : 1;
})

console.log(demoBookToSort)