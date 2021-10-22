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
            type: Schema.Types.ObjectId,
            ref: 'Item',
        },
        followers: {
            type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        },
        tags: {
            type: [String],
        },
        playlists: {
            type: [playlistSchema],
        },
    },
    { timestamps: true }
);

const Platform = model('Platform', platformSchema);
module.exports = Platform;
