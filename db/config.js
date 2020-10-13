const dbOption = {
  connectionLimit: 10,
  host: process.env.NODE_ENV === 'production' ? '106.55.50.55' : 'localhost',
  user: 'root',
  password: '147258',
  posrt: '3306',
  database: 'kan_bar'
}

module.exports = dbOption;