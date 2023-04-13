const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const DbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create
app.post('/insert', (request, response) => {
    const { name } = request.body;
    const db = DbService.getDbServiceInstance();

    const result = db.insertNewName(name);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Read
app.get('/getAll', (request, response) => {
    const db = DbService.getDbServiceInstance();
    const result = db.getAllData();
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err));
});

// Update

app.patch('/update', async (request, response) => {
    const db = DbService.getDbServiceInstance();
    const { id, name } = request.body;
    try {
        const result = await db.updateNameById(id, name);
        response.json({ success: true });
    } catch (error) {
        
        console.error(error);
        response.status(500).json({ error: 'Could not update name' });
    }
});

// Delete
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = DbService.getDbServiceInstance();
    const result = db.deleteRowById(id);
    console.log("result in delete", result)
    result
        .then(data => {
            console.log("RESULT DATA = ", data);
            response.json({ success: true });
        })
        .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log('App is running.'));
