import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
console.log('Tables in DB:', res.rows.map(r => r.table_name));
await pool.end();
