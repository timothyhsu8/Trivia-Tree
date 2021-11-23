const { model, Schema } = require('mongoose');

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    quizzes: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
        required: true,
    },
});

const platformSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
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
            // type: Schema.Types.ObjectId,
            type: String,
            ref: 'Item',
        },
        followers: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        },
        tags: {
            type: [String],
        },
        quizzes: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
        },
        playlists: {
            type: [playlistSchema],
        },
        description: {
            type: String,
        },
        numFollowers: {
            type: Number
        }
    },
    { timestamps: true }
);

const Platform = model('Platform', platformSchema);
// const Playlist = model('Playlist', playlistSchema)
module.exports = Platform;
