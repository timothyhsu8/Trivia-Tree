const { model, Schema, ObjectId } = require('mongoose');
const Item = require('./Item').schema;
const Platform = require('./Platform').schema;
const Quiz = require('./Quiz').schema;


//current have not added badges or notifications, we should talk about how we will handle these 
const userSchema = new Schema(
    {
        _id: {
            type: ObjectId,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            required: true
        },
        iconImage: {
            type: String
        },
        iconEffect: {
            type: Item
        },
        bannerImage: {
            type: String
        },
        bannerEffect: {
            type: Item
        },
        background: {
            type: Item
        },
        bio: {
            type: String
        },
        currency: { //eventually be required 
            type: Number
        },
        ownedIconEffects: {
            type: [Item]
        },
        ownedBannerEffects: {
            type: [Item]
        },
        ownedBackgrounds: {
            type: [Item]
        },
        quizzesMade: {
            type: [Quiz]
        },
        quizzesTaken: {
            type: [Quiz]
        },
        platformsMade: {
            type: [Platform]
        },
        following: {
            type: [Platform]
        },
        featuredQuizzes: {
            type: [Quiz]
        },
        featuredPlatforms: {
            type: [Platform]
        },
        verified: {
            type: Boolean,
            default: false
        },
        admin: {
            type: Boolean, 
            default: false
        },
        darkMode: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
);



const User = model('User', userSchema);
module.exports = User;

