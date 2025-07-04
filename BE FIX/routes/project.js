const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const {
  createProject,
  getAllProjects,
  getProjectByUuid,
  updateProject,
  deleteProject
} = require('../services/projectService');

let pool;
function setPool(pgPool) {
  pool = pgPool;
}

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
  limits: { fileSize: 2 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

// POST /project - Tambah project
router.post('/', upload.single('upload_header'), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    const upload_header = `/uploads/${req.file.filename}`;
    const result = await createProject(pool, { title, description, upload_header });

    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    res.status(201).json(result.project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /project - Ambil semua project
router.get('/', async (req, res) => {
  try {
    const projects = await getAllProjects(pool);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /project/:uuid - Ambil project by uuid
router.get('/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const project = await getProjectByUuid(pool, uuid);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /project/:uuid - Update project
router.put('/:uuid', upload.single('upload_header'), async (req, res) => {
  try {
    const { uuid } = req.params;
    const { title, description } = req.body;

    let upload_header;
    if (req.file) {
      upload_header = `/uploads/${req.file.filename}`;
    }

    const updated = await updateProject(pool, uuid, { title, description, upload_header });

    if (!updated) return res.status(404).json({ error: 'Project not found or no update applied' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /project/:uuid - Hapus project
router.delete('/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    const deleted = await deleteProject(pool, uuid);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Deleted', project: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, setPool };
