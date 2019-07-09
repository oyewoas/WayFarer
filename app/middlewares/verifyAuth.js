/* eslint-disable max-len */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  errorMessage, status,
} from '../helpers/status';

import env from '../../env';

dotenv.config();

/**
   * Verify Token
   * @param {object} req 
   * @param {object} res 
   * @param {object} next
   * @returns {object|void} response object 
   */

const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    errorMessage.error = 'Token not provided';
    return res.status(status.bad).send(errorMessage);
  }
  try {
    const decoded = await jwt.verify(token, env.secret);
    req.user = {
      user_id: decoded.user_id, 
      is_admin: decoded.is_admin, 
      first_name: decoded.first_name, 
      last_name: decoded.last_name,
      email: decoded.email,
    };
    next();
  } catch (error) {
    errorMessage.error = 'Authentication Failed';
    return res.status(status.unauthorized).send(errorMessage);
  }
};

export default verifyToken;
