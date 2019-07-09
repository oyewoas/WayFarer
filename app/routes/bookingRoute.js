import express from 'express';

import { createBooking } from '../controllers/bookingController';
import verifyAuth from '../middlewares/verifyAuth';

const router = express.Router();

// bookings Routes

router.post('/bookings', verifyAuth, createBooking);
export default router;
