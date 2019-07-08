/* eslint-disable camelcase */
import moment from 'moment';

import dbQuery from '../db/dev/dbQuery';

import {
  isEmpty,
} from '../helpers/validations';


import {
  errorMessage, successMessage, status,
} from '../helpers/status';

/**
   * Create A Trip
   * @param {object} req
   * @param {object} res
   * @returns {object} reflection object
   */
const createTrip = async (req, res) => {
  const {
    bus_id, origin, destination, trip_date, fare,
  } = req.body;
  
  const { is_admin } = req.user;
  if (!is_admin === true) {
    errorMessage.error = 'Sorry You are unauthorized to create a trip';
    return res.status(status.bad).send(errorMessage);
  }

  const created_on = moment(new Date());

  if (bus_id === '' || isEmpty(origin) || isEmpty(destination) || trip_date === '' || fare === '') {
    errorMessage.error = 'Origin, Destination, Trip Date and Fare, field cannot be empty';
    return res.status(status.bad).send(errorMessage);
  }
  const createBusQuery = `INSERT INTO
          trip(bus_id, origin, destination, trip_date, fare, created_on)
          VALUES($1, $2, $3, $4, $5, $6)
          returning *`;
  const values = [
    bus_id,
    origin,
    destination,
    trip_date,
    fare,
    created_on,
  ];
    
  try {
    const { rows } = await dbQuery.query(createBusQuery, values);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Unable to create trip';
    return res.status(status.error).send(errorMessage);
  }
};

export { createTrip };
