const { Pool } = require('pg');

const createUsersTable = async (db) => {
  await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await db.query(`CREATE TABLE IF NOT EXISTS users(
                        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                        name VARCHAR(255),
                        email VARCHAR(255) NOT NULL UNIQUE,
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

const createVerifyTokenTable = async (db) => {
  await db.query(`CREATE TABLE IF NOT EXISTS verification_token(
                        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                        email VARCHAR(255) NOT NULL,
                        token TEXT NOT NULL UNIQUE,
                        expires TIMESTAMPTZ NOT NULL,
                        UNIQUE(email,token)
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
  await createVerifyTokenTable(db);

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
