const mongoose = require('mongoose');

module.exports = function() {
    const DBAPIs = mongoose.Schema({
        organizationId: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        name: String,
        isActive: {
            type: Boolean,
            default: false
        },
        dateRecordFormated: String,
        dateRecord: {
            type: Date,
            default: new Date()
        },
        integrationCodes: {
            type: Map,
            of: String
        }
    });

    return mongoose.model('DBAPIs', DBAPIs, 'db_apis');
}