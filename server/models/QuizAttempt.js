const { model, Schema } = require('mongoose');

const quizAttemptSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        quiz: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
        },
        elapsedTime: {
            type: String,
        },
        score: {
            type: Number,
            required: true,
        },
        answerChoices: {
            type: [[String]], //array of answer choices(answerchoice itself can be an array for question types 2)
            required: true,
        },
        questions: {
            type: [String],
        },
        numCorrect: {
            type: Number,
            required: true
        },
        attemptNumber: {
            type: Number
        }
    },
    { timestamps: true }
);

const QuizAttempt = model('QuizAttempt', quizAttemptSchema);
module.exports = QuizAttempt;
