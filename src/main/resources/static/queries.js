const HOST = "http://localhost:8080"

// CATEGORY

async function getAllCategory() {
    try {
        const response = await fetch(HOST + "/category/")
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while receiving all categories data:', error)
    }
}

async function getCategoryById(id) {
    try {
        const response = await fetch(HOST + "/category/" + id)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while receiving category data:', error)
    }
}

async function getCategoryWithName(name) {
    try {
        const response = await fetch(HOST + "/category/name=" + name)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while receiving category data:', error)
    }
}


async function putCategory(name, description) {
    try {
        const response = await fetch(HOST + "/category/", {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description
            })
        })
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while create new category:', error)
    }
}

async function postCategory(id, name, description) {
    try {
        const response = await fetch(HOST + "/category/", {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                name: name,
                description: description
            })
        })
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while update category:', error)
    }
}

async function deleteCategory(id) {
    try {
        const response = await fetch(HOST + "/category/" + id, {
            method: 'DELETE'
        })
    } catch (error) {
        console.error('An error occurred while deleting category:', error);
    }
}

// TRANSACTION

async function getAllTransaction() {
    try {
        const response = await fetch(HOST + "/transaction/")
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while receiving all transactions data:', error)
    }
}

async function getTransactionById(id) {
    try {
        const response = await fetch(HOST + "/transaction/" + id)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while receiving transaction data:', error)
    }
}

async function getTransactionsWithCategory(category_id) {
    try {
        const response = await fetch(HOST + "/transaction/categoryId=" + category_id)
        const data = await response.json();
        return data
    } catch (error) {
        console.error('An error occurred while receiving transaction with category:', error)
    }
}

async function getReport(startDate, endDate, type) {
    try {
        const response = await fetch(HOST + "/transaction/report/" + startDate + "/" + endDate + "/" + type)
        const data = await response.json();
        return data
    } catch (error) {
        console.error('An error occurred while receiving report data:', error)
    }
}

async function getReportByCategory(startDate, endDate, categoryId, type) {
    try {
        const response = await fetch(HOST + "/transaction/report/" + startDate + "/" + endDate + "/" + type + "/" + categoryId)
        const data = await response.json();
        return data
    } catch (error) {
        console.error('An error occurred while receiving report data:', error)
    }
}

async function putTransaction(category_id, type, sum, date, desc) {
    try {
        const response = await fetch(HOST + "/transaction/" + category_id + "/" 
                                + type + "/" + sum + "/" + date + "/" + desc,  {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while create new transaction:', error)
    }
}

async function postTransaction(id, category_id, type, sum, date, desc) {
    try {
        const response = await fetch(HOST + "/transaction/" + id + "/" + category_id + "/" 
        + type + "/" + sum + "/" + date + "/" + desc, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('An error occurred while update transaction:', error)
    }
}

async function deleteTransaction(id) {
    try {
        const response = await fetch(HOST + "/transaction/" + id, {
            method: 'DELETE'
        })
    } catch (error) {
        console.error('An error occurred while deleting transaction:', error);
    }
}