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

const Comment = model('Comment', commentSchema)
module.exports = Comment;