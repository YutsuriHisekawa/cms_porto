const express = require('express');
const router = express.Router();

let pool;
function setPool(pgPool) { pool = pgPool; }

router.get('/:table', async (req, res) => {
  const { table } = req.params;
  try {
    // Info kolom
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [table]);

    // Info foreign key
    const fks = await pool.query(`
      SELECT
        kcu.column_name,
        ccu.table_name AS foreign_table,
        ccu.column_name AS foreign_column
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1
    `, [table]);

    const fkMap = {};
    fks.rows.forEach(fk => {
      fkMap[fk.column_name] = `${fk.foreign_table}.${fk.foreign_column}`;
    });

    // Format sesuai permintaan
    const result = {};
    columns.rows.forEach(col => {
      const required = col.is_nullable === 'NO' ? 'required' : 'optional';
      let type = col.data_type;
      if (type === 'character varying') type = 'string';
      if (type === 'timestamp without time zone') type = 'timestamp';
      if (fkMap[col.column_name]) {
        result[col.column_name] = `{${required}}-[${type}]-<data:{\"src\":\"${fkMap[col.column_name]}\"}>`;
      } else {
        result[col.column_name] = `{${required}}-[${type}]-<data:input>`;
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint untuk meta header + detail
router.get('/with-detail/:table', async (req, res) => {
  const { table } = req.params;
  try {
    // Metadata header
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [table]);

    // Foreign key info (header)
    const fks = await pool.query(`
      SELECT
        kcu.column_name,
        ccu.table_name AS foreign_table,
        ccu.column_name AS foreign_column
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1
    `, [table]);

    const fkMap = {};
    fks.rows.forEach(fk => {
      fkMap[fk.column_name] = `${fk.foreign_table}.${fk.foreign_column}`;
    });

    // Format kolom header
    const header = {};
    columns.rows.forEach(col => {
      const required = col.is_nullable === 'NO' ? 'required' : 'optional';
      let type = col.data_type;
      if (type === 'character varying') type = 'string';
      if (type === 'timestamp without time zone') type = 'timestamp';
      if (fkMap[col.column_name]) {
        header[col.column_name] = `{${required}}-[${type}]-<data:{\"src\":\"${fkMap[col.column_name]}\"}>`;
      } else {
        header[col.column_name] = `{${required}}-[${type}]-<data:input>`;
      }
    });

    // Cari tabel detail (one-to-many, misal project_d)
    let detailTables = await pool.query(`
      SELECT
        tc.table_name AS detail_table,
        kcu.column_name AS detail_column
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND ccu.table_name = $1
    `, [table]);

    // Filter detailTables jika table = users, exclude project, project_d, project_detail
    let filteredDetailTables = detailTables.rows;
    if (table === 'users') {
      const exclude = ['project', 'project_d', 'project_detail'];
      filteredDetailTables = detailTables.rows.filter(dt => !exclude.includes(dt.detail_table));
    }

    // Tambahkan skill_d dan sosial_d jika table = users
    let extraDetails = [];
    if (table === 'users') {
      extraDetails = [
        { detail_table: 'skill_d', detail_column: 'user_id' },
        { detail_table: 'sosial_d', detail_column: 'user_id' }
      ];
    }
    for (const detail of [...filteredDetailTables, ...extraDetails]) {
      // Ambil metadata detail
      const detailCols = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [detail.detail_table]);

      // Format kolom detail
      const detailMeta = [];
      detailCols.rows.forEach(col => {
        const required = col.is_nullable === 'NO' ? 'required' : 'optional';
        let type = col.data_type;
        if (type === 'character varying') type = 'string';
        if (type === 'timestamp without time zone') type = 'timestamp';
        detailMeta.push({
          [col.column_name]: `{${required}}-[${type}]-<data:input>`
        });
      });

      // Tambahkan ke header
      header[detail.detail_table] = detailMeta;
    }

    res.json(header);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /meta/register - dummy endpoint for meta register (for FE compatibility)
router.post('/register', (req, res) => {
  // You can return a static or dynamic meta for register fields
  res.json({
    nama: '{required}-[string]-<data:input>',
    username: '{required}-[string]-<data:input>',
    email: '{required}-[string]-<data:input>',
    password: '{required}-[string]-<data:input>'
  })
})

// GET /meta/register - meta info for register (for FE compatibility)
router.get('/register', (req, res) => {
  res.json({
    nama: '{required}-[string]-<data:input>',
    username: '{required}-[string]-<data:input>',
    email: '{required}-[string]-<data:input>',
    password: '{required}-[string]-<data:input>',
    repassword: '{required}-[string]-<data:input>'
  })
})

module.exports = { router, setPool };
