const { model, Schema } = require('mongoose');

const quizAttemptSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        quiz: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
        },
        elapsedTime: {
            type: Number,
            required: true,
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
    },
    { timestamps: true }
);

const QuizAttempt = model('QuizAttempt', quizAttemptSchema);
module.exports = QuizAttempt;
