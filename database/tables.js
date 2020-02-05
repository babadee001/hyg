import pool from './db';
import dotenv from 'dotenv';

dotenv.config();

const initUserTable = () => {
  let queryText = '';
  queryText += `
  CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  email VARCHAR(100) NOT NULL,
  createdon DATE NOT NULL,
  username VARCHAR(100) NOT NULL,
  question VARCHAR(100) NOT NULL,
  answer VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (email)
  );

  CREATE TABLE IF NOT EXISTS data (
    id SERIAL,
    username VARCHAR(100) NOT NULL,
    createdon DATE NOT NULL,
    firstdata INT NOT NULL,
    seconddata INT NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    PRIMARY KEY (id)
    );
    `;

  pool.query(queryText)
  .then((res) => {
    console.log('done');
    pool.end();
  })
  .catch((err) => {
    console.log(err);
    pool.end();
  })
};
initUserTable();
export default initUserTable;