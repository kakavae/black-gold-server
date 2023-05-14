const mysql = require('mysql')


const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'my_db_03'
})


/* const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'rootlw',
  password: 'kk19990214',
  database: 'my_db_03'
}) */

module.exports = db
