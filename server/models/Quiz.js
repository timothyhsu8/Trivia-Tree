const { model, Schema } = require('mongoose');

const quizSchema = new Schema({
    title: String,
    questions: [
        {
            question: String,
            answerChoices: [String],
            answer: String,
        },
    ],
});

module.exports = model('Quiz', quizSchema);
