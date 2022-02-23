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
        uploadBudget();
    }
};

request.onerror = function(event) {
    // log error
    console.log(event.target.errorCode);
};


function uploadBudget() {
    const transaction = db.transaction(['new_budget'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_budget');
    //get all records
    const getAll = budgetObjectStore.getAll();
    // when successful, run this
    getAll.onsuccess = function() {
        if (getAll.result.lengeth > 0) {
            fetch('/api', {
                method: 'POST',
                body: JSON.stringify.apply(getAll.result),
                headers: {
                    Accept: 'application/json, test/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_budget'], 'readwrite');
                //accss the new_budget object store
                const budgetObjectStore = transaction.objectStore('new_budget');
                // clear all items in your store
                budgetObjectStore.clear();

                alert('All saved budgets have been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
}

// no internet save
function saveRecord(record) {
    // open new transaction with the database 
    const transaction = db.transaction(['new_budget'], 'readwrite');
    //access the object store for `new_budget`
    const budgetObjectStore = transaction.objectStore('new_budget');
    // add record to your store with add method
    budgetObjectStore.add(record);
};

window.addEventListener('online', uploadBudget);