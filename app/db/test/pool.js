import { Pool } from 'pg';
import env from '../../../env';

const databaseConfig = { connectionString: env.url };
const pool = new Pool(databaseConfig);

export default pool;
