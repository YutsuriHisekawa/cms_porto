-- Tambah kolom user_id, created_at, updated_at ke tabel project dan project_d
ALTER TABLE project
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE project_d
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Optional: tambahkan foreign key user_id jika ada tabel users
-- ALTER TABLE project ADD CONSTRAINT fk_project_user FOREIGN KEY (user_id) REFERENCES users(uuid);
-- ALTER TABLE project_d ADD CONSTRAINT fk_projectd_user FOREIGN KEY (user_id) REFERENCES users(uuid);

-- Untuk update otomatis updated_at saat update data (PostgreSQL trigger, opsional)
-- Buat function update_timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk project
DROP TRIGGER IF EXISTS set_timestamp_project ON project;
CREATE TRIGGER set_timestamp_project
BEFORE UPDATE ON project
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Trigger untuk project_d
DROP TRIGGER IF EXISTS set_timestamp_projectd ON project_d;
CREATE TRIGGER set_timestamp_projectd
BEFORE UPDATE ON project_d
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
