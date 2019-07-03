import { Pool } from 'pg';
import dotenv from 'dotenv';
import env from '../../env';

dotenv.config();

const databaseConfig = { connectionString: env.database_url };
const pool = new Pool(databaseConfig);

export default pool;
