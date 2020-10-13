const mysql = require('mysql');
const dbOption = require('./config');

const pool = mysql.createPool(dbOption);

function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.getConnection(( connErr, conn ) => {
      if (connErr) {
        reject(connErr);
        return;
      }
      conn.query(sql, params, (queryErr, result) => {
        conn.release();
        if(queryErr) {
          reject(queryErr);
          return;
        }
        resolve(result);
      })
    })
  })
}

module.exports = query;