const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    maxSize: {
        type: Number,
        required: true,
    },
},
{
    timestamps: true
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;