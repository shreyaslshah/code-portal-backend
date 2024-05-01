const User = require('../models/User');

module.exports = async (response, { id }, contestId, questionNo, contest) => {
  var user = null;
  try {
    user = await User.findById(id);
  } catch (error) {
    throw new Error("error in finding user");
  }
  if (!user) {
    throw new Error("user not found");
  }

  var idx = user.contests.findIndex(o => o.contestId.equals(contestId));

  if (idx === -1) { // not found
    var pointsArray = new Array(contest.questions.length);
    for (var i = 0; i < pointsArray.length; i++) {
      pointsArray[i] = 0;
    }
    user.contests.push({ contestId, points: pointsArray });
    idx = user.contests.length - 1;
  }

  var points = 0;
  var totalPoints = contest.questions[questionNo].points;
  var totalTestCases = contest.questions[questionNo].testcases.length;
  for (var i = 0; i < response.length; i++) {
    if (response[i].status_id === 3) {
      points += totalPoints / totalTestCases;
    }
  }
  user.contests[idx].points[questionNo] = Math.max(points, user.contests[idx].points[questionNo]);

  try {
    const res = await user.save();
  } catch (error) {
    throw new Error('could not update user points');
  }
}
