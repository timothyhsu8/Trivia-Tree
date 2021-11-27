const { model, Schema } = require('mongoose');

const itemSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        template: {
            type: String,
        },
        item: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
        },
        weeklySpecial: {
            type: Boolean,
        },
    },
    { timestamps: true }
);

const Item = model('Item', itemSchema);
module.exports = Item;
