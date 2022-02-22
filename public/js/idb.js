let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    //save a reference to the database
    const db = event.target.result;
    // create an object store (table) called `new_budget`, set it to have an auto incrementing primary key
    db.createObjectStore('new_budget', {autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;
    // check to see if app is online, then run uploadBudget() to send data
    if (navigator.onLine) {
        //uploadBudget();
    }
};

request.onerror = function(event) {
    // log error
    console.log(event.target.errorCode);
};

// no internet save
function saveRecord(record) {
    // open new transaction with the database 
    const transaction = db.transaction(['new_budget'], 'readwrite');
    //access the object store for `new_budget`
    const budgetObjectStore = transaction.objectStore('new_budget');
    // add record to your store with add method
    budgetObjectStore.add(record);
}