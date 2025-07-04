const { v4: uuidv4 } = require('uuid');

async function createProject(pool, { title, description, upload_header }) {
  if (!title || !description || !upload_header) {
    return { error: 'Semua field wajib diisi', status: 400 };
  }

  const uuid = uuidv4();
  const insertQuery = `
    INSERT INTO project (uuid, title, description, upload_header)
    VALUES ($1, $2, $3, $4)
    RETURNING uuid, title, description, upload_header
  `;
  const values = [uuid, title, description, upload_header];
  const result = await pool.query(insertQuery, values);
  return { project: result.rows[0] };
}

async function getAllProjects(pool) {
  const { rows } = await pool.query('SELECT uuid, title, description, upload_header FROM project ORDER BY created_at DESC');
  return rows;
}

async function getProjectByUuid(pool, uuid) {
  const result = await pool.query(
    'SELECT uuid, title, description, upload_header FROM project WHERE uuid = $1',
    [uuid]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
}

async function updateProject(pool, uuid, { title, description, upload_header }) {
  let updateQuery = 'UPDATE project SET ';
  const fields = [];
  const values = [];
  let idx = 1;

  if (title) {
    fields.push(`title = $${idx++}`);
    values.push(title);
  }
  if (description) {
    fields.push(`description = $${idx++}`);
    values.push(description);
  }
  if (upload_header) {
    fields.push(`upload_header = $${idx++}`);
    values.push(upload_header);
  }

  if (fields.length === 0) return null;

  updateQuery += fields.join(', ') + ` WHERE uuid = $${idx} RETURNING uuid, title, description, upload_header`;
  values.push(uuid);

  const result = await pool.query(updateQuery, values);
  if (result.rowCount === 0) return null;
  return result.rows[0];
}

async function deleteProject(pool, uuid) {
  const result = await pool.query(
    'DELETE FROM project WHERE uuid = $1 RETURNING uuid, title, description, upload_header',
    [uuid]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectByUuid,
  updateProject,
  deleteProject
};
