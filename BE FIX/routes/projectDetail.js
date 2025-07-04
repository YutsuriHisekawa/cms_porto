// Endpoint CRUD dan upload gambar untuk project detail
const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const projectDetailService = require('../services/projectDetailService');

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
    projectDetailService.setPool(pool);
}

// CREATE detail dengan upload gambar
router.post('/', upload.single('picture'), async (req, res) => {
    try {
        const { project_uuid } = req.body;
        if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
        const picture_url = `/uploads/${req.file.filename}`;
        const detail = await projectDetailService.createDetail({ project_uuid, picture_url });
        res.status(201).json(detail);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ all details
router.get('/', async (req, res) => {
    try {
        const details = await projectDetailService.getAllDetails();
        res.json(details);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE detail (ganti gambar)
router.put('/:uuid', upload.single('picture'), async (req, res) => {
    try {
        const { uuid } = req.params;
        let picture_url;
        if (req.file) picture_url = `/uploads/${req.file.filename}`;
        const updated = await projectDetailService.updateDetail(uuid, { picture_url });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE detail
router.delete('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        await projectDetailService.deleteDetail(uuid);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = { router, setPool };
