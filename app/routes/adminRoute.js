import express from 'express';

import { createAdmin } from '../controllers/adminController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// users Routes

router.post('/admin/signup', verifyAuth, createAdmin);

export default router;
