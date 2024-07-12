const { Pool } = require('pg');

const createUsersTable = async (db) => {
  await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await db.query(`CREATE TABLE IF NOT EXISTS users(
                        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                        name VARCHAR(255),
                        email VARCHAR(255),
                        password VARCHAR(255),
                        role role_enum DEFAULT 'USER',
                        "emailVerified" TIMESTAMPTZ,
                        image TEXT
                )`);
};

const createAccountsTable = async (db) => {
  await db.query(`CREATE TABLE IF NOT EXISTS accounts(
                        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                        "userId" UUID NOT NULL,
                        type VARCHAR(255) NOT NULL,
                        provider VARCHAR(255) NOT NULL,
                        "providerAccountId" VARCHAR(255) NOT NULL,
                        refresh_token TEXT,
                        access_token TEXT,
                        expires_at BIGINT,
                        id_token TEXT,
                        scope TEXT,
                        session_state TEXT,
                        token_type TEXT,
                        FOREIGN KEY ("userId") REFERENCES users(id)
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

  await createUsersTable(db);
  await createAccountsTable(db);

  db.release();
};

main()
  .then(() => console.log('Tables created successfully 🎉'))
  .catch((error) => console.log(error));

//   CREATE OR REPLACE PROCEDURE getEmailById(IN user_id INT)
// LANGUAGE plpgsql
// AS $$
// BEGIN
//     SELECT email FROM users WHERE users.id = user_id;
// END;
// $$;

const process = require('process');

// Define a class for Terminal
class Terminal_Dimensions {
  constructor() {
    this.width = process.stdout.columns;
    this.height = process.stdout.rows;
  }
}

// Implement timing
let timing_start;
const time_limit = 9999; // maximum time limit in milliseconds

const timing_start_m_ = () => {
  timing_start = new Date();
};

const timing_end_m_ = () => {
  let timing_end = new Date();
  let time_spent = timing_end - timing_start; // in ms

  return time_spent;
};

// Optimized function to test the timing mechanism
const some_function_w_ = () => {
  for (let i = 0; i < 999999; i++) {
    // Some operation
  }
};

// Run function with timing
let my_terminal = new Terminal_Dimensions();
console.log(
  `Terminal dimensions: ${my_terminal.width} x ${my_terminal.height}`
);

timing_start_m_();
some_function_w_();
let execution_time = timing_end_m_();

if (execution_time > time_limit) {
  console.log(`Execution took too long! Time: ${execution_time} ms`);
}
