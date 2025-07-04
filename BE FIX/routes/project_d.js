// Endpoint CRUD dan upload gambar untuk project_d (detail)
const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const project_dService = require('../services/project_dService');

const router = express.Router();
let pool;

// Setup multer untuk upload gambar (max 2MB)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, uuidv4() + ext);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    }
});

function setPool(pgPool) {
    pool = pgPool;
    project_dService.setPool(pool);
}

// CREATE detail dengan upload gambar
router.post('/', upload.single('picture'), async (req, res) => {
    try {
        const { project_uuid } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        const picture_url = `/uploads/${req.file.filename}`;
        const detail = await project_dService.addProjectDetail(pool, { project_uuid, picture_url });
        res.status(201).json(detail);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all details
router.get('/', async (req, res) => {
    try {
        if (req.query.join === 'true') {
            const result = await pool.query(`
                SELECT project_d.*, project.uuid AS project_uuid_asli, project.title, project.description, project.upload_header
                FROM project_d
                JOIN project ON project_d.project_uuid = project.uuid
            `);
            const projectDCols = ['uuid', 'project_uuid', 'picture_url'];
            const data = result.rows.map(row => {
                const newRow = {};
                for (const key in row) {
                    if (projectDCols.includes(key)) {
                        newRow[key] = row[key];
                    } else if (key === 'project_uuid_asli') {
                        newRow['project.uuid'] = row[key];
                    } else {
                        newRow[`project.${key}`] = row[key];
                    }
                }
                return newRow;
            });
            res.json(data);
        } else {
            const details = await project_dService.getAllDetails(pool);
            res.json(details);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET detail by uuid
router.get('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const detail = await project_dService.getDetailByUuid(pool, uuid);
        if (!detail) return res.status(404).json({ error: 'Detail not found' });
        res.json(detail);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE detail (ganti gambar)
router.put('/:uuid', upload.single('picture'), async (req, res) => {
    try {
        const { uuid } = req.params;
        const { project_uuid } = req.body;
        let picture_url;
        if (req.file) {
            picture_url = `/uploads/${req.file.filename}`;
        }
        const detail = await project_dService.updateProjectDetail(pool, uuid, { project_uuid, picture_url });
        if (!detail) return res.status(404).json({ error: 'Detail not found' });
        res.json(detail);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE detail
router.delete('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const result = await project_dService.deleteProjectDetail(pool, uuid);
        if (!result) return res.status(404).json({ error: 'Detail not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = { router, setPool };
