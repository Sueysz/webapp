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
            return rows.insertId;
        }catch(error){
            console.
            console.error(error)
        }
    }
    
    async deleteRowById(id){
        try{
            id = parseInt(id, 10);
            const connection = await pool.getConnection();
            await connection.execute('DELETE FROM names WHERE id = ?', [id]);
            connection.release();
        }catch(error){
            console.log(error);
        }
    }

    async updateNameById(id,name){
        try{
            id = parseInt(id, 10);
            const connection = await pool.getConnection();
            const result = await connection.execute("UPDATE names SET name = ? WHERE id = ?", [name, id]);
            connection.release();
            return result;
        }catch(error){
            console.log(error);
        }
    }

    async searchByName(name){
        try{
            const connection = await pool.getConnection();
            const [rows] = await connection.execute('SELECT * FROM names WHERE name LIKE ?', [`%${name}%`]);
            connection.release();
            return rows;
        } catch(error){
            console.log(error);
        }
    }
}
module.exports = DbService;