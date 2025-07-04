// Service layer for orang_d CRUD
let pool;

function setPool(pgPool) {
    pool = pgPool;
}

function setPoolFrom(poolOrClient) {
    // Untuk mendukung transaksi, pool bisa berupa client
    pool = poolOrClient;
}

async function getAllByOrangUuid(orang_uuid) {
    const { rows } = await pool.query('SELECT * FROM orang_d WHERE orang_uuid = $1', [orang_uuid]);
    return rows;
}

async function getByUuid(uuid) {
    const { rows } = await pool.query('SELECT * FROM orang_d WHERE uuid = $1', [uuid]);
    return rows[0];
}

async function createOrangD({ orang_uuid, alamat }) {
    const { rows } = await pool.query(
        'INSERT INTO orang_d (orang_uuid, alamat) VALUES ($1, $2) RETURNING *',
        [orang_uuid, alamat]
    );
    return rows[0];
}

async function updateOrangD(uuid, { alamat }) {
    const { rows } = await pool.query(
        'UPDATE orang_d SET alamat = $1 WHERE uuid = $2 RETURNING *',
        [alamat, uuid]
    );
    return rows[0];
}

async function deleteOrangD(uuid) {
    const { rows } = await pool.query('DELETE FROM orang_d WHERE uuid = $1 RETURNING *', [uuid]);
    return rows[0];
}

module.exports = {
    setPool,
    setPoolFrom,
    getAllByOrangUuid,
    getByUuid,
    createOrangD,
    updateOrangD,
    deleteOrangD
};
