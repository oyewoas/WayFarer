import express from 'express';

import { createTrip, getAllTrips } from '../controllers/tripController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// trips Routes

router.post('/trips', verifyAuth, createTrip);
router.get('/trips', getAllTrips);
export default router;
