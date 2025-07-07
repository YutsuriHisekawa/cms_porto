// Seeder untuk mengisi slug pada user yang belum punya slug
dotenv = require('dotenv'); dotenv.config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function fillMissingSlugs() {
  const { rows } = await pool.query("SELECT id, username, nama_lengkap FROM users WHERE slug IS NULL OR slug = ''");
  for (const user of rows) {
    let baseSlug = slugify(user.username || user.nama_lengkap || 'user');
    let slug = baseSlug;
    let slugIndex = 1;
    // Pastikan slug unik
    while (true) {
      const check = await pool.query('SELECT 1 FROM users WHERE slug = $1', [slug]);
      if (check.rowCount === 0) break;
      slug = `${baseSlug}-${slugIndex++}`;
    }
    await pool.query('UPDATE users SET slug = $1 WHERE id = $2', [slug, user.id]);
    console.log(`User ${user.id} diupdate slug: ${slug}`);
  }
  await pool.end();
  console.log('Selesai update slug user yang belum punya slug.');
}

fillMissingSlugs().catch(e => { console.error(e); process.exit(1); });
