const express = require('express');
const router = express.Router();

let pool;
function setPool(pgPool) {
    pool = pgPool;
}

// Middleware auth diambil dari users.js
env = process.env;
const jwt = require('jsonwebtoken');
const JWT_SECRET = env.JWT_SECRET || 'secretkey';
async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: token required' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
}

// CREATE pengalaman kerja
router.post('/:user_id', authMiddleware, async (req, res) => {
    const { user_id } = req.params;
    const { posisi, perusahaan, lokasi, tanggal_mulai, tanggal_selesai, deskripsi } = req.body;
    if (!posisi || !perusahaan || !tanggal_mulai) {
        return res.status(400).json({ error: 'Field wajib: posisi, perusahaan, tanggal_mulai' });
    }
    try {
        const result = await pool.query(
            `INSERT INTO pengalaman_kerja_d (user_id, posisi, perusahaan, lokasi, tanggal_mulai, tanggal_selesai, deskripsi) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [user_id, posisi, perusahaan, lokasi, tanggal_mulai, tanggal_selesai, deskripsi]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE pengalaman kerja
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { posisi, perusahaan, lokasi, tanggal_mulai, tanggal_selesai, deskripsi } = req.body;
    try {
        const result = await pool.query(
            `UPDATE pengalaman_kerja_d SET posisi=$1, perusahaan=$2, lokasi=$3, tanggal_mulai=$4, tanggal_selesai=$5, deskripsi=$6 WHERE id=$7 RETURNING *`,
            [posisi, perusahaan, lokasi, tanggal_mulai, tanggal_selesai, deskripsi, id]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE pengalaman kerja
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM pengalaman_kerja_d WHERE id=$1 RETURNING id', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = { router, setPool };
