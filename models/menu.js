const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
    },
    type: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    glutenFree: {
        type: String,
        required: true
    },
    dairyFree: {
        type: String,
        required: true
    },
    soyFree: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;