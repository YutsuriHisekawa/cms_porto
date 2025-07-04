const express = require('express');
const router = express.Router();
let pool;

function setPool(pgPool) {
    pool = pgPool;
}

// GET all orang_d
router.get('/', async (req, res) => {
    try {
        let result;
        if (req.query.join === 'true') {
            result = await pool.query(`
                SELECT orang_d.*, orang.uuid AS orang_uuid_asli, orang.nama, orang.umur
                FROM orang_d
                JOIN orang ON orang_d.orang_uuid = orang.uuid
            `);
            const orangDCols = ['uuid', 'orang_uuid', 'alamat'];
            const data = result.rows.map(row => {
                const newRow = {};
                for (const key in row) {
                    if (orangDCols.includes(key)) {
                        newRow[key] = row[key];
                    } else if (key === 'orang_uuid_asli') {
                        newRow['orang.uuid'] = row[key];
                    } else {
                        newRow[`orang.${key}`] = row[key];
                    }
                }
                return newRow;
            });
            res.json(data);
        } else {
            result = await pool.query('SELECT * FROM orang_d');
            res.json(result.rows);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all orang_d for a specific orang_uuid
router.get('/:orang_uuid', async (req, res) => {
    try {
        const { orang_uuid } = req.params;
        const result = await pool.query('SELECT * FROM orang_d WHERE orang_uuid = $1', [orang_uuid]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single orang_d by uuid
router.get('/detail/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const result = await pool.query('SELECT * FROM orang_d WHERE uuid = $1', [uuid]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new orang_d
router.post('/', async (req, res) => {
    try {
        const { orang_uuid, alamat } = req.body;
        const result = await pool.query(
            'INSERT INTO orang_d (orang_uuid, alamat) VALUES ($1, $2) RETURNING *',
            [orang_uuid, alamat]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update orang_d
router.put('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const { alamat } = req.body;
        const result = await pool.query(
            'UPDATE orang_d SET alamat = $1 WHERE uuid = $2 RETURNING *',
            [alamat, uuid]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE orang_d
router.delete('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const result = await pool.query('DELETE FROM orang_d WHERE uuid = $1 RETURNING *', [uuid]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = { router, setPool };
