-- Set default value for created_at and updated_at in project_d
ALTER TABLE project_d
ALTER COLUMN created_at SET DEFAULT now();

ALTER TABLE project_d
ALTER COLUMN updated_at SET DEFAULT now();

-- (Optional) Update existing null created_at/updated_at to now
UPDATE project_d SET created_at = now() WHERE created_at IS NULL;
UPDATE project_d SET updated_at = now() WHERE updated_at IS NULL;
