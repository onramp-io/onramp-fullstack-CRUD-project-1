/** Database setup */
import { Client } from "pg";

import {DB_USERNAME, DB_PASSWORD, DB_PORT, NODE_ENV } from './config';

let DB_URI;

if (NODE_ENV === "test") {
  DB_URI = `postgres://${DB_USERNAME}:${DB_PASSWORD}@localhost:${DB_PORT}/learning_circle_test`;
} else {
  DB_URI = `postgres://${DB_USERNAME}:${DB_PASSWORD}@localhost:${DB_PORT}/learning_circle`;
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

export default db;