const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
let pool;
function setPool(pgPool) {
    pool = pgPool;
}

// Register endpoint
router.post('/', async (req, res) => {
    const { nama, username, email, password, repassword } = req.body;
    // Validasi field
    if (!nama || !username || !email || !password || !repassword) {
        return res.status(400).json({ error: 'Semua field wajib diisi' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email tidak valid' });
    }
    if (password !== repassword) {
        return res.status(400).json({ error: 'Password dan re-password harus sama' });
    }
    try {
        // Cek username/email sudah ada
        const existing = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existing.rowCount > 0) {
            return res.status(409).json({ error: 'Username atau email sudah terdaftar' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        // Insert user baru dengan role USER
        const insertQuery = `INSERT INTO users (nama, username, email, password_hash, role) VALUES ($1, $2, $3, $4, 'USER') RETURNING id, nama, username, email, role, created_at`;
        const values = [nama, username, email, password_hash];
        const result = await pool.query(insertQuery, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = { router, setPool };
