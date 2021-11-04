const QuizAttempt = require('../../models/QuizAttempt');
const Quiz = require('../../models/Quiz');
const User = require('../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  Query: {
    async getQuizAttempt(_, {_id}) {
      const quizAttempt = await QuizAttempt.findById(_id).populate({path:'quiz', populate:{path:'user'}}).populate({path: 'user'}).exec()
      return quizAttempt;
    },

    async getLeaderboard(_, {quiz_id}) {
      const quiz = await Quiz.findById(quiz_id).exec();
      const quizAttempts = await QuizAttempt.find({quiz:quiz, attemptNumber:1}).populate({path:'quiz', populate:{path:'user'}}).populate({path: 'user'}).sort( { score: -1 } ).limit(10)

      return quizAttempts;
    }
  },
  Mutation: {
    async submitQuiz(_, { quizAttemptInput: { quiz_id, answerChoices, elapsedTime, user_id } }) {

      
      const quiz = await Quiz.findById(quiz_id).exec();
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

      let user = null; 
      let attemptNumber;

      if(user_id != null){
        user = await User.findById(user_id);
        const quizAttempts = await QuizAttempt.find({quiz:quiz, user:user})
        attemptNumber = quizAttempts.length + 1; 
      }


      const newQuizAttempt = new QuizAttempt({
        _id,
        user,
        quiz,
        elapsedTime,
        score, 
        answerChoices,
        questions,
        numCorrect:questionsCorrect,
        attemptNumber
      });

      const quizAttempt = await newQuizAttempt.save();
      
      return quizAttempt; 
    }
  }
};
