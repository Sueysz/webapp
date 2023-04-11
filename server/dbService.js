const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

let instance = null;
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.DB_PORT,
    
});


class DbService {
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }
    async getAllData(){
        try{
            const connection = await pool.getConnection();
            const [rows] = await connection.execute('SELECT * FROM names');
            connection.release();
            console.log(rows);
            return rows;
        } catch(error){
            console.log(error);
        }
    }

    async insertNewName(name) {
        try{
            const dateAdded = new Date();
            const connection = await pool.getConnection();
            const [rows] = await connection.execute('INSERT INTO names (name,date_added) VALUES (?, ?);',[name,dateAdded]);
            connection.release();
            console.log(rows.insertId);
            return rows.insertId;
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = DbService;