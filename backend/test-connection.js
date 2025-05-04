// test-connection.js
const pool = require('./src/db');
pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión MySQL OK');
    conn.release();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error conectando:', err);
    process.exit(1);
  });
