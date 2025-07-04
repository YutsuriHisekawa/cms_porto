const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

async function loginUser(pool, { username, password }) {
    if (!username || !password) {
        return { error: 'Username dan password wajib diisi', status: 400 };
    }
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rowCount === 0) {
        return { error: 'Username atau password salah', status: 401 };
    }
    const user = userResult.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        return { error: 'Username atau password salah', status: 401 };
    }
    const payload = { id: user.id, username: user.username, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return { token };
}

module.exports = { loginUser };
