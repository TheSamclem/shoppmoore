const mysql = require('mysql2/promise');

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });

        console.log(`MySQL Connected: ${connection.config.host}`.cyan.underline);
        return connection;
    } catch (e) {
        console.error(`Database Error: ${e.message}`.red.underline.bold);
        process.exit(1);
    }
}

const  getCustomQuery = async(query, callback) => {
    connectDB.query(query, (err, result) => {
      if (err) {
        return callback(err);
      }
      if (result.length === 0) {
        return callback(null, null);
      }
      callback(null, result);
    });
  }
module.exports =   connectDB;
