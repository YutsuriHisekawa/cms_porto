// === BAGIAN 1: SETUP DAN KONFIGURASI ===
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const path = require('path'); 

const app = express();

const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // tambahkan origin lain jika perlu
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const usersRoute = require('./routes/users');
usersRoute.setPool(pool);
app.use('/users', express.json(), usersRoute.router);

const loginRoute = require('./routes/login');
loginRoute.setPool(pool);
app.use('/login', express.json(), loginRoute.router);

const projectRoute = require('./routes/project');
projectRoute.setPool(pool);
app.use('/project', projectRoute.router);

const project_dRoute = require('./routes/project_d');
project_dRoute.setPool(pool);
app.use('/project_d', express.json(), project_dRoute.router);

const metaRoute = require('./routes/meta');
metaRoute.setPool(pool);
app.use('/meta', express.json(), metaRoute.router);

const orang_dRoute = require('./routes/orang_d');
orang_dRoute.setPool(pool);
app.use('/orang_d', express.json(), orang_dRoute.router);

const orangRoute = require('./routes/orang');
orangRoute.setPool(pool);
app.use('/orang', express.json(), orangRoute.router);

const project_detailRoute = require('./routes/projectDetail');
project_detailRoute.setPool(pool);
app.use('/project_detail', express.json(), project_detailRoute.router);


// === MIDDLEWARE: AUTH BEARER TOKEN ===
function authBearerMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Invalid Bearer token' })
  }
  next()
}

// === PROTECT PUT ONLY FOR /users, POST/PUT FOR OTHERS ===
const protectedRoutes = [
  { route: '/project', methods: ['POST', 'PUT'] },
  { route: '/project_d', methods: ['POST', 'PUT'] },
  { route: '/project_detail', methods: ['POST', 'PUT'] },
  { route: '/orang', methods: ['POST', 'PUT'] },
  { route: '/orang_d', methods: ['POST', 'PUT'] },
  { route: '/meta', methods: ['POST', 'PUT'] },
  { route: '/users', methods: ['PUT'] }, // Only protect PUT for /users
]
protectedRoutes.forEach(({ route, methods }) => {
  app.use(route, (req, res, next) => {
    if (methods.includes(req.method)) {
      return authBearerMiddleware(req, res, next)
    }
    next()
  })
})

async function startServer() {
    console.log("Memulai inisialisasi server...");
    app.listen(PORT, () => {
        console.log(`Server Express berjalan di port ${PORT}`);
    });
}

startServer();

// === MIGRASI DAN SEED DUMMY TABEL ORANG DAN ORANG_D ===
// async function migrateAndSeedOrang() {
//     try {
//         // Buat tabel orang
//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS orang (
//                 uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//                 nama VARCHAR(100) NOT NULL,
//                 umur INTEGER
//             );
//         `);
//         // Buat tabel orang_d (detail)
//         await pool.query(`
//             CREATE TABLE IF NOT EXISTS orang_d (
//                 uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//                 orang_uuid UUID REFERENCES orang(uuid) ON DELETE CASCADE,
//                 alamat TEXT
//             );
//         `);
//         // Insert dummy data ke orang
//         const { rows: orangRows } = await pool.query(`
//             INSERT INTO orang (nama, umur) VALUES
//             ('Budi', 30),
//             ('Siti', 25)
//             ON CONFLICT DO NOTHING
//             RETURNING uuid, nama, umur;
//         `);
//         // Insert dummy data ke orang_d
//         if (orangRows.length > 0) {
//             await pool.query(`
//                 INSERT INTO orang_d (orang_uuid, alamat) VALUES
//                 ($1, 'Jl. Mawar No. 1'),
//                 ($2, 'Jl. Melati No. 2')
//                 ON CONFLICT DO NOTHING;
//             `, [orangRows[0].uuid, orangRows[1] ? orangRows[1].uuid : orangRows[0].uuid]);
//         }
//         console.log('Migrasi dan dummy data orang & orang_d selesai!');
//     } catch (err) {
//         console.error('Error migrasi/seeding:', err.message);
//     }
// }
// migrateAndSeedOrang();
