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

const Playlist = model('Playlist', playlistSchema)
module.exports = Playlist;
