const { model, Schema, ObjectId } = require('mongoose');

const itemSchema = new Schema(
    {
        _id: {
            type: ObjectId,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        image: { //another image type is string for now
            type: String
        },
        price: {
            type: Number,
            required: true
        },
        weeklySpecial: {
            boolean: true
        }
    },
    { timestamps: true }
);



const User = model('Item', itemSchema);
module.exports = Item;
