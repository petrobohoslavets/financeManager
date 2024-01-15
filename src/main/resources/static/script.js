const HOST = "http://localhost:8080"
var categoryId = null;
var transactionId = null;
function domLoaded() {
    fillCategoryTable()

    document.getElementById('saveCategory').addEventListener('click', () => {
        if (categoryId === null) {
          createCategory();
        } else {
          updateCategory();
        }
    })

    document.getElementById('saveTransaction').addEventListener('click', () => {
        if (transactionId === null) {
          createTransaction();
        } else {
          updateTransaction();
        }
    })
}

function fillCategoryTable() {
    fetch(HOST + "/category/")
    .then(response => response.json())
    .then(data => {
        let table = document.querySelector("#categoriesView table tbody")
        table.innerHTML = ""
        data.forEach(element => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = element.id;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = element.name;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = element.description;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = "<div class='edit-row'><i class='fa-solid fa-pen-to-square'></i></div><div class='delete-row'><i class='fa-solid fa-xmark'></i></div>";
            tr.appendChild(td);
            table.appendChild(tr);
        });
        document.querySelectorAll('#categoriesView table tbody tr td .edit-row').forEach(element => {
            element.addEventListener('click', () => {
                showSection("categoriesEdit")
                let rowData = element.parentElement.parentElement.children;
                document.getElementById('categoryName').value = rowData[1].innerHTML
                document.getElementById('categoryDesc').value = rowData[2].innerHTML
                categoryId = parseInt(rowData[0].innerHTML)
            })
        });
        document.querySelectorAll('#categoriesView table tbody tr td .delete-row').forEach(element => {
            element.addEventListener('click', () => {
                deleteCategory(element.parentElement.parentElement.children[0].innerHTML);
            })
        });

    })
    .catch(error => console.error('An error occurred while receiving all categories data:', error));
}

function clearCategoryField() {
    document.getElementById('categoryName').value = ""
    document.getElementById('categoryDesc').value = ""
}

function clearTransactionField() {
    document.getElementById('transactionType').value = ""
    document.getElementById('transactionSum').value = 0
    document.getElementById('transactionDate').value = 0
    document.getElementById('transactionDesc').value = ""
}


function createCategory() {
    fetch(HOST + "/category/", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDesc').value
        }),
    })
    .then(response => response.json())
    .then(data => {
        showSection("categoriesView")
    })
    .catch(error => console.error('An error occurred while create new category:', error));
}

function updateCategory() {
    fetch(HOST + "/category/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: categoryId,
            name: document.getElementById('categoryName').value,
            description: document.getElementById('categoryDesc').value
        }),
    })
    .then(response => response.json())
    .then(data => {
        showSection("categoriesView")
    })
    .catch(error => console.error('An error occurred while update category:', error));
}

async function deleteCategory(id) {
    if (id != null && confirm("Ви впевнені, що хочете видалити категорію №" + id)) {
        try {
            const response = await fetch(HOST + "/transaction/categoryId=" + id, {
                method: 'GET'
            });
            const data = await response.json();

            if (data.length !== 0) {
                let numbers = "операції №";
                if (data.length === 1) numbers = "операцію №" + data[0].id;
                else data.forEach(element => {
                    numbers += element.id + " ";
                });

                if (confirm("Для видалення категорії необхідно видалити " + numbers + "\nВи впевнені?")) {
                    for (const element of data) {
                        await deleteTransaction(element.id, false);
                    }
                } else {
                    return;
                }
            }
            const deleteResponse = await fetch(HOST + "/category/" + id, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('An error occurred while deleting category:', error);
        }
    }
}

function fillTransactionTable() {
    fetch(HOST + "/transaction/")
    .then(response => response.json())
    .then(data => {
        let table = document.querySelector("#transactionsView table tbody")
        table.innerHTML = ""
        data.forEach(element => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = element.id;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = element.category.name;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = element.type;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = element.sum;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = element.date.substring(0, 10);
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = element.description;
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = "<div class='edit-row'><i class='fa-solid fa-pen-to-square'></i></div><div class='delete-row'><i class='fa-solid fa-xmark'></i></div>";
            tr.appendChild(td);
            table.appendChild(tr);
        });
        document.querySelectorAll('#transactionsView table tbody tr td .edit-row').forEach(element => {
            element.addEventListener('click', () => {
                showSection("transactionsEdit")
                let rowData = element.parentElement.parentElement.children;
                document.getElementById('transactionType').value = rowData[2].innerHTML
                document.getElementById('transactionSum').value = parseFloat(rowData[3].innerHTML)
                document.getElementById('transactionDate').value = rowData[4].innerHTML
                document.getElementById('transactionDesc').value = rowData[5].innerHTML
                transactionId = parseInt(rowData[0].innerHTML)
            })
        });
        document.querySelectorAll('#transactionsView table tbody tr td .delete-row').forEach(element => {
            element.addEventListener('click', () => {
                deleteTransaction(element.parentElement.parentElement.children[0].innerHTML)
            })
        });

    })
    .catch(error => console.error('An error occurred while receiving all transactions data:', error));
}

function createTransaction() {
    fetch(HOST + "/transaction/" +
                    document.getElementById('selectCategory').value +
                    "/" + document.getElementById('transactionType').value + 
                    "/" + document.getElementById('transactionSum').value + 
                    "/" + document.getElementById('transactionDate').value + 
                    "/" + document.getElementById('transactionDesc').value, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        showSection("transactionsView")
    })
    .catch(error => console.error('An error occurred while create new transaction:', error));
}

function updateTransaction() {
    fetch(HOST + "/transaction/" + transactionId +
                    "/" + document.getElementById('selectCategory').value +
                    "/" + document.getElementById('transactionType').value + 
                    "/" + document.getElementById('transactionSum').value + 
                    "/" + document.getElementById('transactionDate').value + 
                    "/" + document.getElementById('transactionDesc').value, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        showSection("transactionsView")
    })
    .catch(error => console.error('An error occurred while update transactions:', error));
}

function deleteTransaction(id, ask = true) {
    if(id != null && (ask ? confirm("Ви впевнені, що хочете видалити операцію №" + id) : true)) {
        fetch(HOST + "/transaction/" + id, 
        {method: 'DELETE'})
        .then(response => response.json)
        .then(data => {
            fillTransactionTable()
        })
        .catch(error => console.error('An error occurred while delete operation:', error));
    }
}

function generateCategoryOptions() {
    fetch(HOST + "/category/")
    .then(response => response.json())
    .then(data => {
        let select = document.getElementById('selectCategory')
        select.innerHTML = ""
        data.forEach(element => {
            let option = document.createElement('option')
            option.value = element.id
            option.innerHTML = element.name
            select.appendChild(option)
        })
    })
}


function showSection(id) {
    if(id == "categoriesView") fillCategoryTable()
    if(id == "transactionsView") fillTransactionTable()
    if(id == "transactionsEdit") generateCategoryOptions()
    Array.from(document.getElementsByTagName('section')).forEach(element => {
        element.classList.add("hide")
    });
    document.getElementById(id).classList.remove('hide')
}

function addNewCategory() {
    clearCategoryField()
    showSection("categoriesEdit")
    categoryId = null;
}


function addNewTransaction() {
    clearTransactionField()
    showSection("transactionsEdit")
    transactionId = null;
}

document.addEventListener("DOMContentLoaded", domLoaded);
