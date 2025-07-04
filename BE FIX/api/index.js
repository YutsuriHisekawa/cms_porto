// === BAGIAN 1: SETUP DAN KONFIGURASI ===
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi database dari file .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Import dan setup routes
const usersRoute = require('./routes/users');
usersRoute.setPool(pool);
app.use('/users', usersRoute.router);

const loginRoute = require('./routes/login');
loginRoute.setPool(pool);
app.use('/login', loginRoute.router);

const registerRoute = require('./routes/register');
registerRoute.setPool(pool);
app.use('/register', registerRoute.router);

const testRoute = require('./routes/test');
app.use('/test', testRoute.router);

// === BAGIAN 2: FUNGSI INISIALISASI DATABASE ===

// (Bagian create table, seeding, dan alter kolom dihapus sesuai permintaan)

// === BAGIAN 3: RUTE API SEDERHANA UNTUK TES ===
// app.get('/users', async (req, res) => {
//     try {
//         // Mengambil semua user tapi tanpa password hash
//         const { rows } = await pool.query('SELECT id, nama, username, email, created_at FROM users');
//         res.json(rows);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// === MIGRASI: BUAT TABEL PROJECT DAN PROJECT DETAIL ===
// async function migrateProjectTables() {
//     try {
//         // Project table
//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS project (
//                 uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//                 title VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 upload_header VARCHAR(255),
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `);
//         // Project detail table
//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS project_d (
//                 uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//                 project_uuid UUID REFERENCES project(uuid) ON DELETE CASCADE,
//                 picture_url VARCHAR(255),
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `);
//         console.log('Migration for project & project_d tables completed!');
//     } catch (err) {
//         console.error('Error migrasi:', err.message);
//     }
// }
// Untuk menjalankan migrasi, uncomment baris di bawah ini lalu jalankan node index.js
// migrateProjectTables();

// === REMOVE LISTEN FOR VERCEL SERVERLESS ===
// Do not use app.listen() or startServer() in Vercel
// Export the Express app for Vercel
module.exports = app;