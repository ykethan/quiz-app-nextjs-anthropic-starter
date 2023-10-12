const { Pool } = require("pg");

(async () => {
  let dbInfo;
  if (process.env.DB_SECRET) {
    try {
      dbInfo = JSON.parse(process.env.DB_SECRET);
    } catch (error) {
      console.error("Failed to parse DB_SECRET:", error);
      process.exit(1);
    }
  } else {
    console.error("DB_SECRET not provided.");
    process.exit(1);
  }

  const pool = new Pool({
    user: dbInfo.username,
    host: dbInfo.host,
    database: dbInfo.dbname,
    password: dbInfo.password,
    port: Number(dbInfo.port),
  });

  try {
    // Create user table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(15) PRIMARY KEY,
                username VARCHAR(31) NOT NULL,
                avatar_url VARCHAR(255) NOT NULL
            );
        `);
    console.log("'users' table created/checked.");

    // Create user_key table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS user_key (
                id VARCHAR(255) PRIMARY KEY,
                user_id VARCHAR(15) NOT NULL,
                hashed_password VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
    console.log("'user_key' table checked/created.");

    // Create user_session table
    await pool.query(`
            CREATE TABLE IF NOT EXISTS user_session (
                id VARCHAR(127) PRIMARY KEY,
                user_id VARCHAR(15) NOT NULL,
                active_expires BIGINT NOT NULL,
                idle_expires BIGINT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
    console.log("'user_session' table checked/created.");
  } catch (error) {
    console.error("Error creating/checking tables:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
