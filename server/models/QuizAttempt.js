const { model, Schema, ObjectId } = require('mongoose');

const quizAttemptSchema = new Schema(
    {
        _id: {
            type: ObjectId,
            required: true
        },
        user_id: { 
            type: ObjectId,
            required: true
        },
        quiz_id: {
            type: ObjectId,
            required: true
        },
        elapsedTime: {
            type: Number,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        answerChoices: {
            type: [[String]], //array of answer choices(answerchoice itself can be an array for question types 2 and 3)
            required: true
        },
        questions: {
            type: [String]
        }
    },
    { timestamps: true }
);



const QuizAttempt = model('QuizAttempt', quizAttemptSchema);
module.exports = QuizAttempt;
