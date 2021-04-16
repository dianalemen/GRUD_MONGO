const mongoose = require('mongoose');

import config from '../../config.js';
import { generateUserId } from './../helpers';
import { UserInterface } from './../models/user';

const messages = require('./../messages');
const UserModel = require('./../models/user');

mongoose.connect(
  config.DATABASE_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log('Connected to database ')
}).catch((err) => {
  console.error(`Error connecting to the database. \n${err}`);
});

const User = mongoose.model('User');

const dbModule = {
  getUsers: (): Promise<Array<UserInterface>> => {
    return new Promise(async (resolve, reject) => {
      const filter = {};
      try {
        const all = await User.find(filter);
        return resolve(all);
      } catch (err) {
        return reject(err);
      }
    })
  },
  createUser: ({ login, password, age, isdeleted }): Promise<string> => {
    return new Promise((resolve, reject) => {
      const userDoc = new UserModel({ id: generateUserId(), login, password, age, isdeleted });
      return userDoc.save((err) => {
        if (err) return reject(err);
        return resolve(messages.savedSuccessfully);
      });
    })
  },
  updateUser: (body): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      const { id, ...rest } = body;
      try {
        await User.update({ id: id }, { ...rest });
        return resolve(messages.updatedSuccessfully);
      } catch (err) {
        return reject(err);
      }
    });
  },
  deleteUser: (body): Promise<string> => {
    const { id } = body;
    return new Promise(async (resolve, reject) => {
      try {
        await User.update({ id }, { isdeleted: true });
        return resolve(messages.deletedSuccessfully);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getUserById: (id): Promise<Array<UserInterface>> => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.find({ id });
        return resolve(user);
      } catch (err) {
        return reject(err);
      }
    });
  },
  getUsersBySubStrAndLimit: ({ loginSubStr, limit }): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await User
          .find({ login: { $regex: `.*${loginSubStr}.*` } })
          .limit(Number(limit));
        return resolve(users);
      } catch (err) {
        return reject(err);
      }
    });
  }
}

module.exports = dbModule;
