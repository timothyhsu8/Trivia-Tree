const { model, Schema, ObjectId } = require('mongoose');
const Item = require('./item').schema;
const User = require('./user').schema;
const Quiz = require('./quiz').schema;

const playlistSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        quizzes: {
            type: [Quiz],
            required: true
        }
    }
)

const platformSchema = new Schema(
    {
        _id: {
            type: ObjectId,
            required: true
        },
        user_id: {
            type: ObjectId, 
            required: true
        },
        name: {
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
        followers: {
            type: [User]
        },
        tags: {
            type: [String]
        },
        playlists: {
            type: [playlistSchema]
        }
    },
    { timestamps: true }
);



const User = model('Platform', platformSchema);
module.exports = Platform;
