const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports.validateOtpInput = async (username, email, password, phone, college) => {
  const errors = {};
  if (username.trim() === '') {
    errors.username = 'username is empty'
  }
  else {
    let user = null;
    try {
      user = await User.findOne({ username });
    } catch (error) {
      throw new Error('error in finding user')
    }
    if (user && user.isVerified === true) {
      errors.username = 'username is taken';
    }
    else if (user && user.isVerified === false) {
      try {
        await User.deleteOne({ username });
      } catch (error) {
        throw new Error('error in deleting unverified user')
      }
    }
  }

  if (email.trim() === '') {
    errors.email = 'email is empty'
  }
  else {
    const regularExpressionEmail =/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,})+$/;
    if (!email.match(regularExpressionEmail)) {
      errors.email = 'invalid email';
    }
    else {
      let user = null;
      try {
        user = await User.findOne({ email });
      } catch (error) {
        throw new Error('error in finding user')
      }
      if (user && user.isVerified === true) {
        errors.email = 'email is taken';
      }
      else if (user && user.isVerified === false) {
        try {
          await User.deleteOne({ email });
        } catch (error) {
          throw new Error('error in deleting unverified user')
        }
      }
    }
  }

  if (password.trim() === '') {
    errors.password = 'password is empty'
  }
  else if (password.length < 6) {
    errors.password = 'password has to be minimum 6 characters'
  }

  if (phone.trim() === '') {
    errors.phone = 'phone number is empty'
  }
  const regexphone = /^[0-9]{10}$/;
  if (!phone.match(regexphone)) {
    errors.phone = 'phone number is invalid'
  }

  if (college.trim() === '') {
    errors.college = 'college is empty'
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

module.exports.validateRegisterInput = async (username, email, password, phone, college, otp) => {

  const errors = {};
  let user = null;
  try {
    user = await User.findOne({ username })
  } catch (error) {
    throw new Error("error in finding user");
  }

  if (!user) {
    errors.username = 'user not found';
  }
  else {
    const match = await bcrypt.compare(password, user.password);
    if (user.isVerified === true) {
      errors.user = 'user already registered'
    }
    if (user.email !== email) {
      errors.email = 'incorrect email'
    }
    if (user.phone !== phone) {
      errors.phone = 'incorrect phone number'
    }
    if (user.college !== college) {
      errors.college = 'incorrect college name'
    }
    if (!match) {
      errors.password = 'incorrect password'
    }
    if (user.otp !== otp) {
      errors.otp = 'incorrect otp'
    }
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

module.exports.validateLoginInput = async (email, password) => {
  const errors = {};
  let user = null;

  if (email.trim() === '') {
    errors.email = 'email is empty'
  }
  else {
    try {
      user = await User.findOne({ email });
    } catch (error) {
      throw new Error('error in finding user')
    }
    if (!user) {
      errors.email = 'email not found';
    }
  }

  if (password.trim() === '') {
    errors.password = 'password is empty'
  }
  else {
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.password = 'wrong password';
      }
      if (!user.isVerified) {
        errors.user = 'please verify your account';
      }
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    user
  }
}
