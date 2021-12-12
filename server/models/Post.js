const { model, Schema } = require('mongoose');

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
    },
    numLikes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: [Schema.Types.ObjectId],
        ref: 'User'
    }
}, { timestamps: true });

const Post = model('Post', postSchema)
module.exports = Post;