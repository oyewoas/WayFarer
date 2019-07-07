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

const email = 'test@gmail.com';
const password = 'testingtesting';
const first_name = 'sammy';
const last_name = 'jay';
const token = jwt.sign(
  {
    email: 'test@gmail.com',
    user_id: 1,
    is_admin: true,
  },
  env.secret,
  {
    expiresIn: '1h',
  },
);

beforeEach(() => {
  pool.query('TRUNCATE TABLE users CASCADE',
    err => err);
});


// Sign Up admin Testing
describe('/POST new admin', () => {
  it('it should not CREATE a admin if auth token is not provided', (done) => {
    chai.request(server)
      .post('/api/v1/admin/signup')
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Token not provided');
        done(err);
      });
  });

  it('it should not CREATE a admin without email or password field only', (done) => {
    const admin = {
      first_name,
      last_name,
    };
    chai.request(server)
      .post('/api/v1/admin/signup')
      .set('x-access-token', token)
      .send(admin)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a admin without firt_name, last_name or password field only', (done) => {
    const admin = {
      email,
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .set('x-access-token', token)
      .send(admin)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a admin with empty email or password field only', (done) => {
    const admin = {
      first_name,
      last_name,
      password: '',
      email: '',
    };
    chai.request(server)
      .post('/api/v1/admin/signup')
      .set('x-access-token', token)
      .send(admin)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a admin with empty email or adminname field only', (done) => {
    const admin = {
      password,
      first_name: '',
      last_name: '',
      email: '',
    };
    chai.request(server)
      .post('/api/v1/admin/signup')
      .set('x-access-token', token)
      .send(admin)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not CREATE a admin with empty adminname or password field only', (done) => {
    const admin = {
      email,
      first_name: '',
      last_name: '',
      password: '',
    };
    chai.request(server)
      .post('/api/v1/admin/signup')
      .set('x-access-token', token)
      .send(admin)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });

  it('it should not POST a admin, if email is not valid', (done) => {
    const admin = {
      email: 'test.com',
      first_name,
      last_name,
      password,
    };
    chai.request(server)
      .post('/api/v1/admin/signup')
      .set('x-access-token', token)
      .send(admin)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Please enter a valid Email');
        done(err);
      });
  });

  it('it should not POST a admin, if password is not valid', (done) => {
    const admin = {
      email,
      password: 'pass',
      first_name,
      last_name,
    };
    chai.request(server)
      .post('/api/v1/admin/signup')
      .set('x-access-token', token)
      .send(admin)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Password must be more than five(5) characters');
        done(err);
      });
  });

  it('it should not POST a admin, if password is empty spaces', (done) => {
    const admin = {
      email,
      password: '         ',
      first_name,
      last_name,
    };
    chai.request(server)
      .post('/api/v1/admin/signup')
      .set('x-access-token', token)
      .send(admin)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email, password, first name and last name field cannot be empty');
        done(err);
      });
  });
});
