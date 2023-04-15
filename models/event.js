const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    alt: {
        type: String,
    },
    headline: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    summary: {
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

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;