CREATE TABLE photos (
  photo_id TEXT PRIMARY KEY,
  image_info JSON NOT NULL,
  caption TEXT DEFAULT '',
  date_created TIMESTAMP
);