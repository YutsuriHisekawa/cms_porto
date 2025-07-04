const { v4: uuidv4 } = require('uuid');

let _pool = null;
function setPool(pgPool) { _pool = pgPool; }

async function addProjectDetail(pool, { project_uuid, picture_url }) {
    if (!project_uuid || !picture_url) {
        return { error: 'project_uuid dan picture_url wajib diisi', status: 400 };
    }
    const uuid = uuidv4();
    const insertQuery = `INSERT INTO project_d (uuid, project_uuid, picture_url) VALUES ($1, $2, $3) RETURNING uuid, project_uuid, picture_url`;
    const values = [uuid, project_uuid, picture_url];
    const result = await pool.query(insertQuery, values);
    return { detail: result.rows[0] };
}

async function getAllDetails(pool) {
    const { rows } = await pool.query('SELECT uuid, project_uuid, picture_url FROM project_d');
    return rows;
}

module.exports = {
    addProjectDetail,
    getAllDetails,
    setPool
};
