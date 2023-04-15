const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
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

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;