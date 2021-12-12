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
    comments: {
        type: [commentSchema]
    },
    postText: {
        type: String,
        required: true
    },
    postImage: {
        type: String
    }
}, { timestamps: true });

const Post = model('Post', postSchema)
module.exports = Post;