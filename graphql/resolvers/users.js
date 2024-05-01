const User = require('../../models/User')
const Contest = require('../../models/Contest')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const { validateOtpInput, validateRegisterInput, validateLoginInput } = require('../../util/validators')
const { sendMail } = require('../../util/sendMail')
const checkAuth = require('../../util/checkAuth');
require('dotenv').config();


module.exports = {
  Query: {
    async getUser(_, __, context) {
      let user = checkAuth(context);
      try {
        user = await User.findById(user.id);
        if (!user) {
          throw new Error("could not find user");
        }
      } catch (error) {
        throw new Error("could not find user");
      }

      let contests = null;
      try {
        contests = await Contest.find();
      } catch (error) {
        throw new Error("could not fetch contests");
      }

      user.contests = user.contests.map((c, i) => {
        let temp = contests.find(contest => contest._id.equals(c.contestId))
        if (temp.title) {
          c.contestTitle = temp.title;
        }
        return c;
      })
      return user;
    },
    async leaderboard(_, { contestId }) {
      let users = null;
      try {
        users = await User.find({ "contests.contestId": contestId });
      } catch (error) {
        throw new Error("could not find users");
      }
      let leaderboard = [];
      try {
        users.forEach((user, i) => {
          let idx = user.contests.findIndex(obj => obj.contestId.equals(contestId));
          let points = 0;
          for (const item of user.contests[idx].points) {
            points += item;
          }
          leaderboard.push({ username: user.username, points });
        })
        leaderboard.sort((a, b) => b.points - a.points);
      } catch (error) {
        throw new Error("could not compute leaderboard");
      }
      return leaderboard;
    }
  },
  Mutation: {
    async getOtp(_, { getOtpInput: { username, email, password, phone, college } }) {
      const { errors, isValid } = await validateOtpInput(username, email, password, phone, college);
      if (!isValid) {
        throw new UserInputError('errors', { errors });
      }
      password = await bcrypt.hash(password, 12);
      const otp = Math.floor(Math.random() * 9000 + 1000);
      const user = new User({
        username,
        email,
        password,
        phone,
        college,
        otp
      });

      let res = null;
      try {
        res = await user.save();
      } catch (error) {
        throw new Error('error in creating user');
      }

      sendMail(email, otp)

      return {
        id: res._id,
        username: res.username,
        email: res.email,
        isAdmin: res.isAdmin,
        isVerified: res.isVerified
      };
    },

    async register(_, { registerInput: { username, email, password, phone, college, otp } }) {
      const { errors, isValid } = await validateRegisterInput(username, email, password, phone, college, otp);
      if (!isValid) {
        throw new UserInputError('errors', { errors });
      }
      let user = null;
      try {
        user = await User.findOneAndUpdate({ username }, { isVerified: true }, {
          new: true
        });
      } catch (error) {
        throw new Error("error in finding and verifying user");
      }
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
      }, process.env.JWT_KEY, { expiresIn: '24h' })

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        token,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified
      };
    },

    async login(_, { email, password }) {
      const { errors, isValid, user } = await validateLoginInput(email, password);
      if (!isValid) {
        throw new UserInputError('errors', { errors });
      }
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
      }, process.env.JWT_KEY, { expiresIn: '24h' })

      return {
        id: user._id,
        username: user.username,
        email: user.email,
        token,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified
      };
    }
  }
}