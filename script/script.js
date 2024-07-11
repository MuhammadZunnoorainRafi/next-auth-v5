const { Pool } = require('pg');

const createTestTable = async (db) => {
  await db.query(`CREATE TABLE IF NOT EXISTS test(
        name TEXT,
        email TEXT
        )`);
};

const main = async () => {
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: +process.env.DATABASE_PORT,
  });

  const db = await pool.connect();

  await createTestTable(db);
};

main()
  .then(() => console.log('Tables created successfully 🎉'))
  .catch((error) => console.log('Error while creating Tables =', error));
