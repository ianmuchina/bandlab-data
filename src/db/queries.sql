-- name: CreateCollection :exec
INSERT INTO web_collections (id, name, slug) VALUES (:id,:name,:slug);

-- name: CreateCreator :exec
INSERT INTO creators (id, name, username) VALUES (:id, :name, :username);

-- name: CreatePack :exec
INSERT INTO packs (id, name, slug, description, pack_type, release_date, update_date, creator_id) 
VALUES (:id, :name, :slug, :description, :pack_type, :release_date, :update_date, :creator_id);

-- name: CreateSampleCollection :exec
INSERT INTO samples_characters (sample_id, character_name) VALUES (:sample_id, :character_name);

-- name: CreateSampleGenre :exec
INSERT INTO samples_genres (sample_id, genre_name) VALUES (:sample_id, :genre_name);

-- name: CreateSample :exec
INSERT INTO samples (id, name, duration, bars, instrument_id, pack_id, release_date, loop_tempo, loop_key, version) 
VALUES (:id, :name, :duration, :bars, :instrument_id, :pack_id, :release_date, :loop_tempo, :loop_key, :version);

-- name: GetCollectionIds :exec
SELECT id FROM web_collections;

-- name: GetCreatorIds :exec
SELECT id FROM creators;

-- name: GetPackIds :exec
SELECT id FROM packs;

-- name: GetSampleIds :exec
SELECT id FROM samples;
