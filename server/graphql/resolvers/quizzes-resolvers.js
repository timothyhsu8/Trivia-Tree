const Quiz = require('../../models/Quiz');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    Query: {
        async getQuizzes() {
            try {
                const quizzes = await Quiz.find().populate('user').exec();
                return quizzes;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getQuiz(_, { quizId }) {
            try {
                const quiz = await Quiz.findById(quizId)
                    .populate('user')
                    .exec();
                if (quiz) {
                    return quiz;
                } else {
                    throw new Error('Quiz not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async createQuiz(
            _,
            { quizInput: { title, questions, description, quizTimer } },
            context
        ) {
            if (title.trim() === '') {
                throw new Error('Quiz title cannot be blank');
            }

            const valid = questions.forEach((question) => {
                if (question.question.trim() === '') {
                    throw new Error('A question cannot be blank');
                }
                let answerMatch = false;

                question.answer.forEach((answer) => {
                    if (answer.trim() === '') {
                        throw new Error('An answer cannot be blank');
                    }
                });

                if (question.answerChoices.length <= 1) {
                    throw new Error(
                        'A question must have at least two choices'
                    );
                }
                question.answerChoices.forEach((choice) => {
                    if (choice.trim() === '') {
                        throw new Error('An answer choice cannot be blank');
                    }

                    question.answer.forEach((answer) => {
                        if (choice.trim() === answer.trim()) {
                            answerMatch = true;
                        }
                    });
                });
                if (!answerMatch) {
                    throw new Error(
                        'A question must have an answer choice that matches the answer'
                    );
                }
            });

            let numQuestions = questions.length;
            let numFavorites = 0;
            let numAttempts = 0;

            const newQuiz = new Quiz({
                user: context.req.user._id,
                title,
                questions,
                description,
                quizTimer,
                numQuestions,
                numFavorites,
                numAttempts,
            });

            const quiz = await newQuiz.save();

            return quiz;
        },
        async createQuizApollo(
            _,
            { quizInput: { title, questions, description, quizTimer } },
            context
        ) {
            if (title.trim() === '') {
                throw new Error('Quiz title cannot be blank');
            }

            const valid = questions.forEach((question) => {
                if (question.question.trim() === '') {
                    throw new Error('A question cannot be blank');
                }
                let answerMatch = false;

                question.answer.forEach((answer) => {
                    if (answer.trim() === '') {
                        throw new Error('An answer cannot be blank');
                    }
                });

                if (question.answerChoices.length <= 1) {
                    throw new Error(
                        'A question must have at least two choices'
                    );
                }
                question.answerChoices.forEach((choice) => {
                    if (choice.trim() === '') {
                        throw new Error('An answer choice cannot be blank');
                    }

                    question.answer.forEach((answer) => {
                        if (choice.trim() === answer.trim()) {
                            answerMatch = true;
                        }
                    });
                });
                if (!answerMatch) {
                    throw new Error(
                        'A question must have an answer choice that matches the answer'
                    );
                }
            });

            let numQuestions = questions.length;
            let numFavorites = 0;
            let numAttempts = 0;

            let tamzidID = "6172d9fed71c6185f410226f"

            const newQuiz = new Quiz({
                user: tamzidID,
                title,
                questions,
                description,
                quizTimer,
                numQuestions,
                numFavorites,
                numAttempts,
            });

            const quiz = await newQuiz.save();

            return quiz;
        },
        async deleteQuiz(_, { quizId }, context) {
            try {
                const quiz = await Quiz.findById(quizId);
                if (!quiz.user.equals(context.req.user._id)) {
                    throw new Error('You are not the creator of this quiz');
                }
                await quiz.delete();
                return quiz;
            } catch (err) {
                throw new Error(err);
            }
        },
    },
};
