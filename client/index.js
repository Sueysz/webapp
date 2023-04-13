

document.addEventListener('DOMContentLoaded', () => {
    loadHTMLTable();
});

document.querySelector('table tbody').addEventListener('click', (event) => {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        console.log(event.target)
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = async () => {
    const searchValue = document.querySelector('#search-input').value;
    try {
        const response = await fetch('http://localhost:5000/search/' + searchValue);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
};

// const deleteRowById = (id) => {
//     fetch('http://localhost:5000/delete/' + id, {
//         method: 'DELETE'
//     })
//         .then(data => {
//             loadHTMLTable();

//         });
// }
const deleteRowById = async (id) => {
    await fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    });

    loadHTMLTable();
}

const handleEditRow = (id) => {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    updateBtn.dataset.id = id;
};

updateBtn.onclick = async () => {
    const updateNameInput = document.querySelector('#update-name-input');

    try {
        const response = await fetch(`http://localhost:5000/update/`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                id: updateBtn.dataset.id,
                name: updateNameInput.value
            })
        });

        const data = await response.json();

        if (data.success) {
            location.reload();
        }
    } catch (error) {
        console.error(error);
    }
};


const addBtn = document.querySelector('#add-name-btn');


addBtn.onclick = () => {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name: name })
    })
        .then(response => response.json())
        .then(data => {
            loadHTMLTable();
        });
}


const insertRowIntoTable = (data) => {

    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key].toDateString());
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td></td>`;

    tableHtml += " </tr>"
    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

const loadHTMLTable = async () => {
    const response = await fetch('http://localhost:5000/getAll')
    const data = await response.json()
    const table = document.querySelector('table tbody');
    console.log(data["data"].length)
    if (data['data'].length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data['data'].forEach(({ id, name, date_added }) => {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleDateString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}
