/* eslint-disable camelcase */
/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import moment from 'moment';
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

  it('it should not POST a user, if user already exists', (done) => {
    const user = {
      email,
      password,
      first_name,
      last_name,
    };
    pool.query('INSERT INTO users(email, password, first_name, last_name, created_on) values($1, $2, $3, $4, $5)', [email, password, first_name, last_name, created_on], () => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(status.conflict);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('User with that EMAIL already exist');
          done(err);
        });
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
  it('it should  POST a user', (done) => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.created);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        res.body.data.should.have.property('token');
        done(err);
      });
  });
});


// SignIn testing
describe('/POST Sign user in', () => {
  it('it should not log a user in without email field', (done) => {
    const user = {
      password,
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email or Password detail is missing');
        done(err);
      });
  });

  it('it should not Log a user in without password field', (done) => {
    const user = {
      email,
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email or Password detail is missing');
        done(err);
      });
  });

  it('it should not Log a user in, if password is empty spaces', (done) => {
    const user = {
      email,
      password: '         ',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email or Password detail is missing');
        done(err);
      });
  });

  it('it should not Log a user in, if email is empty', (done) => {
    const user = {
      email: '',
      password,
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Email or Password detail is missing');
        done(err);
      });
  });

  it('it should not Log a user in, if email is incorrect', (done) => {
    const user = {
      email: 'test.com',
      password,
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Please enter a valid Email or Password');
        done(err);
      });
  });

  it('it should not Log a user in, if password is substandard', (done) => {
    const user = {
      email,
      password: 'pass',
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.bad);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('Please enter a valid Email or Password');
        done(err);
      });
  });

  it('it should not LOG a user in if user does not exist', (done) => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(8),
    };
    chai.request(server)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(status.notfound);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql('User with this email does not exist');
        done(err);
      });
    process.exit(0);
  });
});
