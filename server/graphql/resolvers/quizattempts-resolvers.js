const QuizAttempt = require('../../models/QuizAttempt');
const Quiz = require('../../models/Quiz');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  Query: {
    async getQuizAttempt(_, {_id}) {
      const quizAttempt = await QuizAttempt.findById(_id);
      return quizAttempt;
    }
  },
  Mutation: {
    async submitQuiz(_, { quizAttemptInput: { quiz, answerChoices } }) {

      const quizObject = await Quiz.findById(quiz);
      quizObject.numAttempts = quiz.numAttempts + 1; 
      quizObject.save();

      let questions = quizObject.questions

      let answers = [];

      for(let i = 0; i < questions.length; i++){
        answers[i] = questions[i].answer; 
      }

      let questionsCorrect = 0; 


      for(let i = 0; i < questions.length; i++){
        if(answerChoices[i][0] == answers[i][0])
          questionsCorrect++;
      }


      let score = Math.round(questionsCorrect/quizObject.numQuestions * 100); 

      const _id = new ObjectId();


      const newQuizAttempt = new QuizAttempt({
        _id,
        quiz:quizObject,
        score, 
        answerChoices,
        questions
      });

      const quizAttempt = await newQuizAttempt.save();
      
      return quizAttempt; 
    }
  }
};
