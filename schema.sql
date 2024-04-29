DROP TABLE IF EXISTS scores

CREATE TABLE scores
(
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT  NOT NULL,
    score INTEGER NOT NULL,
    date DATE NOT NULL
);

INSERT INTO scores(player_id, score, date)
VALUES
('Antrek', 150, '2024-04-18'),
('Antrek', 250, '2024-04-18');

SELECT * FROM scores 
SELECT * FROM scores ORDER BY score DESC