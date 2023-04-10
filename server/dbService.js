const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

let instance = null;
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    db_port: process.env.DB_PORT,
    port: process.env.PORT
    
});

(async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('Connected to database');
    } catch (err) {
        console.log('Error connecting to database', err);
    } finally {
        if (conn) {
            conn.release();
        }
    }
})();


class DbService {
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }
    async getAllData(){
        try{
            const response = await new Promise ((resolve,reject)=>{
                const query ="SELECT * FROM names;";

                Connection.query(query,(err,results)=>{
                    if (err) reject (new Error(err.message));
                    resolve(results);
                })
            });
            console.log(response);

            return response;
        } catch(error){
            console.log(error);
        }
    }
}

module.exports = DbService;