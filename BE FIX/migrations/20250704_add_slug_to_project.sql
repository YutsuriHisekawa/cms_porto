-- Migration: add slug column to project table
ALTER TABLE project ADD COLUMN slug VARCHAR(255) UNIQUE;
-- Optionally, fill slug for existing data (manual update or script)
