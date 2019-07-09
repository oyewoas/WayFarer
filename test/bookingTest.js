/* eslint-disable camelcase */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import faker from 'faker';
import env from '../env';
import server from '../server';
import pool from '../app/db/test/pool';
import {
  status,
} from '../app/helpers/status';

chai.use(chaiHttp);
const should = chai.should();
should;

const trip_id = 1;
const bus_id = 1;
const trip_date = '2019-08-07';
const seat_number = faker.random.number();
const token = jwt.sign(
  {
    email: 'test@gmail.com',
    user_id: 1,
    is_admin: false,
    first_name: 'sammy',
    last_name: 'jay',
  },
  env.secret,
  {
    expiresIn: '1h',
  },
);

beforeEach(() => {
  pool.query('TRUNCATE TABLE booking CASCADE',
    err => err);
});


// ADD buses Testing
describe('/POST new booking', () => {
  it('it should not CREATE a booking if auth token is not provided', (done) => {
    chai.request(server)
      .post('/api/v1/bookings')
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Token not provided');
        done(err);
      });
  });

  it('it should not CREATE a booking with empty body details', (done) => {
    const booking = {
      trip_id: '',
      bus_id: '',
      trip_date: '',
      seat_number: '',
    };
    chai.request(server)
      .post('/api/v1/bookings')
      .set('x-access-token', token)
      .send(booking)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('All fields are required');
        done(err);
      });
  });

  it('it should  POST a booking', (done) => {
    const booking = {
      trip_id,
      bus_id,
      trip_date,
      seat_number,
    };
    chai.request(server)
      .post('/api/v1/bookings')
      .set('x-access-token', token)
      .send(booking)
      .end((err, res) => {
        res.should.have.status(status.created);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        done(err);
      });
  });
});

