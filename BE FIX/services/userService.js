const bcrypt = require('bcryptjs');

async function createUser(pool, { nama, username, email, password }) {
    if (!nama || !username || !email || !password) {
        return { error: 'All fields are required', status: 400 };
    }
    const existing = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (existing.rowCount > 0) {
        return { error: 'Username or email already registered', status: 409 };
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const insertQuery = `INSERT INTO users (nama, username, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, nama, username, email, role, (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') AS created_at`;
    const values = [nama, username, email, password_hash];
    const result = await pool.query(insertQuery, values);
    return { user: result.rows[0] };
}

async function getAllUsers(pool) {
    const { rows } = await pool.query(`
      SELECT id, nama, username, email, role,
        (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') AS created_at
      FROM users
    `);
    return rows;
}

async function getUserById(pool, id) {
    const result = await pool.query(`
      SELECT id, nama, username, email, role,
        (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') AS created_at
      FROM users WHERE id = $1
    `, [id]);
    if (result.rowCount === 0) {
        return null;
    }
    return result.rows[0];
}

async function updateUser(pool, id, { nama, email, password }) {
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
    updateQuery += fields.join(', ') + ` WHERE id = $${idx} RETURNING id, nama, username, email, role, (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') AS created_at`;
    values.push(id);
    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
        return null;
    }
    return result.rows[0];
}

async function deleteUser(pool, id) {
    const result = await pool.query(`
      DELETE FROM users WHERE id = $1 RETURNING id, nama, username, email, role, (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta') AS created_at
    `, [id]);
    if (result.rowCount === 0) {
        return null;
    }
    return result.rows[0];
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
