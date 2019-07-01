import express from 'express';

import dotenv from 'dotenv';

import cors from 'cors';

import env from './.env';

dotenv.config();
const app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(env.port).on('listening', () => {
  console.log(`🚀 are live on ' ${env.port}`);
});


module.exports = app;
