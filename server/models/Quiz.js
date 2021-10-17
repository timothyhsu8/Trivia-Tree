const { model, Schema, ObjectId } = require('mongoose');

const questionSchema = new Schema( //seperated from quiz schema just to add readability 
    {
        question: {
            type: String,
            required: true
        },
        answerChoices: {
            type: [String],
            required: true
        },
        answer: {
            type: [String], //answer is an array because questiontypes 2 and 3 will have more than one answer 
            required: true
        },
        questionType: {
            type: Number, //There will be three options {1 = Multiple Choice 2 = Select All That Apply 3 = Fill in Blank}
            default: 1
        }
    }
);

const commentSchema = new Schema(
    {
        user_id: { //every comment is tied to a user
            type: ObjectId,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }
)

const quizSchema = new Schema(
    {
        _id: {
            type: ObjectId,
            required: true
        },
        user_id: { //eventually userId will be required!  
            type: ObjectId
        },
        platform_id: { //not sure if this will also be required maybe some quizzes dont have a platform? 
            type: ObjectId
        },
        title: {
            type: String,
            required: true
        },
        questions: {
            type: [questionSchema],
            required: true
        },
        numQuestions: {
            type: Number,
            required: true
        },
        description: {
            type: String
        },
        categories: {
            type: [String]
        },
        tags: {
            type: [String]
        },
        quizTimer: { //still unsure about this and questiontimer, should one not be set if the other is set? 
            type: Number
        },
        questionTimer: {
            type: Number
        },
        quizShuffled: {
            type: Boolean
        },
        quizInstant: {
            type: Boolean
        },
        rating: {
            type: Number
        },
        averageScore: {
            type: Number
        },
        medianScore: {
            type: Number
        },
        comments: {
            type: [commentSchema]
        },
        icon: { //quiz image still not sure what type this should be
            type: String
        }

    },
    { timestamps: true }
);

const Quiz = model('Quiz', quizSchema);
module.exports = Quiz;

