const QuizAttempts = require('../../models/QuizAttempt');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  Query: {
  },
  Mutation: {
    async submitQuiz(_, { quizAttemptInput: { id, answerChoices } }) {
      console.log(id);
      console.log(answerChoices)

      return; 
    }
  }
};
