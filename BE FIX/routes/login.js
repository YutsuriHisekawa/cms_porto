const express = require('express');
const router = express.Router();
let pool;
function setPool(pgPool) {
    pool = pgPool;
}

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Endpoint login untuk mendapatkan JWT
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rowCount === 0) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }
        const user = userResult.rows[0];
        const bcrypt = require('bcryptjs');
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Username atau password salah' });
        }
        // Generate JWT
        const payload = { id: user.id, username: user.username, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        // Ambil data user tanpa password_hash
        const { password_hash, ...userData } = user;
        res.json({ token, user: userData });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Endpoint untuk validasi token
router.post('/validate-token', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token wajib dikirim di body' });
    }
    try {
        const decoded = await jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, message: 'Token valid', decoded });
    } catch (err) {
        res.status(401).json({ valid: false, message: 'TOKEN TIDAK VALID' });
    }
});

module.exports = { router, setPool };
