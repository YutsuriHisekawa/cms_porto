const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { compressImage } = require('../services/imageService');

const {
  createProject,
  getAllProjects,
  getProjectByUuid,
  getProjectWithDetails,
  updateProject,
  deleteProject,
  getProjectDetailImages,
  getProjectWithDetailsBySlug
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
    // Cek jika file sudah ada, tambahkan (1), (2), dst
    const uploadDir = path.join(__dirname, '../uploads');
    let base = path.basename(file.originalname, path.extname(file.originalname));
    let ext = path.extname(file.originalname);
    let filename = file.originalname;
    let counter = 1;
    while (fs.existsSync(path.join(uploadDir, filename))) {
      filename = `${base} (${counter})${ext}`;
      counter++;
    }
    cb(null, filename);
  }
});

// Dynamic fields for detail images (support up to 10 detail images)
const uploadFields = [
  { name: 'upload_header', maxCount: 1 },
  ...Array.from({ length: 10 }).map((_, i) => ({ name: `project_d_picture_${i}`, maxCount: 1 }))
];

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // naikkan ke 10MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

// Helper: Unlink file with retry (untuk EBUSY)
async function safeUnlink(filePath, maxRetries = 3, delay = 100) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fs.promises.unlink(filePath);
      return;
    } catch (err) {
      if (err.code === 'EBUSY' && i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, delay));
      } else if (err.code === 'ENOENT') {
        return; // file already gone
      } else {
        throw err;
      }
    }
  }
}

// POST /project - Tambah project + detail images
router.post('/', upload.fields(uploadFields), async (req, res) => {
  try {
    const { title, description, project_d_count, user_id } = req.body;
    if (!req.files['upload_header']) return res.status(400).json({ error: 'No header image uploaded' });

    // Kompres gambar header
    const headerFile = req.files['upload_header'][0];
    const headerPath = path.join(__dirname, '../uploads', headerFile.filename);
    const headerCompressedPath = path.join(__dirname, '../uploads', 'compressed_' + headerFile.filename);
    await compressImage(headerPath, headerCompressedPath, { width: 1200, quality: 80, format: 'jpeg' });
    // Hapus file asli, rename hasil kompres ke nama asli
    await safeUnlink(headerPath);
    fs.renameSync(headerCompressedPath, headerPath);
    const upload_header = `/uploads/${headerFile.filename}`;

    // Buat project utama, tambahkan user_id
    const result = await createProject(pool, { title, description, upload_header, user_id });
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    const project = result.project;

    // Simpan detail project_d jika ada
    const detailCount = parseInt(project_d_count) || 0;
    const detailResults = [];
    const project_dService = require('../services/project_dService');
    for (let i = 0; i < detailCount; i++) {
      const fileKey = `project_d_picture_${i}`;
      if (req.files[fileKey]) {
        // Kompres gambar detail
        const detailFile = req.files[fileKey][0];
        const detailPath = path.join(__dirname, '../uploads', detailFile.filename);
        const detailCompressedPath = path.join(__dirname, '../uploads', 'compressed_' + detailFile.filename);
        await compressImage(detailPath, detailCompressedPath, { width: 1200, quality: 80, format: 'jpeg' });
        await safeUnlink(detailPath);
        fs.renameSync(detailCompressedPath, detailPath);
        const picture_url = `/uploads/${detailFile.filename}`;
        const detail = await project_dService.addProjectDetail(pool, {
          project_uuid: project.uuid,
          picture_url
        });
        detailResults.push(detail);
      }
    }

    res.status(201).json({ project, details: detailResults });
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

// GET /project/:slug - Ambil project by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    // Cari project berdasarkan slug
    const project = await getProjectWithDetailsBySlug(pool, slug);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /project/:slug - Update project by slug
router.put('/:slug', upload.any(), async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description, detail_uuids } = req.body;
    const project_dService = require('../services/project_dService');
    const project = await getProjectWithDetailsBySlug(pool, slug);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    let upload_header;
    // Cari file header jika ada
    const headerFile = req.files.find(f => f.fieldname === 'upload_header');
    if (headerFile) {
      upload_header = `/uploads/${headerFile.filename}`;
    }

    // Update project utama
    await updateProject(pool, project.uuid, { title, description, upload_header });

    // --- Update detail gallery images ---
    // 1. Hapus detail yang tidak dipertahankan
    let keepUuids = [];
    try {
      keepUuids = JSON.parse(detail_uuids);
    } catch (e) {}
    await project_dService.deleteProjectDetailsExcept(pool, project.uuid, keepUuids);

    // 2. Tambah gambar baru
    const { compressImage } = require('../services/imageService');
    for (const file of req.files) {
      if (file.fieldname.startsWith('project_d_picture_')) {
        // Kompres gambar
        const detailPath = path.join(__dirname, '../uploads', file.filename);
        const detailCompressedPath = path.join(__dirname, '../uploads', 'compressed_' + file.filename);
        await compressImage(detailPath, detailCompressedPath, { width: 1200, quality: 80, format: 'jpeg' });
        await safeUnlink(detailPath);
        fs.renameSync(detailCompressedPath, detailPath);
        const picture_url = `/uploads/${file.filename}`;
        await project_dService.addProjectDetail(pool, {
          project_uuid: project.uuid,
          picture_url
        });
      }
    }

    // 3. Ambil data project terbaru (beserta detail)
    const updatedProject = await getProjectWithDetailsBySlug(pool, slug);
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /project/:uuid - Hapus project
router.delete('/:uuid', async (req, res) => {
  try {
    const { uuid } = req.params;
    // Ambil data project (header) & detail (gambar)
    const project = await getProjectWithDetails(pool, uuid);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    // Simpan path gambar header & detail
    const headerPath = project.upload_header ? project.upload_header.replace('/uploads/', '') : null;
    const detailImages = (project.project_d || []).map(d => d.picture_url.replace('/uploads/', ''));
    // Hapus project di DB (ON DELETE CASCADE untuk detail)
    const deleted = await deleteProject(pool, uuid);
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    // Hapus file header
    if (headerPath) {
      const filePath = path.join(__dirname, '../uploads', headerPath);
      try { await safeUnlink(filePath); } catch (e) { /* ignore */ }
    }
    // Hapus file detail
    for (const img of detailImages) {
      const filePath = path.join(__dirname, '../uploads', img);
      try { await safeUnlink(filePath); } catch (e) { /* ignore */ }
    }
    res.json({ message: 'Deleted', project: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, setPool };
