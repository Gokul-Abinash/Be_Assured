-- Fix pan_number column to store SHA-256 hashes (64 chars)
ALTER TABLE workers ALTER COLUMN pan_number TYPE TEXT;
