CREATE TABLE meals (
id SERIAL PRIMARY KEY,
restaurant_name TEXT NOT NULL,
food TEXT,
drink TEXT,
date_went DATE,
city TEXT,
rating TEXT,
comments TEXT
);