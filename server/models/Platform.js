const { model, Schema, ObjectId } = require('mongoose');
const Item = require('./Item').schema;
const User = require('./User').schema;
const Quiz = require('./Quiz').schema;

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



const Platform = model('Platform', platformSchema);
module.exports = Platform;
