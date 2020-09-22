const mongoose = require('mongoose');

const DBClientsSchema = mongoose.Schema({
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
    }
});

const DBClientsModel = mongoose.databases.Pj002.model(
    "db_clients",
    DBClientsSchema
);

module.exports = DBClientsModel;