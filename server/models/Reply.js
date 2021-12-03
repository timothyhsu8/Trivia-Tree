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


const Reply = model('Reply', replySchema)
module.exports = Reply;