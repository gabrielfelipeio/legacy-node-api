const mongoose = require('mongoose');

module.exports = function() {
    const Users = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        password: {
            type: String,
            required: true
        },
        configurations: Array,
        dateRecordFormated: String,
        dateRecord: {
            type: Date,
            default: new Date()
        }
    });

    return mongoose.model('Users', Users, 'db_users');
}