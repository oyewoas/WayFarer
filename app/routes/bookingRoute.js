import express from 'express';

import { createBooking, getAllBookings } from '../controllers/bookingController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// bookings Routes

router.post('/bookings', verifyAuth, createBooking);
router.get('/bookings', verifyAuth, getAllBookings);

export default router;
