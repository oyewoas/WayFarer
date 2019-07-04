/* eslint-disable camelcase */
/* eslint-disable no-undef */
import chai from 'chai';
import bcrypt from 'bcrypt';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import server from '../server';
import pool from '../app/db/test/pool';
import {
  createAllTables,
} from '../app/db/test/dbConnection';

createAllTables();


dotenv.config();

const {
  expect,
} = chai;
chai.use(chaiHttp);

const title = 'Here is a title';
const description = 'Here is a sample description';
const email = 'test@gmail.com';
const password = 'testingtesting';
const first_name = 'sammy';
const last_name = 'jay';

// Generating token for testing
const token = jwt.sign({
  email,
  userId: 1,
},
'secret', {
  expiresIn: '1h',
});
beforeEach(() => {
  pool.query('TRUNCATE TABLE users CASCADE',
    (err) => {
      if (err) {
        console.log(err);
      }
      pool.end();
    });
});

// Authentication
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
        // console.log(err)
        expect(res.body.error).equals('error');
        expect(res.body.status).equals('400');
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
        expect(res.body.error).equals('error');
        expect(res.body.status).equals('400');
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
        expect(res.body.error).equals('error');
        expect(res.body.status).equals('400');
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
        expect(res.body.error).equals('error');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not CREATE a user with empty username or password field only', (done) => {
    const user = {
      email: 'testing@gmail.com',
      username: '',
      password: '',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not POST a user, if user already exists', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
      username: 'ayooluwa',
    };
    pool.query('INSERT INTO users(email, password, username) values($1, $2, $3)', ['test@gmail.com', 'password', 'ayooluwa'], () => {
      chai.request(server)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          expect(res.body.message).equals('User Already Exists');
          expect(res.body.status).equals('409');
          done(err);
        });
    });
  });


  it('it should not POST a user, if email is not valid', (done) => {
    const user = {
      email: 'test.com',
      password: 'password',
      username: 'ayooluwa',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not POST a user, if password is not valid', (done) => {
    const user = {
      email: 'test.com',
      password: 'pass',
      username: 'ayooluwa',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Invalid email or password');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should not POST a user, if password is empty spaces', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: '         ',
      username: 'ayooluwa',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('Bad Request');
        expect(res.body.status).equals('400');
        done(err);
      });
  });

  it('it should  POST a user', (done) => {
    const user = {
      email: 'test@gmail.com',
      password: 'password',
      username: 'ayooluwa',
    };
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.message).equals('User Created Successfully');
        expect(res.body.status).equals('201');
        done(err);
      });
  });
});
