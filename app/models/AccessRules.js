const mongoose = require('mongoose');

module.exports = function() {
    const AccessRules = mongoose.Schema({
        service: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        rules: Array,
        dateRecordFormated: String,
        dateRecord: {
            type: Date,
            default: new Date()
        }
    });

    return mongoose.model('AccessRules', AccessRules, 'db_access_rules');
}