const User = require('../../models/User');
const Platform = require('../../models/Platform');
const Quiz = require('../../models/Quiz');
const Item = require('../../models/Item');
const ObjectId = require('mongoose').Types.ObjectId;
const cloudinary = require('cloudinary').v2;
const QuizAttempt = require('../../models/QuizAttempt');

module.exports = {
    Query: {
        async getUsers() {
            try {
                const users = await User.find()
                    .populate({
                        path: 'quizzesMade',
                        populate: { path: 'user', model: 'User' },
                    })
                    .populate({
                        path: 'featuredQuizzes',
                        populate: { path: 'user', model: 'User' },
                    })
                    .populate({
                        path: 'platformsMade',
                        populate: [
                            { path: 'user', model: 'User' },
                            { path: 'followers', model: 'User' },
                        ],
                    })
                    .populate({
                        path: 'featuredPlatforms',
                        populate: [
                            { path: 'user', model: 'User' },
                            { path: 'followers', model: 'User' },
                        ],
                    })
                    .populate({
                        path: 'favoritedQuizzes',
                        populate: { path: 'user', model: 'User' },
                    })
                    .populate({
                        path: 'following',
                        populate: [
                            { path: 'user', model: 'User' },
                            { path: 'followers', model: 'User' },
                        ],
                    })
                    .exec();
                return users;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getUser(_, { _id }) {
            const user = await User.findById(_id)
                .populate({
                    path: 'quizzesMade',
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'featuredQuizzes',
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'platformsMade',
                    populate: [
                        { path: 'user', model: 'User' },
                        { path: 'followers', model: 'User' },
                    ],
                })
                .populate({
                    path: 'featuredPlatforms',
                    populate: [
                        { path: 'user', model: 'User' },
                        { path: 'followers', model: 'User' },
                    ],
                })
                .populate({
                    path: 'favoritedQuizzes',
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'following',
                    populate: [
                        { path: 'user', model: 'User' },
                        { path: 'followers', model: 'User' },
                    ],
                })
                .populate({
                    path: 'bannerEffect',
                })
                .populate({
                    path: 'ownedBannerEffects',
                })
                .populate({
                    path: 'iconEffect',
                })
                .populate({
                    path: 'ownedIconEffects',
                })
                .exec();
            return user;
        },
        async searchUsers(_, { searchText }) {
            console.log(searchText);
            try {
                const users = await User.find({
                    displayName: { $regex: searchText, $options: 'i' },
                });
                return users;
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async updateUser(
            _,
            {
                userInput: {
                    userId,
                    iconImage,
                    bannerImage,
                    bio,
                    bannerEffectId,
                    iconEffectId,
                },
            },
            context
        ) {
            try {
                let user = await User.findById(userId);
                if (!user._id.equals(context.req.user._id)) {
                    throw new Error('You cannot edit someone elses account');
                }
                let profileImageType = context.req.headers.profileimagetype;
                let profileURL = iconImage;
                if (profileImageType === 'New Image') {
                    await cloudinary.uploader.upload(
                        iconImage,
                        (error, result) => {
                            if (error) {
                                throw new Error('Could not upload image');
                            }
                            profileURL = result.secure_url;
                        }
                    );
                }
                let bannerImageType = context.req.headers.bannerimagetype;
                let bannerURL = bannerImage;
                if (bannerImageType === 'New Image') {
                    await cloudinary.uploader.upload(
                        bannerImage,
                        (error, result) => {
                            if (error) {
                                throw new Error('Could not upload image');
                            }
                            bannerURL = result.secure_url;
                        }
                    );
                }

                let bannerEffect = await Item.findById(bannerEffectId);
                if (bannerEffect === undefined) bannerEffect = null;

                let iconEffect = await Item.findById(iconEffectId);
                if (iconEffect === undefined) iconEffect = null;

                user = await User.findByIdAndUpdate(
                    userId,
                    {
                        iconImage: profileURL,
                        bannerImage: bannerURL,
                        bio,
                        bannerEffect: bannerEffect,
                        iconEffect: iconEffect,
                    },
                    { new: true }
                )
                    .populate({
                        path: 'quizzesMade',
                        populate: { path: 'user', model: 'User' },
                    })
                    .populate({
                        path: 'featuredQuizzes',
                        populate: { path: 'user', model: 'User' },
                    })
                    .populate({
                        path: 'platformsMade',
                        populate: { path: 'user', model: 'User' },
                    })
                    .populate({
                        path: 'featuredPlatforms',
                        populate: { path: 'user', model: 'User' },
                    })
                    .exec();
                return user;
            } catch (err) {
                throw new Error(err);
            }
        },
        async updateSettings(
            _,
            { settingInput: { userId, displayName, iconImage, darkMode } },
            context
        ) {
            let user = await User.findById(userId);
            if (!user._id.equals(context.req.user._id)) {
                throw new Error('You cannot edit someone elses account');
            }
            let profileImageType = context.req.headers.profileimagetype;
            let profileURL = iconImage;
            if (profileImageType === 'New Image') {
                await cloudinary.uploader.upload(iconImage, (error, result) => {
                    if (error) {
                        throw new Error('Could not upload image');
                    }
                    profileURL = result.secure_url;
                });
            }
            user = await User.findByIdAndUpdate(
                userId,
                {
                    displayName,
                    iconImage: profileURL,
                    darkMode,
                },
                { new: true }
            )
                .populate({
                    path: 'quizzesMade',
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'featuredQuizzes',
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'platformsMade',
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'featuredPlatforms',
                    populate: { path: 'user', model: 'User' },
                })
                .exec();
            return user;
        },
        async finishSignUp(
            _,
            { signUpInput: { userId, displayName, iconImage, categoriesSelected } },
            context
        ) {
            let user = await User.findById(userId);

            let newRecommendationArray = user.recommendationArray;

            for(let i = 0; i < categoriesSelected.length; i++){
                let j = 0;
                while(j < 5){
                    newRecommendationArray.push(categoriesSelected[i]);
                    j++;
                }
            }

            user.recommendationArray = newRecommendationArray;

            user.save();

            let profileImageType = context.req.headers.profileimagetype;
            let profileURL = iconImage;
            if (profileImageType === 'New Image') {
                await cloudinary.uploader.upload(iconImage, (error, result) => {
                    if (error) {
                        throw new Error('Could not upload image');
                    }
                    profileURL = result.secure_url;
                });
            }
            user = await User.findByIdAndUpdate(
                userId,
                {
                    displayName,
                    iconImage: profileURL
                },
                { new: true }
            )
                .populate({
                    path: 'quizzesMade',
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'featuredQuizzes',
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'platformsMade',
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'featuredPlatforms',
                    populate: { path: 'user', model: 'User' },
                })
                .exec();
            return user;
        },
        async addFeaturedQuiz(_, { userId, newFeaturedQuizId }, context) {
            const quiz = await Quiz.findById(newFeaturedQuizId);
            const user = await User.findById(userId);
            user.featuredQuizzes.push(quiz);
            user.save();
        },

        async deleteFeaturedQuiz(_, { userId, deleteFeaturedQuizId }, context) {
            const quiz = await Quiz.findById(deleteFeaturedQuizId);
            const user = await User.findById(userId).populate({
                path: 'featuredQuizzes',
                populate: { path: 'user', model: 'User' },
            });

            for (let i = 0; i < user.featuredQuizzes.length; i++) {
                if (user.featuredQuizzes[i].id == quiz._id) {
                    user.featuredQuizzes.splice(i, 1);
                    break;
                }
            }

            user.save();
        },
        async addFeaturedPlatform(
            _,
            { userId, newFeaturedPlatformId },
            context
        ) {
            const platform = await Platform.findById(newFeaturedPlatformId);
            const user = await User.findById(userId);
            user.featuredPlatforms.push(platform);
            user.save();
        },
        async deleteFeaturedPlatform(
            _,
            { userId, deleteFeaturedPlatformId },
            context
        ) {
            console.log(userId);
            const platform = await Platform.findById(deleteFeaturedPlatformId);
            const user = await User.findById(userId).populate({
                path: 'featuredPlatforms',
                populate: { path: 'user', model: 'User' },
            });

            for (let i = 0; i < user.featuredPlatforms.length; i++) {
                if (user.featuredPlatforms[i].id == platform._id) {
                    user.featuredPlatforms.splice(i, 1);
                    break;
                }
            }

            user.save();
        },
        async resetPlatformsMadeApollo(_, { userId }, context) {
            const user = await User.findById(userId);
            user.platformsMade = [];
            user.save();
        },
        async deleteUser(_, { userId }, context) {
            try {
                const user = await User.findById(userId);
                if (!user._id.equals(context.req.user._id)) {
                    throw new Error('You cannot delete someone elses account');
                }
                await user.delete();
                await Quiz.find({ user: user._id }).then(function (quizess) {
                    quizess.forEach(async (quizData) => {
                        // console.log(quizData._id);
                        await QuizAttempt.deleteMany({ quiz: quizData._id });
                        await User.updateMany(
                            {
                                $or: [
                                    { favoritedQuizzes: quizData._id },
                                    { quizzesTaken: quizData._id },
                                ],
                            },
                            {
                                $pull: {
                                    favoritedQuizzes: quizData._id,
                                    quizzesTaken: quizData._id,
                                },
                            }
                        );
                    });
                });
                await QuizAttempt.deleteMany({ user: user._id });
                await Quiz.deleteMany({ user: user._id });
                await Platform.find({ user: user._id }).then(function (
                    platforms
                ) {
                    platforms.forEach(async (platformData) => {
                        console.log(platformData._id);
                        await User.updateMany(
                            {
                                following: platformData._id,
                            },
                            {
                                $pull: {
                                    following: platformData._id,
                                },
                            }
                        );
                    });
                });
                await Platform.deleteMany({ user: user._id });
                await Quiz.updateMany(
                    {
                        comments: { $elemMatch: { user: user._id } },
                    },
                    {
                        $pull: {
                            comments: { user: user._id },
                        },
                    }
                );
                await Quiz.updateMany(
                    {
                        comments: {
                            $elemMatch: {
                                replies: { $elemMatch: { user: user._id } },
                            },
                        },
                    },
                    {
                        $pull: {
                            'comments.$.replies': { user: user._id },
                        },
                    }
                );
                await Quiz.find({ ratings: { $elemMatch: { user: user._id } } }).then(function (quizess) {
                    quizess.forEach(async (quiz) => {
                        console.log(quiz);
                        let total = 0;
                        let spliceIndex;
                        for (let i = 0; i < quiz.ratings.length; i++) {
                            if (quiz.ratings[i].user.equals(user._id)) {
                                spliceIndex = i;
                            } else {
                                total += quiz.ratings[i].rating;
                            }
                        }
                        quiz.ratings.splice(spliceIndex, 1);
                        quiz.numRatings = quiz.ratings.length;
                        if (quiz.ratings.length === 0) {
                            quiz.rating = null;
                        } else {
                            quiz.rating = total / quiz.ratings.length;
                        }
                        quiz.save();
                    });
                });
                // console.log(user);
            } catch (err) {
                throw new Error(err);
            }
        },
        async updateDarkMode(
            _,
            { userId,  darkMode},
            context
        ) {
            let user = await User.findById(userId);

            user = await User.findByIdAndUpdate(userId, { darkMode: darkMode });

            console.log(darkMode)
            
            return user;
        }
    },
};
