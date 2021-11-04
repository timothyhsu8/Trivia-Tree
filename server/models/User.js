const { model, Schema } = require('mongoose');

//current have not added badges or notifications, we should talk about how we will handle these
const userSchema = new Schema(
    {
        googleId: {
            type: String,
            required: true,
        },
        googleDisplayName: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        iconImage: {
            type: String,
        },
        iconEffect: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
        },
        bannerImage: {
            type: String,
        },
        bannerEffect: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
        },
        background: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
        },
        bio: {
            type: String,
        },
        currency: {
            //eventually be required
            type: Number,
            default: 0
        },
        ownedIconEffects: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
        },
        ownedBannerEffects: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
        },
        ownedBackgrounds: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
        },
        quizzesMade: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
        },
        quizzesTaken: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
        },
        platformsMade: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Platform' }],
        },
        following: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Platform' }],
        },
        featuredQuizzes: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
        },
        featuredPlatforms: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
        },
        verified: {
            type: Boolean,
            default: false,
        },
        admin: {
            type: Boolean,
            default: false,
        },
        darkMode: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const User = model('User', userSchema);
module.exports = User;
