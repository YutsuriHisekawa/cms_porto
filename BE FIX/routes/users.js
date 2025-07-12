const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const defaultUpload = require('multer')({ dest: 'uploads/' });
const slugify = (str) => str.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const UserSkill = require('../models/UserSkill');
const UserSocial = require('../models/UserSocial');

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
            'SELECT id, nama, nama_lengkap, username, email, role, profile_picture, description, created_at, updated_at, slug, no_telp FROM users'
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
        // Generate slug unik dari username (atau nama_lengkap jika username kosong)
        let baseSlug = slugify(username || nama_lengkap);
        let slug = baseSlug;
        let slugIndex = 1;
        // Cek slug unik
        while (true) {
          const slugCheck = await pool.query('SELECT 1 FROM users WHERE slug = $1', [slug]);
          if (slugCheck.rowCount === 0) break;
          slug = `${baseSlug}-${slugIndex++}`;
        }
        const insertQuery = `INSERT INTO users (nama_lengkap, username, email, password_hash, role, slug) VALUES ($1, $2, $3, $4, 'USER', $5) RETURNING id, nama_lengkap, username, email, role, created_at, slug`;
        const values = [nama_lengkap, username, email, password_hash, slug];
        const result = await pool.query(insertQuery, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user by slug (for profile update, including image upload)
router.put('/:slug', authMiddleware, defaultUpload.single('profile_picture'), async (req, res) => {
    const { slug } = req.params;
    try {
        // Find user by slug
        const userResult = await pool.query('SELECT * FROM users WHERE slug = $1', [slug]);
        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = userResult.rows[0];
        // Only allow user to update themselves
        if (req.user.id !== user.id) {
            return res.status(403).json({ error: 'Forbidden: cannot update other users' });
        }
        let profile_picture_url = user.profile_picture;
        if (req.file) {
            const fs = require('fs');
            const path = require('path');
            const uploadDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
            const filename = `profile_${user.id}_${Date.now()}${path.extname(req.file.originalname)}`;
            const filepath = path.join(uploadDir, filename);
            fs.renameSync(req.file.path, filepath);
            profile_picture_url = `/uploads/${filename}`;
        }
        // Safe access for body fields
        const nama = req.body?.nama;
        const nama_lengkap = req.body?.nama_lengkap;
        const username = req.body?.username;
        const email = req.body?.email;
        const description = req.body?.description;
        const no_telp = req.body?.no_telp;
        const skill_d = req.body?.skill_d ? JSON.parse(req.body.skill_d) : undefined;
        const sosial_d = req.body?.sosial_d ? JSON.parse(req.body.sosial_d) : undefined;
        // Debug log untuk pengalaman_kerja_d
        console.log('DEBUG pengalaman_kerja_d:', req.body.pengalaman_kerja_d);
        const pengalaman_kerja_d = req.body?.pengalaman_kerja_d ? JSON.parse(req.body.pengalaman_kerja_d) : undefined;
        const fields = [];
        const values = [];
        let idx = 1;
        if (nama) { fields.push(`nama = $${idx++}`); values.push(nama); }
        if (nama_lengkap) { fields.push(`nama_lengkap = $${idx++}`); values.push(nama_lengkap); }
        if (username) { fields.push(`username = $${idx++}`); values.push(username); }
        if (email) { fields.push(`email = $${idx++}`); values.push(email); }
        if (description) { fields.push(`description = $${idx++}`); values.push(description); }
        if (no_telp !== undefined) { fields.push(`no_telp = $${idx++}`); values.push(no_telp); }
        if (profile_picture_url !== user.profile_picture) {
            fields.push(`profile_picture = $${idx++}`); values.push(profile_picture_url);
        }
        if (fields.length === 0 && !skill_d && !sosial_d && !pengalaman_kerja_d) {
            return res.status(400).json({ error: 'Tidak ada data yang diubah' });
        }
        if (fields.length > 0) {
            const updateQuery = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING id, nama, nama_lengkap, username, email, role, profile_picture, description, created_at, updated_at, slug, no_telp`;
            values.push(user.id);
            await pool.query(updateQuery, values);
        }
        // Update skills
        if (Array.isArray(skill_d)) {
            await UserSkill.destroy({ where: { user_id: user.id } });
            for (const skill of skill_d) {
                if (skill.skill_name) {
                    await UserSkill.create({ user_id: user.id, skill_name: skill.skill_name, skill_level: skill.skill_level });
                }
            }
        }
        // Update socials
        if (Array.isArray(sosial_d)) {
            await UserSocial.destroy({ where: { user_id: user.id } });
            for (const social of sosial_d) {
                if (social.platform && social.url) {
                    await UserSocial.create({ user_id: user.id, platform: social.platform, url: social.url });
                }
            }
        }
        // Update pengalaman kerja
        if (Array.isArray(pengalaman_kerja_d)) {
            // Hapus semua pengalaman lama user
            await pool.query('DELETE FROM pengalaman_kerja_d WHERE user_id = $1', [user.id]);
            // Insert ulang
            for (const exp of pengalaman_kerja_d) {
                // Use nama_perusahaan as per DB schema
                const nama_perusahaan = exp.nama_perusahaan || exp.perusahaan || '';
                if (exp.posisi && nama_perusahaan && exp.tanggal_mulai) {
                    await pool.query(
                        `INSERT INTO pengalaman_kerja_d (user_id, posisi, nama_perusahaan, deskripsi, tanggal_mulai, tanggal_akhir, stay) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                        [user.id, exp.posisi, nama_perusahaan, exp.deskripsi || '', exp.tanggal_mulai, exp.tanggal_akhir || null, exp.stay || false]
                    );
                }
            }
        }
        // Get updated user with skills and socials
        const updatedUserResult = await pool.query('SELECT id, nama, nama_lengkap, username, email, role, profile_picture, description, created_at, updated_at, slug, no_telp FROM users WHERE id = $1', [user.id]);
        const updatedUser = updatedUserResult.rows[0];
        updatedUser.skill_d = await UserSkill.findAll({ where: { user_id: user.id } });
        updatedUser.sosial_d = await UserSocial.findAll({ where: { user_id: user.id } });
        // Tambahkan pengalaman_kerja_d ke response
        const pengalamanRes = await pool.query('SELECT * FROM pengalaman_kerja_d WHERE user_id = $1 ORDER BY tanggal_mulai DESC', [user.id]);
        updatedUser.pengalaman_kerja_d = pengalamanRes.rows;
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user (requires auth, super admin can update any user)
router.put('/:id', authMiddleware, validateUuidParam, async (req, res) => {
    const { id } = req.params;
    // Accept all possible updatable fields
    const { nama_lengkap, username, email, password, description, profile_picture } = req.body;
    // Only allow user to update themselves (unless super admin logic is added)
    if (req.user.id !== id) {
        return res.status(403).json({ error: 'Forbidden: cannot update other users' });
    }
    if (!nama_lengkap && !username && !email && !password && !description && !profile_picture) {
        return res.status(400).json({ error: 'At least one field must be provided' });
    }
    try {
        let updateQuery = 'UPDATE users SET ';
        const fields = [];
        const values = [];
        let idx = 1;
        if (nama_lengkap) {
            fields.push(`nama_lengkap = $${idx++}`);
            values.push(nama_lengkap);
        }
        if (username) {
            fields.push(`username = $${idx++}`);
            values.push(username);
        }
        if (email) {
            fields.push(`email = $${idx++}`);
            values.push(email);
        }
        if (description) {
            fields.push(`description = $${idx++}`);
            values.push(description);
        }
        if (profile_picture) {
            fields.push(`profile_picture = $${idx++}`);
            values.push(profile_picture);
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);
            fields.push(`password_hash = $${idx++}`);
            values.push(password_hash);
        }
        updateQuery += fields.join(', ') + ` WHERE id = $${idx} RETURNING id, nama_lengkap, username, email, role, profile_picture, description, created_at, updated_at, slug`;
        values.push(id);
        const result = await pool.query(updateQuery, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Tambahkan pengalaman_kerja_d ke response
        let pengalaman_kerja_d = [];
        try {
            const pengalamanRes = await pool.query('SELECT * FROM pengalaman_kerja_d WHERE user_id = $1 ORDER BY tanggal_mulai DESC', [id]);
            pengalaman_kerja_d = Array.isArray(pengalamanRes.rows) ? pengalamanRes.rows : [];
        } catch (e) {
            pengalaman_kerja_d = [];
        }
        const userWithPengalaman = { ...result.rows[0], pengalaman_kerja_d };
        res.json(userWithPengalaman);
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
            'SELECT id, nama, nama_lengkap, username, email, role, profile_picture, description, created_at, updated_at, slug, no_telp FROM users WHERE slug = $1',
            [slug]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const user = result.rows[0];
        // Get skills
        const skillRes = await pool.query('SELECT * FROM skill_d WHERE user_id = $1', [user.id]);
        user.skill_d = skillRes.rows;
        // Get socials
        const sosialRes = await pool.query('SELECT * FROM sosial_d WHERE user_id = $1', [user.id]);
        user.sosial_d = sosialRes.rows;
        // Get pengalaman kerja
        const pengalamanRes = await pool.query('SELECT * FROM pengalaman_kerja_d WHERE user_id = $1 ORDER BY tanggal_mulai DESC', [user.id]);
        user.pengalaman_kerja_d = pengalamanRes.rows;

        res.json(user);
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

// PATCH /users/:slug/password - Ganti password user
router.patch('/:slug/password', authMiddleware, async (req, res) => {
    const { slug } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'Semua field password wajib diisi.' });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'Password baru dan konfirmasi tidak sama.' });
    }
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE slug = $1', [slug]);
        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan.' });
        }
        const user = userResult.rows[0];
        // Hanya user sendiri yang boleh ganti password
        if (req.user.id !== user.id) {
            return res.status(403).json({ error: 'Forbidden: tidak boleh ganti password user lain.' });
        }
        const match = await bcrypt.compare(oldPassword, user.password_hash);
        if (!match) {
            return res.status(400).json({ error: 'Password lama salah.' });
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(newPassword, salt);
        await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [password_hash, user.id]);
        res.json({ message: 'Password berhasil diubah.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = { router, setPool };