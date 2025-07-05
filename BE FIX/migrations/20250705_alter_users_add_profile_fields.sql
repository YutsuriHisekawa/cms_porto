-- Tambahkan kolom baru jika belum ada
ALTER TABLE users
ADD COLUMN IF NOT EXISTS nama_lengkap VARCHAR(100),
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Pindahkan data dari kolom nama ke nama_lengkap jika nama_lengkap masih NULL
UPDATE users SET nama_lengkap = nama WHERE nama_lengkap IS NULL AND nama IS NOT NULL;

-- Setelah data dipindah, baru set NOT NULL constraint
ALTER TABLE users
ALTER COLUMN nama DROP NOT NULL;
ALTER TABLE users
ALTER COLUMN nama_lengkap SET NOT NULL;
