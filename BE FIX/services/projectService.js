const { v4: uuidv4 } = require('uuid');

const slugify = (str) => str.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

async function createProject(pool, { title, description, upload_header, user_id }) {
  if (!title || !description || !upload_header || !user_id) {
    return { error: 'Semua field wajib diisi', status: 400 };
  }

  const uuid = uuidv4();
  let slug = slugify(title);
  // Ensure unique slug
  let slugCheck = await pool.query('SELECT 1 FROM project WHERE slug = $1', [slug]);
  let counter = 1;
  while (slugCheck.rowCount > 0) {
    slug = slugify(title) + '-' + counter;
    slugCheck = await pool.query('SELECT 1 FROM project WHERE slug = $1', [slug]);
    counter++;
  }

  const insertQuery = `
    INSERT INTO project (uuid, title, description, upload_header, user_id, slug)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING uuid, title, description, upload_header, user_id, slug
  `;
  const values = [uuid, title, description, upload_header, user_id, slug];
  const result = await pool.query(insertQuery, values);
  return { project: result.rows[0] };
}

async function getAllProjects(pool) {
  const { rows } = await pool.query(`
    SELECT uuid, title, description, upload_header, user_id, slug,
      (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') AS created_at,
      (updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') AS updated_at
    FROM project
    ORDER BY created_at DESC
  `);
  return rows;
}

async function getProjectByUuid(pool, uuid) {
  const result = await pool.query(
    `SELECT uuid, title, description, upload_header, slug,
      (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') AS created_at,
      (updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') AS updated_at
     FROM project WHERE uuid = $1`,
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

  updateQuery += fields.join(', ') + ` WHERE uuid = $${idx} RETURNING uuid, title, description, upload_header, slug`;
  values.push(uuid);

  const result = await pool.query(updateQuery, values);
  if (result.rowCount === 0) return null;
  return result.rows[0];
}

async function deleteProject(pool, uuid) {
  const result = await pool.query(
    'DELETE FROM project WHERE uuid = $1 RETURNING uuid, title, description, upload_header, slug',
    [uuid]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
}

async function getProjectWithDetails(pool, uuid) {
  // Ambil project utama
  const projectRes = await pool.query(
    'SELECT uuid, title, description, upload_header, slug FROM project WHERE uuid = $1',
    [uuid]
  );
  if (projectRes.rowCount === 0) return null;
  const project = projectRes.rows[0];

  // Ambil detail project_d
  const detailRes = await pool.query(
    'SELECT uuid, project_uuid, picture_url FROM project_d WHERE project_uuid = $1',
    [uuid]
  );
  project.project_d = detailRes.rows;
  return project;
}

async function getProjectDetailImages(pool, uuid) {
  const res = await pool.query(
    'SELECT picture_url FROM project_d WHERE project_uuid = $1',
    [uuid]
  );
  return res.rows.map(row => row.picture_url);
}

async function getProjectWithDetailsBySlug(pool, slug) {
  // Ambil project utama berdasarkan slug
  const projectRes = await pool.query(
    'SELECT uuid, title, description, upload_header, slug FROM project WHERE slug = $1',
    [slug]
  );
  if (projectRes.rowCount === 0) return null;
  const project = projectRes.rows[0];

  // Ambil detail project_d
  const detailRes = await pool.query(
    'SELECT uuid, project_uuid, picture_url FROM project_d WHERE project_uuid = $1',
    [project.uuid]
  );
  project.project_d = detailRes.rows;
  return project;
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectByUuid,
  updateProject,
  deleteProject,
  getProjectWithDetails,
  getProjectDetailImages,
  getProjectWithDetailsBySlug
};
