const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

const replySchema = new Schema({
    user: {
        //every comment is tied to a user
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reply: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const commentSchema = new Schema({
    user: {
        //every comment is tied to a user
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    replies: {
        type: [replySchema]
    }
}, { timestamps: true });

const postSchema = new Schema({
    user: {
        //every comment is tied to a user
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    replies: {
        type: [replySchema]
    },
    postText: {
        type: String,
        required: true
    },
    postImage: {
        type: String
    }
}, { timestamps: true });

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
        posts: {
            type: [postSchema],
            default: []
        },
        numFollowers: {
            type: Number
        },
        isPlatformOfTheDay: {
            type: Boolean
        }
    },
    { timestamps: true }
);

platformSchema.plugin(mongoosePaginate);
const Platform = model('Platform', platformSchema);
// const Playlist = model('Playlist', playlistSchema)
module.exports = Platform;
