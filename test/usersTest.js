/* eslint-disable camelcase */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import moment from 'moment';
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

const email = 'test@gmail.com';
const password = 'testingtesting';
const first_name = 'sammy';
const last_name = 'jay';
const created_on = moment(new Date());

// Generating token for testing
const token = jwt.sign({
  email,
  user_id: 1,
},
'secret', {
  expiresIn: '1h',
});
beforeEach(() => {
  pool.query('TRUNCATE TABLE users CASCADE',
    err => err);
});


// Sign Up User Testing
describe('/POST new user', () => {
  it('it should not CREATE a user without email or password field only', (done) => {
    const user = {
      first_name,
      last_name,
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a user without firt_name, last_name or password field only', (done) => {
    const user = {
      email,
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a user with empty email or password field only', (done) => {
    const user = {
      first_name,
      last_name,
      password: '',
      email: '',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a user with empty email or username field only', (done) => {
    const user = {
      password,
      first_name: '',
      last_name: '',
      email: '',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a user with empty username or password field only', (done) => {
    const user = {
      email,
      first_name: '',
      last_name: '',
      password: '',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not POST a user, if email is not valid', (done) => {
    const user = {
      email: 'test.com',
      first_name,
      last_name,
      password,
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Please enter a valid Email');
        done(err);
      });
  });

  it('it should not POST a user, if password is not valid', (done) => {
    const user = {
      email,
      password: 'pass',
      first_name,
      last_name,
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Password must be more than five(5) characters');
        done(err);
      });
  });

  it('it should not POST a user, if password is empty spaces', (done) => {
    const user = {
      email,
      password: '         ',
      first_name,
      last_name,
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });
});
