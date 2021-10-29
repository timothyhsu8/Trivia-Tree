const QuizAttempt = require('../../models/QuizAttempt');
const Quiz = require('../../models/Quiz');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  Query: {
  },
  Mutation: {
    async submitQuiz(_, { quizAttemptInput: { quiz_id, answerChoices } }) {

      const quiz = await Quiz.findById(quiz_id);
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
        quiz_id,
        score, 
        answerChoices,
        questions
      });

      const quizAttempt = await newQuizAttempt.save();

      console.log(quizAttempt);
      
      return; 
    }
  }
};
