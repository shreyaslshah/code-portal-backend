const { model, Schema } = require('mongoose');

const ContestsSchema = new Schema({
  title: {
    type: String,
    required: [true, 'title empty']
  },
  description: {
    type: String,
    required: [true, 'description empty']
  },
  start: {
    type: String,
    required: [true, 'start time empty']
  },
  end: {
    type: String,
    required: [true, 'end time empty']
  },
  image: {
    type: String
  },
  questions : [{
    title : String,
    difficulty : String,
    description : String,
    points : Number,
    sampleInput : String,
    sampleOutput : String,
    timeLimit : Number,
    memoryLimit : {
      type: Number,
      min: [2048, 'memory limit must be greater than 2048']
    },
    testcases : [{
      input : String,
      output : String
    }]
  }]
});

module.exports = model('Contest', ContestsSchema);