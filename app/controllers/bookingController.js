/* eslint-disable camelcase */
import moment from 'moment';

import dbQuery from '../db/dev/dbQuery';

import {
  empty,
} from '../helpers/validations';


import {
  errorMessage, successMessage, status,
} from '../helpers/status';


/**
   * Add A Bus
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const createBooking = async (req, res) => {
  const {
    trip_id, bus_id, trip_date, seat_number,
  } = req.body;

  const {
    first_name, last_name, user_id, email,
  } = req.user;
  const created_on = moment(new Date());

  if (empty(trip_id) || empty(bus_id) || empty(trip_date) || empty(seat_number)) {
    errorMessage.error = 'All fields are required';
    return res.status(status.bad).send(errorMessage);
  }
  const createBookingQuery = `INSERT INTO
          booking(user_id, trip_id, bus_id, trip_date, seat_number, first_name, last_name, email, created_on)
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
          returning *`;
  const values = [
    user_id,
    trip_id,
    bus_id,
    trip_date,
    seat_number,
    first_name,
    last_name,
    email,
    created_on,
  ];

  try {
    const { rows } = await dbQuery.query(createBookingQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      errorMessage.error = 'Seat Number is taken already';
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = 'Unable to create booking';
    return res.status(status.error).send(errorMessage);
  }
};


export {
  createBooking,
};
