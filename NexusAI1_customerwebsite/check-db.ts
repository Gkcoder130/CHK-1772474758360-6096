import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL?.replace('/nexusai', '/postgres') });
const res = await pool.query('SELECT datname FROM pg_database');
console.log('Databases:', res.rows.map(r => r.datname));
await pool.end();
