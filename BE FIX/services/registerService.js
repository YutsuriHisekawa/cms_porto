const bcrypt = require('bcryptjs');

async function registerUser(pool, { nama, username, email, password, repassword }) {
    if (!nama || !username || !email || !password || !repassword) {
        return { error: 'Semua field wajib diisi', status: 400 };
    }
    if (!email.includes('@')) {
        return { error: 'Email tidak valid', status: 400 };
    }
    if (password !== repassword) {
        return { error: 'Password dan re-password harus sama', status: 400 };
    }
    // Cek username/email sudah ada
    const existing = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existing.rowCount > 0) {
        return { error: 'Username atau email sudah terdaftar', status: 409 };
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    // Insert user baru dengan role USER
    const insertQuery = `INSERT INTO users (nama, username, email, password_hash, role) VALUES ($1, $2, $3, $4, 'USER') RETURNING id, nama, username, email, role, created_at`;
    const values = [nama, username, email, password_hash];
    const result = await pool.query(insertQuery, values);
    return { user: result.rows[0] };
}

module.exports = { registerUser };
