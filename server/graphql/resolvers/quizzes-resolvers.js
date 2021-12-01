const Quiz = require('../../models/Quiz');
const User = require('../../models/User');
const QuizAttempt = require('../../models/QuizAttempt');
const Platform = require('../../models/Platform');
const ObjectId = require('mongoose').Types.ObjectId;
const cloudinary = require('cloudinary').v2;

function roundToTwoPlace(num) {
    return Math.round(num * 100) / 100;
}

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
        async searchQuizzes(_, { searchText }) {
            try {
                const quizzes = await Quiz.find({
                    title: { $regex: searchText, $options: 'i' },
                })
                    .populate('user')
                    .exec();
                return quizzes;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPostRecommendations(_, { quiz_id }) {
            const quiz = await Quiz.findById(quiz_id);
            let category = quiz.category;
            const quizRecommendations = await Quiz.find({category:category}).populate('user').exec();


        
            for(let i = 0; i < quizRecommendations.length; i++){
                if(quiz_id == quizRecommendations[i]._id){
                    quizRecommendations.splice(i, 1);
                    break;
                }
            }

            let finalQuizRecommendations = [];

            let count = 0;
            let random = 0;

            while(count < 4 && quizRecommendations.length > 0){
                random = getRandomInt(0, quizRecommendations.length); //random integer greater than or equal to 0 and less than quizlength
                finalQuizRecommendations.push(quizRecommendations[random]);
                quizRecommendations.splice(random,1);
                count++;
            }

            return finalQuizRecommendations;

        }
    },
    Mutation: {
        async createQuiz(
            _,
            {
                quizInput: {
                    title,
                    questions,
                    description,
                    category,
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
            if (title.trim() === '') {
                throw new Error('Quiz title cannot be blank');
            }

            questions.forEach((question) => {
                if (question.question.trim() === '') {
                    throw new Error('A question cannot be blank');
                }

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

                let answerMatch = false;
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

            let imageUrl;
            if (icon === 'No Image') {
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
            let numRatings = 0;

            const newQuiz = new Quiz({
                user: context.req.user._id,
                title,
                questions,
                description,
                category,
                icon: imageUrl,
                isTimerForQuiz,
                quizTimer,
                questionTimer,
                quizShuffled,
                quizInstant,
                numQuestions,
                numFavorites,
                numAttempts,
                numRatings,
            });

            const quiz = await newQuiz.save();
            await User.findByIdAndUpdate(context.req.user._id, {
                $push: { quizzesMade: quiz._id },
            });

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
                    category,
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
            let quiz = await Quiz.findById(quizId);
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

            let imageUrl;
            if (icon === 'Same Image') {
                imageUrl =
                    quiz.icon;
            } else {
                await cloudinary.uploader.upload(icon, (error, result) => {
                    if (error) {
                        throw new Error('Could not upload image');
                    }
                    imageUrl = result.secure_url;
                });
            }

            let numQuestions = questions.length;

            const updates = {
                user: context.req.user._id,
                title,
                questions,
                description,
                category,
                icon: imageUrl,
                isTimerForQuiz,
                quizTimer,
                questionTimer,
                quizShuffled,
                quizInstant,
                numQuestions,
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
                await User.findOneAndUpdate(
                    { quizzesMade: quiz._id },
                    {
                        $pull: {
                            quizzesMade: quiz._id,
                            featuredQuizzes: quiz._id,
                        },
                    }
                );
                await User.updateMany(
                    {
                        $or: [
                            { favoritedQuizzes: quiz._id },
                            { quizzesTaken: quiz._id },
                        ],
                    },
                    {
                        $pull: {
                            favoritedQuizzes: quiz._id,
                            quizzesTaken: quiz._id,
                        },
                    }
                );
                await QuizAttempt.deleteMany({ quiz: quiz._id });
                await Platform.updateMany(
                    { quizzes: quiz._id },
                    {
                        $pull: { quizzes: quiz._id },
                    }
                );
                return quiz;
            } catch (err) {
                throw new Error(err);
            }
        },
        async favoriteQuiz(_, { quizId, userId }) {
            console.log(quizId);
            console.log(userId);

            const quiz = await Quiz.findById(quizId);

            const user = await User.findById(userId);
            if (user.favoritedQuizzes.includes(quizId)) {
                console.log('ALREADY GOT');
                return;
            }
            const userFavQuizzes = user.favoritedQuizzes;
            userFavQuizzes.push(quiz);
            user.favoritedQuizzes = userFavQuizzes;
            user.save();

            quiz.numFavorites = quiz.numFavorites + 1;
            quiz.save();

            console.log(user.favoritedQuizzes);

            return true;
        },
        async unfavoriteQuiz(_, { quizId, userId }) {
            const quiz = await Quiz.findById(quizId);

            const user = await User.findById(userId);

            for (let i = 0; i < user.favoritedQuizzes.length; i++) {
                if (user.favoritedQuizzes[i] == quizId) {
                    console.log('here');
                    user.favoritedQuizzes.splice(i, 1);
                    break;
                }
            }

            user.save();
            quiz.numFavorites = quiz.numFavorites - 1;
            quiz.save();

            return true;
        },
        async rateQuiz(_, { quizId, rating }) {
            const quiz = await Quiz.findById(quizId);

            let oldRating = quiz.rating;
            let numRatings = quiz.numRatings;
            let tempRating;
            if (oldRating === null) {
                tempRating = rating;
            } else {
                tempRating =
                    oldRating + (rating - oldRating) / (numRatings + 1);
            }
            quiz.rating = roundToTwoPlace(tempRating);
            quiz.numRatings = numRatings + 1;

            quiz.save();

            return quiz;
        },
    },
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
