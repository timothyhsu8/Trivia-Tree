const Quiz = require('../../models/Quiz');
const User = require('../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const cloudinary = require('cloudinary').v2;

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
            {
                quizInput: {
                    title,
                    questions,
                    description,
                    icon,
                    isTimerForQuiz,
                    quizTimer,
                    questionTimer,
                    quizShuffled,
                    quizInstant,
                },
            },
            context
        ) {
            if (context.req.user === undefined) {
                throw new Error('You must be logged in to create quizzes');
            }
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
                        throw new Error('Each question must have an answer');
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

                if (
                    new Set(question.answerChoices).size !==
                    question.answerChoices.length
                ) {
                    throw new Error(
                        'A question cannot have answer choices that are the same'
                    );
                }
            });

            let imageType = context.req.headers.imagetype;
            let imageUrl;
            if (imageType === 'Default Image') {
                imageUrl =
                    'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png';
            } else {
                await cloudinary.uploader.upload(icon, (error, result) => {
                    if (error) {
                        throw new Error('Could not upload image');
                    }
                    imageUrl = result.secure_url;
                });
            }

            let numQuestions = questions.length;
            let numFavorites = 0;
            let numAttempts = 0;

            const newQuiz = new Quiz({
                user: context.req.user._id,
                title,
                questions,
                description,
                icon: imageUrl,
                isTimerForQuiz,
                quizTimer,
                questionTimer,
                quizShuffled,
                quizInstant,
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

            let tamzidID = '6172d9fed71c6185f410226f';

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
        async updateQuiz(
            _,
            {
                quizInput: {
                    quizId,
                    title,
                    questions,
                    description,
                    icon,
                    isTimerForQuiz,
                    quizTimer,
                    questionTimer,
                    quizShuffled,
                    quizInstant,
                },
            },
            context
        ) {
            let quiz;
            try {
                quiz = await Quiz.findById(quizId);
            } catch (err) {
                throw new Error(err);
            }
            if (!quiz.user.equals(context.req.user._id)) {
                throw new Error('You are not the creator of this quiz');
            }

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
                        throw new Error('Each question must have an answer');
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

                if (
                    new Set(question.answerChoices).size !==
                    question.answerChoices.length
                ) {
                    throw new Error(
                        'A question cannot have answer choices that are the same'
                    );
                }
            });

            let imageType = context.req.headers.imagetype;
            let imageUrl = icon;
            if (imageType === 'New Image') {
                await cloudinary.uploader.upload(icon, (error, result) => {
                    if (error) {
                        throw new Error('Could not upload image');
                    }
                    imageUrl = result.secure_url;
                });
            }

            let numQuestions = questions.length;
            let numFavorites = 0;
            let numAttempts = 0;

            const updates = {
                user: context.req.user._id,
                title,
                questions,
                description,
                icon: imageUrl,
                isTimerForQuiz,
                quizTimer,
                questionTimer,
                quizShuffled,
                quizInstant,
                numQuestions,
                numFavorites,
                numAttempts,
            };

            quiz = await Quiz.findByIdAndUpdate(quizId, updates, { new: true });

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
        async favoriteQuiz(_, { quizId, userId }) {
            console.log(quizId);
            console.log(userId);

            const quiz = await Quiz.findById(quizId);

            quiz.numFavorites = quiz.numFavorites + 1;
            quiz.save();

            const user = await User.findById(userId);
            const userFavQuizzes = user.favoritedQuizzes;
            userFavQuizzes.push(quiz);
            user.favoritedQuizzes = userFavQuizzes;
            user.save();

            console.log(user.favoritedQuizzes);

            return true;
        },
    },
};
