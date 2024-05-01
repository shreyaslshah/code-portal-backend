const { gql } = require('apollo-server');

module.exports = gql`
  type Output{
    expected_output: String,
    stdout: String,
    status_id: Int,
    time: String,
    memory: Int,
    stderr: String,
    compile_output: String,
    stdin: String
  },
  type Contest{
    contestId: ID,
    contestTitle: String,
    points: [Float]
  },
  type User{
    id: ID!,
    username: String!,
    email: String!,
    token: String,
    isAdmin: Boolean!,
    isVerified: Boolean!,
    phone: String,
    college: String,
    contests: [Contest]
  },
  input GetOtpInput{
    username: String!,
    email: String!,
    password: String!,
    phone: String!,
    college: String!
  },
  input RegisterInput{
    username: String!,
    email: String!,
    password: String!,
    phone: String!,
    college: String!,
    otp: Int!
  },
  input TestCase{
    input: String,
    output: String
  },
  input Question{
    title: String,
    description: String,
    difficulty: String,
    points: Int,
    sampleInput: String,
    sampleOutput: String,
    timeLimit: Float,
    memoryLimit: Int,
    testcases: [TestCase]
  },
  input CreateContestInput{
    title: String,
    description: String,
    start: String,
    end: String,
    image: String,
    questions: [Question]
  },
  type TestCaseDetails{
    input: String,
    output: String
  },
  type QuestionDetails{
    title: String,
    description: String,
    difficulty: String,
    points: Int,
    sampleInput: String,
    sampleOutput: String,
    timeLimit: Float,
    memoryLimit: Int,
    testcases: [TestCaseDetails]
  },
  type ContestDetails{
    id: ID,
    title: String,
    description: String,
    start: String,
    end: String,
    image: String,
    questions: [QuestionDetails]
  },
  type LeaderboardEntry{
    username: String!,
    points: Float!
  }
  type Query{
    getUser: User!
    getContest(contestId: ID!): ContestDetails!
    getContests: [ContestDetails!]!
    leaderboard(contestId: ID!): [LeaderboardEntry!]!
  },
  type Mutation{
    submit(contestId: ID!, questionNo: Int!, langId: Int!, code: String!): [Output],
    createContest(createContestInput: CreateContestInput): String,
    getOtp(getOtpInput: GetOtpInput): User!,
    register(registerInput: RegisterInput): User!,
    login(email: String!, password: String!): User!
  }
`;