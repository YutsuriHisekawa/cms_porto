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

async function deleteProjectDetailsExcept(pool, project_uuid, keepUuids) {
    if (!Array.isArray(keepUuids) || keepUuids.length === 0) {
        // Hapus semua detail jika tidak ada yang dipertahankan
        await pool.query('DELETE FROM project_d WHERE project_uuid = $1', [project_uuid]);
    } else {
        await pool.query(
            `DELETE FROM project_d WHERE project_uuid = $1 AND uuid NOT IN (${keepUuids.map((_, i) => `$${i+2}`).join(',')})`,
            [project_uuid, ...keepUuids]
        );
    }
}

module.exports = {
    addProjectDetail,
    getAllDetails,
    deleteProjectDetailsExcept,
    setPool
};
