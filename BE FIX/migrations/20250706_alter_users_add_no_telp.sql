-- Add no_telp column to users table (string, nullable, idempotent)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='no_telp'
    ) THEN
        ALTER TABLE users ADD COLUMN no_telp VARCHAR(20);
    END IF;
END $$;
