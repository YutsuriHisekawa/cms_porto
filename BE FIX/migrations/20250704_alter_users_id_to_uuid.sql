-- Pastikan extension uuid-ossp sudah ada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hapus default lama (nextval)
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;

-- Ubah tipe id ke UUID, isi data lama dengan UUID baru
ALTER TABLE users ALTER COLUMN id TYPE UUID USING (uuid_generate_v4());

-- Set default baru
ALTER TABLE users ALTER COLUMN id SET DEFAULT uuid_generate_v4();
