const QuizAttempt = require('../../models/QuizAttempt');
const Quiz = require('../../models/Quiz');
const User = require('../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

function roundToTwoPlace(num) {
  return Math.round(num * 100) / 100;
}

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

      let questions = quiz.questions

      let coinsEarned = 0; 

      let answers = [];

      for(let i = 0; i < questions.length; i++){
        answers[i] = questions[i].answer; 
      }

      let questionsCorrect = 0; 


      for(let i = 0; i < questions.length; i++){
        if(answerChoices[i][0].trim() === answers[i][0].trim())
          questionsCorrect++;
      }


      let score = roundToTwoPlace(questionsCorrect/quiz.numQuestions * 100); 
      if (quiz.averageScore === null && quiz.medianScore === null) {
        quiz.averageScore = score;
        quiz.medianScore = score;
        quiz.save();
      } else {
        // Finding new average
        quiz.averageScore = quiz.averageScore + ((score - quiz.averageScore) / quiz.numAttempts);
        quiz.averageScore = roundToTwoPlace(quiz.averageScore)

        //Finding new median
        let quizAttemptScores = await QuizAttempt.find({quiz:quiz}).select('score');
        let scores = quizAttemptScores.map((attempt) => attempt.score);
        scores.push(score);
        const mid = Math.floor(scores.length / 2)
        sortedScores = [...scores].sort((a, b) => a - b);
        quiz.medianScore = scores.length % 2 !== 0 ? sortedScores[mid] : (sortedScores[mid - 1] + sortedScores[mid]) / 2;
        quiz.medianScore = roundToTwoPlace(quiz.medianScore);
        quiz.save();
      }

      const _id = new ObjectId();

      let user = null; 
      let attemptNumber = null;

      if(user_id != null){
        user = await User.findById(user_id);
        const quizAttempts = await QuizAttempt.find({quiz:quiz, user:user})
        attemptNumber = quizAttempts.length + 1; 

        if(attemptNumber === 1){
          coinsEarned = questionsCorrect * 10;
          user.currency += coinsEarned;
          user.save();
          console.log(user)
          console.log(user.currency)
        }
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
        attemptNumber,
        coinsEarned
      });

      const quizAttempt = await newQuizAttempt.save();
      
      return quizAttempt; 
    }
  }
};
