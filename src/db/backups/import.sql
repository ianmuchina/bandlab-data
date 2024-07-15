-- PRAGMA journal_mode = OFF;
-- PRAGMA synchronous = 0;
-- PRAGMA cache_size = 10000;
-- PRAGMA locking_mode = EXCLUSIVE;
-- PRAGMA temp_store = MEMORY;
.mode csv
.import csv/creators.csv creators
.import csv/packs.csv packs
.import csv/samples.csv samples
.import csv/samples_genres.csv samples_genres
.import csv/samples_characters.csv samples_characters
.import csv/web_collections.csv web_collections
.import csv/web_collections_packs.csv web_collections_packs
.import csv/users.csv users
.import csv/users_collections.csv users_collections
.import csv/users_collections_samples.csv users_collections_samples
.import csv/users_collections_packs.csv users_collections_packs