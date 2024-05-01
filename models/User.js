const { model, Schema, default: mongoose } = require('mongoose');
const { isEmail } = require("validator");

const UsersSchema = new Schema({
  username: {
    type: String,
    required: [true, "please enter a Username"],
    unique: [true, "that username is already taken"],
  },
  email: {
    type: String,
    required: [true, "please enter your Email ID"],
    unique: [true, "that email already has an account"],
    lowercase: true,
    validate: [isEmail, "please enter a valid Email ID"],
  },
  password: {
    type: String,
    required: [true, "Please enter a Password"],
    minlength: [6, "minimum Password length must be 4 characters"],
  },
  phone: {
    type: String,
    required: [true, 'please enter a phone number']
  },
  college: {
    type: String,
    required: [true, 'please enter the name of your college'],
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  contests: [{
    contestId: mongoose.Schema.ObjectId,
    points: [Number]
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  otp : Number
});

module.exports = model('User', UsersSchema);