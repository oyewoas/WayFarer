import express from 'express';

import { createTrip, getAllTrips, cancelTrip, filterTripByOrigin } from '../controllers/tripController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// trips Routes

router.post('/trips', verifyAuth, createTrip);
router.get('/trips', verifyAuth, getAllTrips);
router.patch('/trips/:tripId', verifyAuth, cancelTrip);
router.get('/trip', verifyAuth, filterTripByOrigin);
export default router;
