const axios = require("axios");
const Contest = require('../../models/Contest');
const User = require("../../models/User");
const checkAuth = require('../../util/checkAuth.js');
const updateUserSubmission = require('../../util/updateUserSubmission.js');
require('dotenv').config();

module.exports = {
  Query: {
    async getContests() {
      try {
        return await Contest.find();
      } catch (error) {
        throw new Error("error in getting contests");
      }
    },
    async getContest(_, { contestId }) {
      try {
        return await Contest.findById(contestId);
      } catch (error) {
        throw new Error("error in getting contests");
      }
    }
  },
  Mutation: {
    async createContest(_, { createContestInput }, context) {
      let user = checkAuth(context);

      try {
        user = await User.findById(user.id);
      } catch (error) {
        throw new Error("could not find user");
      }
      if (!user.isAdmin) {
        throw new Error("user is not an admin");
      }

      const newContest = new Contest({
        title: createContestInput.title,
        description: createContestInput.description,
        start: createContestInput.start,
        end: createContestInput.end,
        questions: createContestInput.questions
      });

      try {
        const contest = await newContest.save()
      } catch (error) {
        throw new Error('Contest not created')
      }
      return 'contest created';
    },

    async submit(_, { contestId, questionNo, langId, code }, context) {
  
      const user = checkAuth(context);
      /*----------GET QUES----------*/
      var contest = null;
      var submissionDetails = [];
      code = Buffer.from(code).toString('base64');

      try {
        contest = await Contest.findById(contestId);
        if (questionNo > contest.questions.length || questionNo < 0) {
          throw new Error("incorrect question number");
        }
        for (let i = 0; i < contest.questions[questionNo].testcases.length; i++) {
          submissionDetails.push({
            "source_code": code,
            "language_id": langId,
            "stdin": Buffer.from(contest.questions[questionNo].testcases[i].input).toString('base64'),
            "expected_output": Buffer.from(contest.questions[questionNo].testcases[i].output).toString('base64'),
            "cpu_time_limit": contest.questions[questionNo].timeLimit,
            "memory_limit": 128000
            //contest.questions[questionNo].memoryLimit
          })
        }
      } catch (error) {
        throw new Error("could not get contest");
      }

      /*----------CREATE SUBMISSION----------*/
      const postOptions = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: {base64_encoded: 'true'},
        headers: {
          'content-type': 'application/json',
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: JSON.stringify({
          "submissions": submissionDetails
        })
      };

      var tokenStream = '';
      try {
        const response = await axios.request(postOptions);
        for (let i = 0; i < response.data.length; i++) {
          tokenStream += (response.data[i].token + ',');
        }
        tokenStream = tokenStream.slice(0, -1);
      } catch (error) {
        throw new Error("error in creating submission");
      }

      console.log(tokenStream)
      const getOptions = {
        method: 'GET',
        url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
        params: { tokens: tokenStream, fields: '*', base64_encoded: 'true' },
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      };


      for (let j = 0; j < 5; j++) {
        try {
          const response = await axios.request(getOptions);
          var flag = 0;
          for (var i = 0; i < response.data.submissions.length; i++) {
            if (response.data.submissions[i].status_id === 1 ||
              response.data.submissions[i].status_id === 2) {
              flag = 1;
              break;
            }
          }
          if (flag === 0) {
            await updateUserSubmission(response.data.submissions, user, contestId, questionNo, contest);
            return response.data.submissions
          } else {
            await new Promise(r => setTimeout(r, 5000));
          }
        } catch (error) {
          throw new Error("error in getting submission");
        }
      }

      throw new Error("submission timeout");
    }
  }
}