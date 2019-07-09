/* eslint-disable camelcase */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import env from '../env';
import server from '../server';
import pool from '../app/db/test/pool';
import {
  status,
} from '../app/helpers/status';

chai.use(chaiHttp);
const should = chai.should();
should;

const number_plate = 'ADC-2443-ADW2';
const manufacturer = 'Honda';
const model = 'Accord';
const year = 2019;
const capacity = 20;
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
  pool.query('TRUNCATE TABLE bus CASCADE',
    err => err);
});


// ADD buses Testing
describe('/POST new bus', () => {
  it('it should not ADD a bus if auth token is not provided', (done) => {
    chai.request(server)
      .post('/api/v1/buses')
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Token not provided');
        done(err);
      });
  });

  it('it should not ADD a bus with empty body details', (done) => {
    const trip = {
      number_plate: '',
      manufacturer: '',
      model: '',
      year: '',
      capacity: '',
    };
    chai.request(server)
      .post('/api/v1/buses')
      .set('x-access-token', token)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('All fields are required');
        done(err);
      });
  });

  it('it should not ADD a bus without number_plate, manufacturer or capacity field only', (done) => {
    const trip = {
      model,
      year,
    };
    chai.request(server)
      .post('/api/v1/buses')
      .set('x-access-token', token)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('All fields are required');
        done(err);
      });
  });

  it('it should not CREATE a trip with empty number_plate field only', (done) => {
    const trip = {
      number_plate: '',
      manufacturer,
      model,
      year,
      capacity,
    };
    chai.request(server)
      .post('/api/v1/buses')
      .set('x-access-token', token)
      .send(trip)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('All fields are required');
        done(err);
      });
  });

  it('it should  POST and add a bus', (done) => {
    const trip = {
      number_plate,
      manufacturer,
      model,
      year,
      capacity,
    };
    chai.request(server)
      .post('/api/v1/buses')
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

// Get all buses
describe('/GET/ all buses', () => {
  it('it should return a response of no buses if there are no buses yet', (done) => {
    chai.request(server)
      .get('/api/v1/buses')
      .set('x-access-token', token)
      .end((err, res) => {
        if (res.body.data === undefined) {
          res.should.have.status(status.notfound);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('There are no buses');
        }
        done(err);
      });
  });
  it('it should GET all buses for an admin', (done) => {
    chai.request(server)
      .get('/api/v1/buses')
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(status.success);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        done(err);
      });
  });
});
