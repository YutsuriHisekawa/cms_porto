const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Pool must be passed from the main app
let pool;
function setPool(pgPool) {
    pool = pgPool;
}

// JWT auth middleware (checks Authorization: Bearer <token> and validates user in DB)
async function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: token required' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        // Verify user still exists in database
        const userResult = await pool.query(
            'SELECT * FROM users WHERE id = $1 AND username = $2 AND email = $3', 
            [payload.id, payload.username, payload.email]
        );
        if (userResult.rowCount === 0) {
            return res.status(401).json({ error: 'Unauthorized: invalid user' });
        }
        req.user = payload; // can be used in handlers
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
}

// Validate UUID parameter middleware
function validateUuidParam(req, res, next) {
    const { id } = req.params;
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
        return res.status(400).json({ error: 'ID must be a valid UUID' });
    }
    next();
}

// Get all users (public, no auth)
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT id, nama, nama_lengkap, username, email, role, profile_picture, description, created_at, updated_at, slug FROM users'
        );
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /users - public registration endpoint (no auth)
router.post('/', async (req, res) => {
    const { nama_lengkap, username, email, password, repassword } = req.body;
    if (!nama_lengkap || !username || !email || !password || !repassword) {
        return res.status(400).json({ error: 'Semua field wajib diisi' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Email tidak valid' });
    }
    if (password !== repassword) {
        return res.status(400).json({ error: 'Password dan re-password harus sama' });
    }
    try {
        const existing = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existing.rowCount > 0) {
            return res.status(409).json({ error: 'Username atau email sudah terdaftar' });
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const insertQuery = `INSERT INTO users (nama_lengkap, username, email, password_hash, role) VALUES ($1, $2, $3, $4, 'USER') RETURNING id, nama_lengkap, username, email, role, created_at`;
        const values = [nama_lengkap, username, email, password_hash];
        const result = await pool.query(insertQuery, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user (requires auth, super admin can update any user)
router.put('/:id', authMiddleware, validateUuidParam, async (req, res) => {
    const { id } = req.params;
    const { nama, email, password } = req.body;
    // Super admin (id === 'uuid-superadmin') boleh update siapa saja, user lain hanya boleh update dirinya sendiri
    if (req.user.id !== id) {
        return res.status(403).json({ error: 'Forbidden: cannot update other users' });
    }
    if (!nama && !email && !password) {
        return res.status(400).json({ error: 'At least one field must be provided' });
    }
    try {
        let updateQuery = 'UPDATE users SET ';
        const fields = [];
        const values = [];
        let idx = 1;
        if (nama) {
            fields.push(`nama = $${idx++}`);
            values.push(nama);
        }
        if (email) {
            fields.push(`email = $${idx++}`);
            values.push(email);
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);
            fields.push(`password_hash = $${idx++}`);
            values.push(password_hash);
        }
        updateQuery += fields.join(', ') + ` WHERE id = $${idx} RETURNING id, nama, username, email, role, created_at`;
        values.push(id);
        const result = await pool.query(updateQuery, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user by slug (public, no auth)
router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, nama, nama_lengkap, username, email, role, profile_picture, description, created_at, updated_at, slug FROM users WHERE slug = $1',
            [slug]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user (hanya super admin/role MASTER yang boleh)
router.delete('/:id', authMiddleware, validateUuidParam, async (req, res) => {
    const { id } = req.params;
    // Hanya user dengan role MASTER yang boleh delete user
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (userResult.rowCount === 0 || userResult.rows[0].role !== 'MASTER') {
        return res.status(403).json({ error: 'Forbidden: hanya super admin yang boleh delete user' });
    }
    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, nama, username, email, role, created_at', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
        }
        res.json({ message: 'User berhasil dihapus', user: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = { router, setPool };