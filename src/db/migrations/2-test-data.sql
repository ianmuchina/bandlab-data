-- Default Users
INSERT INTO users (id, username, name, bio) VALUES (
    1, 'much1na', 'Ian Muchina', '404 bio not found'
);

-- Default Collections
INSERT INTO users_collections (id, title, description, color, user_id) VALUES (
    1, 'Favorites', 'My favorite sample packs', '#000', 1
);


-- Default creator if empty
INSERT INTO creators (id, name, username) VALUES (
    '46d3d974-f026-e811-80c2-000d3aa0601a', 'unknown', 'default_user'
);

-- -- Unlike a sample
-- DELETE FROM users_collections_samples 
-- WHERE (sample_id = ?) AND (collection_id = ?);
