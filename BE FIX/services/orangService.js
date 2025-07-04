const { v4: uuidv4 } = require('uuid');
let _pool = null;
function setPool(pgPool) { _pool = pgPool; }

// createOrang menerima client (bukan pool) jika transaksi
async function createOrang(clientOrPool, { nama, umur }) {
  const uuid = uuidv4();
  const result = await clientOrPool.query(
    'INSERT INTO orang (uuid, nama, umur) VALUES ($1, $2, $3) RETURNING uuid, nama, umur',
    [uuid, nama, umur]
  );
  return result.rows[0];
}

async function getAllOrang(pool) {
  const { rows } = await pool.query('SELECT uuid, nama, umur FROM orang');
  return rows;
}

async function getOrangByUuid(pool, uuid) {
  const result = await pool.query('SELECT uuid, nama, umur FROM orang WHERE uuid = $1', [uuid]);
  if (result.rowCount === 0) return null;
  return result.rows[0];
}

async function updateOrang(pool, uuid, { nama, umur }) {
  const result = await pool.query(
    'UPDATE orang SET nama = $1, umur = $2 WHERE uuid = $3 RETURNING uuid, nama, umur',
    [nama, umur, uuid]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
}

async function deleteOrang(pool, uuid) {
  const result = await pool.query('DELETE FROM orang WHERE uuid = $1 RETURNING uuid, nama, umur', [uuid]);
  if (result.rowCount === 0) return null;
  return result.rows[0];
}

module.exports = {
  createOrang,
  getAllOrang,
  getOrangByUuid,
  updateOrang,
  deleteOrang,
  setPool
};
