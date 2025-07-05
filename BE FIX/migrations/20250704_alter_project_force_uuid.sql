-- Ubah kolom user_id di project dan project_d menjadi UUID
ALTER TABLE project
  ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
ALTER TABLE project_d
  ALTER COLUMN user_id TYPE UUID USING user_id::uuid;

-- Jika kolom user_id belum ada, tambahkan:
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='project' AND column_name='user_id') THEN
    ALTER TABLE project ADD COLUMN user_id UUID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='project_d' AND column_name='user_id') THEN
    ALTER TABLE project_d ADD COLUMN user_id UUID;
  END IF;
END$$;

-- Pastikan juga id di tabel users bertipe UUID
-- Contoh migrasi users:
-- ALTER TABLE users ALTER COLUMN id TYPE UUID USING id::uuid;
-- Jika belum ada, tambahkan:
-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id') THEN
--     ALTER TABLE users ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid();
--   END IF;
-- END$$;
