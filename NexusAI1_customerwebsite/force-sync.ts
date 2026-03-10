import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const sql = `
CREATE TABLE IF NOT EXISTS ai_services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT,
  category TEXT,
  icon_url TEXT
);

CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  industry_type TEXT,
  budget TEXT,
  call_preference TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
`;

try {
    await pool.query(sql);
    console.log('Tables forced successfully!');
} catch (e) {
    console.error('Error:', e.message);
} finally {
    await pool.end();
}
