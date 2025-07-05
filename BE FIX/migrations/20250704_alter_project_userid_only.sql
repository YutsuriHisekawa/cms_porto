-- Hapus constraint jika sudah ada
ALTER TABLE project DROP CONSTRAINT IF EXISTS fk_project_user;

-- Hapus kolom user_id dan constraint di project_d jika ada
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns WHERE table_name='project_d' AND column_name='user_id'
  ) THEN
    ALTER TABLE project_d DROP COLUMN user_id;
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints WHERE table_name='project_d' AND constraint_name='fk_projectd_user'
  ) THEN
    ALTER TABLE project_d DROP CONSTRAINT fk_projectd_user;
  END IF;
END$$;

-- Pastikan project.user_id bertipe UUID dan relasi ke users(id)
ALTER TABLE project
  ALTER COLUMN user_id TYPE UUID USING user_id::uuid,
  ADD CONSTRAINT fk_project_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;