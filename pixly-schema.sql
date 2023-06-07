CREATE TABLE photos (
  photo_id TEXT PRIMARY KEY,
  metadata JSON NOT NULL,
  caption TEXT DEFAULT ' ' NOT NULL,
  date_created TIMESTAMP
);