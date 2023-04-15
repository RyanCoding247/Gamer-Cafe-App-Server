const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    campsiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite',
        required: true
    }
});

const userSchema = new Schema({
    username: {
        type: String,
        default: '',
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    favorites: [favoriteSchema]
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
module.exports = User;
