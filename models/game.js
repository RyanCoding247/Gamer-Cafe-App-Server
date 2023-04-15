const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    page: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: String
    }
},
{
    timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;