const mongoose = require('mongoose');
const { Schema } = mongoose;

export interface UserInterface {
  id: string;
  login: string,
  password: string,
  age: number,
  isdeleted: boolean
}

const UserModel: UserInterface = mongoose.model('User', new Schema({
  id: String,
  login: String,
  password: String,
  age: Number,
  isdeleted: Boolean
}));

module.exports = UserModel;
