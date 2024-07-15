CREATE TABLE IF NOT EXISTS creators (
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS packs (
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    pack_type TEXT NOT NULL,
    release_date INTEGER NOT NULL,
    update_date INTEGER NOT NULL,
    creator_id TEXT,
    sample_count INTEGER NOT NULL,

    FOREIGN KEY (creator_id) REFERENCES creators (id)
);

-- TODO: waveform TEXT, size_wav INTEGER, size_mp3 INTEGER,
CREATE TABLE IF NOT EXISTS samples (
    id TEXT NOT NULL PRIMARY KEY,
    version TEXT,
    name TEXT NOT NULL,
    duration REAL NOT NULL,
    bars INTEGER NOT NULL,
    instrument_id TEXT NOT NULL,
    pack_id TEXT NOT NULL,
    release_date INTEGER NOT NULL,
    loop_tempo INTEGER,
    loop_key TEXT,
    CONSTRAINT unique_item UNIQUE (id, version),
    FOREIGN KEY (pack_id) REFERENCES packs (id)
);

CREATE TABLE IF NOT EXISTS samples_genres (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    sample_id TEXT NOT NULL,
    genre_name TEXT NOT NULL,
    FOREIGN KEY (sample_id) REFERENCES samples (id),
    CONSTRAINT unique_item UNIQUE (sample_id, genre_name)
);

CREATE TABLE IF NOT EXISTS samples_characters (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    sample_id TEXT NOT NULL,
    character_name TEXT NOT NULL,
    FOREIGN KEY (sample_id) REFERENCES samples (id),
    CONSTRAINT unique_item UNIQUE (sample_id, character_name)
);

CREATE TABLE IF NOT EXISTS web_collections (
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    color TEXT
);

CREATE TABLE IF NOT EXISTS web_collections_packs (
    pack_id TEXT NOT NULL,
    collection_id TEXT NOT NULL,
    PRIMARY KEY (collection_id, pack_id),
    FOREIGN KEY (collection_id) REFERENCES web_collections (id),
    FOREIGN KEY (pack_id) REFERENCES packs (id)
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    name TEXT NOT NULL,
    bio TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users_collections (
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS users_collections_samples (
    collection_id TEXT NOT NULL,
    sample_id TEXT NOT NULL,
    date_added INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    PRIMARY KEY (collection_id, sample_id),
    FOREIGN KEY (collection_id) REFERENCES users_collections (id),
    FOREIGN KEY (sample_id) REFERENCES samples (id)
);

CREATE TABLE IF NOT EXISTS users_collections_packs (
    collection_id TEXT NOT NULL,
    pack_id TEXT NOT NULL,
    date_added INTEGER NOT NULL,
    sort_order INTEGER NOT NULL,
    PRIMARY KEY (collection_id, pack_id),
    FOREIGN KEY (collection_id) REFERENCES users_collections (id),
    FOREIGN KEY (pack_id) REFERENCES packs (id)
);
