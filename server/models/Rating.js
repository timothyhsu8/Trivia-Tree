const { model, Schema } = require('mongoose');

const ratingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true
    },
});

const Rating = model('Rating', ratingSchema)
module.exports = Rating;