-- Set default value for created_at and updated_at in project
ALTER TABLE project
ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE project
ALTER COLUMN updated_at SET DEFAULT now();

-- (Optional) Update existing null created_at/updated_at to now
UPDATE project SET created_at = now() WHERE created_at IS NULL;
UPDATE project SET updated_at = now() WHERE updated_at IS NULL;
