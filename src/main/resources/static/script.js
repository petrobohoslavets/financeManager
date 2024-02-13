var categoryId = null;
var transactionId = null;
var reportChart;
function domLoaded() {
    fillCategoryTable()

    document.getElementById('saveCategory').addEventListener('click', async () => {
        const data = await getCategoryWithName(document.getElementById('categoryName').value);
        if(data.id != null) {
            alert('Категорія з такою назвою вже існує! ') 
            return;
        }
        if (categoryId === null) {
            await putCategory(document.getElementById('categoryName').value, document.getElementById('categoryDesc').value)
        } else {
            await postCategory(categoryId, document.getElementById('categoryName').value, document.getElementById('categoryDesc').value)
        }
        showSection('categoriesView');
    })

    document.getElementById('saveTransaction').addEventListener('click', async () => {
        if (transactionId === null) {
            await putTransaction(document.querySelector('#transactionsEdit .selectCategory').value, document.getElementById('transactionType').value, document.getElementById('transactionSum').value, document.getElementById('transactionDate').value, document.getElementById('transactionDesc').value)
        } else {
            await postTransaction(transactionId, document.getElementById('selectCategory').value, document.getElementById('transactionType').value, document.getElementById('transactionSum').value, document.getElementById('transactionDate').value, document.getElementById('transactionDesc').value)
        }
        showSection('transactionsView');
    })


}

async function fillCategoryTable() {
    const data = await getAllCategory();
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
            removeCategory(element.parentElement.parentElement.children[0].innerHTML);
        })
    });
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

function clearReportGenField() {
    document.getElementById('startDate').value = '2024-01-01'
    document.getElementById('endDate').value = '2024-02-01'
}


async function removeCategory(id) {
    if (id != null && confirm("Ви впевнені, що хочете видалити категорію №" + id)) {
        try {
            const data = await getTransactionsWithCategory(id);

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
            await deleteCategory(id);
        } catch (error) {
            console.error('An error occurred while deleting category:', error);
        }
    }
}

async function fillTransactionTable() {
    const data = await getAllTransaction();
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
            element.addEventListener('click', async () => {
                await showSection("transactionsEdit")
                let rowData = element.parentElement.parentElement.children;
                const category = await getCategoryWithName(rowData[1].innerHTML);
                document.getElementById('selectCategory').value = await category.id
                document.getElementById('transactionType').value = rowData[2].innerHTML
                document.getElementById('transactionSum').value = parseFloat(rowData[3].innerHTML)
                document.getElementById('transactionDate').value = rowData[4].innerHTML
                document.getElementById('transactionDesc').value = rowData[5].innerHTML
                transactionId = parseInt(rowData[0].innerHTML)
            })
        });
        document.querySelectorAll('#transactionsView table tbody tr td .delete-row').forEach(element => {
            element.addEventListener('click', () => {
                removeTransaction(element.parentElement.parentElement.children[0].innerHTML)
            })
        });
}

function removeTransaction(id, ask = true) {
    if(id != null && (ask ? confirm("Ви впевнені, що хочете видалити операцію №" + id) : true)) {
        deleteTransaction(id);
    }
}

async function generateCategoryOptions(section) {
    const data = await getAllCategory();
    
        let select = document.querySelector('#' + section + ' .selectCategory')
        select.innerHTML = ""
        data.forEach(element => {
            let option = document.createElement('option')
            option.value = element.id
            option.innerHTML = element.name
            select.appendChild(option)
        })
}

async function generateReport(category) {
    if(category != null) category = document.querySelector("#reportGenerator .selectCategory").value
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value
    let type = document.getElementById('reportTransactionType').value
    const data = (category == null ? await getReport(startDate, endDate, type) : await getReportByCategory(startDate, endDate, category, type ))
    if(data.length == 0) alert("Початкова дата пізніше кінцевої!")
    else {
        document.getElementById('titleStartDate').innerHTML = startDate
        document.getElementById('titleEndDate').innerHTML = endDate
        document.querySelector('#reportView h2').innerHTML = (type == "Витрати" ? "Витрата" : "Дохід")
        document.querySelector('#reportView h3').innerHTML = (type == "Витрати" ? "Розподіл витрат" : "Розподіл доходів")
        document.querySelector("#reportView thead tr").children[0].innerHTML = (category == null ? "Категорія" : "Опис операції")
        showSection('reportView')
        let dataForChart = {labels: [], datasets: [{data: []}]}
        const table = document.querySelector("#reportView table tbody")
        const ctx = document.getElementById('reportChart')
        table.innerHTML = ""
        
        data.forEach(element => {
            if(element[0] == 'All') {
                document.querySelector('#reportView tfoot td').innerHTML = "Всього: " + (element[1] == null ? 0 : element[1]) + " грн"
                if(Chart.getChart("reportChart") != undefined) {
                    Chart.getChart("reportChart").data.labels = dataForChart.labels
                    Chart.getChart("reportChart").data.datasets[0].data = dataForChart.datasets[0].data
                    Chart.getChart("reportChart").update()
                } else {
                    new Chart(ctx, {
                        type: 'pie',
                        data: dataForChart, 
                        options: {
                            plugins: {
                                legend: {display: false},
                            },  
                        }
                    })
                }
            } else {
                let tr = document.createElement('tr')
                tr.innerHTML = "<td>" + element[0] + "</td><td>" + element[1] + "</td>"
                table.appendChild(tr);

                dataForChart.labels.push(element[0])
                dataForChart.datasets[0].data.push(element[1])
            }
        })
    }
}

async function showSection(id) {
    switch(id) {
        case "categoriesView": fillCategoryTable(); break
        case "transactionsView": fillTransactionTable(); break
    }
    if(id == "reportGenerator" || id == "transactionsEdit") await generateCategoryOptions(id); 
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
