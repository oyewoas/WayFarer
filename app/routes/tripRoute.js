import express from 'express';

import { createTrip, getAllTrips, cancelTrip } from '../controllers/tripController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// trips Routes

router.post('/trips', verifyAuth, createTrip);
router.get('/trips', getAllTrips);
router.patch('/trips/:tripId', verifyAuth, cancelTrip);
export default router;
