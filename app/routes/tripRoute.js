import express from 'express';

import { createTrip } from '../controllers/tripController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// trips Routes

router.post('/trips', verifyAuth, createTrip);

export default router;
