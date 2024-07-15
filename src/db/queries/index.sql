DROP INDEX IF EXISTS Idx1;
DROP INDEX IF EXISTS Idx2;
DROP INDEX IF EXISTS Idx3;
DROP INDEX IF EXISTS Idx4;
DROP INDEX IF EXISTS Idx5;
DROP INDEX IF EXISTS Idx6;

CREATE INDEX Idx1 ON packs(creator_id);
CREATE INDEX Idx4 ON samples(pack_id);
CREATE INDEX Idx2 ON samples(id, pack_id);
CREATE INDEX Idx3 ON samples(loop_tempo);
CREATE INDEX Idx5 ON packs(id);
CREATE INDEX Idx6 ON packs(slug);
