import express from 'express';

import { createUser } from '../controllers/usersController';

const router = express.Router();

// users Routes

router.post('/auth/signup', createUser);

export default router;
