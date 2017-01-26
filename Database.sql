CREATE TABLE owners (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50),
	last_name VARCHAR(50)
	);

  CREATE TABLE pets ( 
	id SERIAL PRIMARY KEY,
	name VARCHAR(50),
	breed VARCHAR(100),
	color VARCHAR(50),
	owner_id INT REFERENCES owners
	);

  CREATE TABLE visits (
  	id SERIAL PRIMARY KEY,
  	check_in TIMESTAMP,
  	check_out TIMESTAMP,
  	pets_id INT REFERENCES pets
  	);
