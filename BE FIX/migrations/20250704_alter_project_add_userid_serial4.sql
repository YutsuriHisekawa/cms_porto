-- Tambah kolom user_id (serial4), created_at, updated_at ke tabel project dan project_d
ALTER TABLE project
  ADD COLUMN IF NOT EXISTS user_id serial4,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE project_d
  ADD COLUMN IF NOT EXISTS user_id serial4,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Trigger untuk update otomatis updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_timestamp_project ON project;
CREATE TRIGGER set_timestamp_project
BEFORE UPDATE ON project
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS set_timestamp_projectd ON project_d;
CREATE TRIGGER set_timestamp_projectd
BEFORE UPDATE ON project_d
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
