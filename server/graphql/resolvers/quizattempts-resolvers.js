const QuizAttempt = require('../../models/QuizAttempt');
const Quiz = require('../../models/Quiz');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  Query: {
    async getQuizAttempt(_, {_id}) {
      const quizAttempt = await QuizAttempt.findById(_id).populate('quiz').exec();
      return quizAttempt;
    }
  },
  Mutation: {
    async submitQuiz(_, { quizAttemptInput: { quiz_id, answerChoices, elapsedTime } }) {

      const quiz = await Quiz.findById(quiz_id);
      quiz.numAttempts = quiz.numAttempts + 1; 
      quiz.save();

      let questions = quiz.questions

      let answers = [];

      for(let i = 0; i < questions.length; i++){
        answers[i] = questions[i].answer; 
      }

      let questionsCorrect = 0; 


      for(let i = 0; i < questions.length; i++){
        if(answerChoices[i][0] == answers[i][0])
          questionsCorrect++;
      }


      let score = Math.round(questionsCorrect/quiz.numQuestions * 100); 

      const _id = new ObjectId();


      const newQuizAttempt = new QuizAttempt({
        _id,
        quiz,
        elapsedTime,
        score, 
        answerChoices,
        questions,
        numCorrect:questionsCorrect
      });

      const quizAttempt = await newQuizAttempt.save();

      console.log(quizAttempt)
      
      return quizAttempt; 
    }
  }
};
