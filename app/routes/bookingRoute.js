import express from 'express';

import { createBooking, getAllBookings, deleteBooking } from '../controllers/bookingController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// bookings Routes

router.post('/bookings', verifyAuth, createBooking);
router.get('/bookings', verifyAuth, getAllBookings);
router.delete('/bookings/:bookingId', verifyAuth, deleteBooking);

export default router;
