/* eslint-disable camelcase */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import env from '../env';
import server from '../server';
import pool from '../app/db/test/pool';
import {
  status,
} from '../app/helpers/status';

chai.use(chaiHttp);
const should = chai.should();
should;

const origin = 'Lagos';
const destination = 'PortHacourt';
const trip_date = moment(new Date());
const fare = 3000.00;
const bus_id = 1;
const token = jwt.sign(
  {
    email: 'test@gmail.com',
    user_id: 1,
    is_admin: true,
    first_name: 'sammy',
    last_name: 'jay',
  },
  env.secret,
  {
    expiresIn: '1h',
  },
);

beforeEach(() => {
  pool.query('TRUNCATE TABLE trip CASCADE',
    err => err);
});


// Sign Up trip Testing
describe('/POST new trip', () => {
  it('it should not CREATE a trip if auth token is not provided', (done) => {
    chai.request(server)
      .post('/api/v1/trips')
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Token not provided');
        done(err);
      });
  });

  it('it should not CREATE a trip with empty Origin, Destination, Trip Date and Fare', (done) => {
    const trip = {
      bus_id: '',
      origin: '',
      destination: '',
      trip_date: '',
      fare: '',
    };
    chai.request(server)
      .post('/api/v1/trips')
      .set('x-access-token', token)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Origin, Destination, Trip Date and Fare, field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a trip without destination, trip_date or fare field only', (done) => {
    const trip = {
      bus_id,
      origin,
    };
    chai.request(server)
      .post('/api/v1/trips')
      .set('x-access-token', token)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Origin, Destination, Trip Date and Fare, field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a trip with empty bus_id field only', (done) => {
    const trip = {
      bus_id: '',
      origin,
      destination,
      trip_date,
      fare,
    };
    chai.request(server)
      .post('/api/v1/trips')
      .set('x-access-token', token)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Origin, Destination, Trip Date and Fare, field cannot be empty');
        done(err);
      });
  });

  it('it should  POST a trip', (done) => {
    const trip = {
      bus_id,
      origin,
      destination,
      trip_date,
      fare,
    };
    chai.request(server)
      .post('/api/v1/trips')
      .set('x-access-token', token)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(status.created);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        done(err);
      });
  });
});

describe('/GET/ all trips', () => {
  it('it should return a response of no trips if there are no trips yet', (done) => {
    chai.request(server)
      .get('/api/v1/trips')
      .end((err, res) => {
        if (res.body.data === undefined) {
          res.should.have.status(status.error);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('There are no trips');
        }
        done(err);
      });
  });
  it('it should GET trips for both users and admins', (done) => {
    chai.request(server)
      .get('/api/v1/trips')
      .end((err, res) => {
        res.should.have.status(status.success);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        done(err);
      });
  });
});

// delete a trip
describe('/DELETE/ delete trips', () => {
  it('it should return a response if there are no trips with that id or delete and return trip cancelled successfully', (done) => {
    chai.request(server)
      .patch('/api/v1/trips/1')
      .set('x-access-token', token)
      .end((err, res) => {
        if (res.body.data === undefined) {
          res.should.have.status(status.notfound);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('There is no trip with that id');
        } else {
          res.should.have.status(status.success);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.data.should.have.property('message').eql('Trip cancelled successfully');
        }
        done(err);
      });
  });
});
  