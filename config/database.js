const mongoose = require('mongoose');

module.exports = function (url, dbName, connectionName) {
    let newConnection = mongoose.createConnection(url, {
        ssl: true,
        sslValidate: true,
        dbName,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        retryWrites: false
    });

    newConnection.on('connected', () => console.info('Mongoose connected in ', url));
    newConnection.on('disconected', () => console.info('Mongoose disconected'));
    newConnection.on('error', (err) => console.error('Mongoose error: ', err));

    process.on('SIGINT', () => {
        newConnection.close(() => {
            console.info('MongoDB closed');
            process.exit(0);
        });
    });

    if (!mongoose.hasOwnProperty('databases')) mongoose['databases'] = {};
    mongoose.databases[connectionName] = newConnection;
    return mongoose;
};