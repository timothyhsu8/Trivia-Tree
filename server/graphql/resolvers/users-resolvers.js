const User = require('../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const cloudinary = require('cloudinary').v2;

module.exports = {
    Query: {
        async getUsers() {
            try {
                const users = await User.find();
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
                    populate: { path: 'user', model: 'User' },
                })
                .populate({
                    path: 'featuredPlatforms',
                    populate: { path: 'user', model: 'User' },
                })
                .exec();
            return user;
        },
    },
    Mutation: {
        async updateUser(
            _,
            { userInput: { userId, iconImage, bannerImage, bio } },
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
                user = await User.findByIdAndUpdate(
                    userId,
                    {
                        iconImage: profileURL,
                        bannerImage: bannerURL,
                        bio,
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
        async updateSettings(_, { settingInput: { userId, displayName, iconImage, darkMode } }, context){
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
        }
    },
};
