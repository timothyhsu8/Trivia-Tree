const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const questionSchema = new Schema({
    //seperated from quiz schema just to add readability
    question: {
        type: String,
        required: true,
    },
    answerChoices: {
        type: [String],
        required: true,
    },
    answer: {
        type: [String], //answer is an array because questiontypes 2 and 3 will have more than one answer
        required: true,
    },
    questionType: {
        type: Number, //There will be three options {1 = Multiple Choice 2 = Select All That Apply 3 = Fill in Blank}
        default: 1,
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

const quizSchema = new Schema(
    {
        user: {
            //eventually userId will be required!
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        platform: {
            //not sure if this will also be required maybe some quizzes dont have a platform?
            type: Schema.Types.ObjectId,
            ref: 'Platform',
        },
        title: {
            type: String,
            required: true,
        },
        questions: {
            type: [questionSchema],
            required: true,
        },
        numQuestions: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            default: "Other"
        },
        tags: {
            type: [String],
        },
        isTimerForQuiz: {
            type: Boolean,
        },
        quizTimer: {
            //still unsure about this and questiontimer, should one not be set if the other is set?
            type: String,
        },
        questionTimer: {
            type: String,
        },
        quizShuffled: {
            type: Boolean,
        },
        quizInstant: {
            type: Boolean,
        },
        rating: {
            type: Number,
            default: null
        },
        ratings: {
            type: [ratingSchema],
            default: []
        },
        averageScore: {
            type: Number,
            default: null
        },
        medianScore: {
            type: Number,
            default: null
        },
        comments: {
            type: [commentSchema],
            default: []
       },
        icon: {
            //quiz image still not sure what type this should be
            type: String,
        },
        numFavorites: {
            type: Number,
            default: 0
        },
        numAttempts: {
            type: Number,
            default: 0
        },
        numRatings: {
            type: Number,
            default: 0
        },
        isFeatured: {
            type: Boolean
        }
    },
    { timestamps: true }
);

quizSchema.plugin(mongoosePaginate);
const Quiz = model('Quiz', quizSchema);
module.exports = Quiz;
