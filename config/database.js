const mongoose = require('mongoose');

module.exports = function(url) {
    mongoose.connect(url, {
        ssl: true,
        sslValidate: true,
        dbName: 'WEBHOOKS-HM',
        useNewUrlParser: true,
        useCreateIndex: true,
        retryWrites: false 
    });

    mongoose.connection.on('connected', () => console.info('Mongoose connected in ', url));
    mongoose.connection.on('disconected', () => console.info('Mongoose disconected'));
    mongoose.connection.on('error', (err) => console.error('Mongoose error: ', err));

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.info('MongoDB closed');
            process.exit(0);
        });
    });
}