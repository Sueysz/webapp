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
app.post('/insert', async (request, response) => {
    const { name } = request.body;
    const db = DbService.getDbServiceInstance();

    try {
        const data = await db.insertNewName(name);
        response.json({ data: data });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Could not insert name' });
    }
});

// Read
app.get('/getAll', async (request, response) => {
    const db = DbService.getDbServiceInstance();
    try {
        const data = await db.getAllData();
        response.json({ data: data });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Could not retrieve data' });
    }
});

// Update
app.patch('/update', async (request, response) => {
    const db = DbService.getDbServiceInstance();
    const { id, name } = request.body;
    try {
        await db.updateNameById(id, name);
        response.json({ success: true });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Could not update name' });
    }
});

// Delete
app.delete('/delete/:id', async (request, response) => {
    const { id } = request.params;
    const db = DbService.getDbServiceInstance();
    try {
        await db.deleteRowById(id);
        response.json({ success: true });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Could not delete row' });
    }
});

// Search
app.get('/search/:name', async (request, response) => {
    const { name } = request.params;
    const db = DbService.getDbServiceInstance();
    try {
        const result = await db.searchByName(name);
        response.json({ data: result });
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Could not search for name' });
    }
});

app.listen(process.env.PORT, () => console.log('App is running.'));
