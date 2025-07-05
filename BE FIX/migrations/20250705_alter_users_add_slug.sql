ALTER TABLE users ADD COLUMN IF NOT EXISTS slug VARCHAR(100) UNIQUE;

-- Generate slug for user with username 'Fahrizal' (if not exists)
UPDATE users SET slug = LOWER(REGEXP_REPLACE(username, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE username = 'Fahrizal' AND (slug IS NULL OR slug = '');
