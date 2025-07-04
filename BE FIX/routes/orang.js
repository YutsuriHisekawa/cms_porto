const express = require('express');
const router = express.Router();
const orangService = require('../services/orangService');

let pool;
function setPool(pgPool) { pool = pgPool; orangService.setPool(pool); }

// CREATE header + detail (nested)
router.post('/', async (req, res) => {
  const { nama, umur, orang_d } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Insert header
    const header = await orangService.createOrang(client, { nama, umur });
    let details = [];
    if (Array.isArray(orang_d) && orang_d.length > 0) {
      for (const d of orang_d) {
        const result = await client.query(
          'INSERT INTO orang_d (orang_uuid, alamat) VALUES ($1, $2) RETURNING *',
          [header.uuid, d.alamat]
        );
        details.push(result.rows[0]);
      }
    }
    await client.query('COMMIT');
    res.status(201).json({ ...header, orang_d: details });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const result = await orangService.getAllOrang(pool);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ BY ID + detail
router.get('/:uuid', async (req, res) => {
  try {
    const result = await orangService.getOrangByUuid(pool, req.params.uuid);
    if (!result) return res.status(404).json({ error: 'Not found' });
    // Ambil detail
    const orang_dService = require('../services/orang_dService');
    orang_dService.setPool(pool); // pastikan pool di-set
    const orang_d = await orang_dService.getAllByOrangUuid(req.params.uuid);
    res.json({ ...result, orang_d });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE header
router.put('/:uuid', async (req, res) => {
  try {
    const { nama, umur } = req.body;
    const result = await orangService.updateOrang(pool, req.params.uuid, { nama, umur });
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE header
router.delete('/:uuid', async (req, res) => {
  try {
    const result = await orangService.deleteOrang(pool, req.params.uuid);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', orang: result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = { router, setPool };
