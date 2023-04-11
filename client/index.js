

document.addEventListener('DOMContentLoaded',()=>{
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    
});

const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = ()=>{
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert',{
        headers:{
            'Content-type': 'application/json'
        },
        method:'POST',
        body: JSON.stringify({ name : name})
    })
    .then(response => response.json())
    .then(data=> insertRowIntoTable(data['data']));
}

const insertRowIntoTable=(data)=>{
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for(const key in data){
        if(data.hasOwnProperty(key)){
            if(key ==='dateAdded'){
                data[key] =new Date(data[key].toDateString());
            }
            tableHtml += `<td>${data[key]}</td>`
        }
    }

        tableHtml +=`<td><button class="delete-row-btn" data-id ${data.id}>Delete</td>`;
        tableHtml +=`<td><button class="edit-row-btn" data-id ${data.id}>Edit</td></td>`;


    tableHtml +=" </tr>"

    if(isTableData){
        table.innerHTML = tableHtml;
    }else{
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

const loadHTMLTable =(data)=>{
    const table = document.querySelector('table tbody');


    if(data.length ===0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml ="";


    data.forEach(({id,name,date_added})=>{
        tableHtml +="<tr>";
        tableHtml +=`<td>${id}</td>`;
        tableHtml +=`<td>${name}</td>`;
        tableHtml +=`<td>${new Date(date_added).toLocaleDateString()}</td>`;
        tableHtml +=`<td><button class="delete-row-btn" data-id ${id}>Delete</td>`;
        tableHtml +=`<td><button class="edit-row-btn" data-id ${id}>Edit</td></td>`;
        tableHtml +="</tr>";
    });

    table.innerHTML =tableHtml;
}