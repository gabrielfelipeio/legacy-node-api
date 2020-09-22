var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var VCAP_LOCAL = require('./vcap');
var vcapEnv = appEnv.isLocal ? VCAP_LOCAL : JSON.parse(process.env.VCAP_SERVICES);

exports.URL_MONGODB = vcapEnv['compose-for-mongodb'][0].credentials.uri;

exports.URL_API_SERVICES = appEnv.isLocal ? VCAP_LOCAL.URL_API_SERVICES : process.env.URL_API_SERVICES;
exports.URL_BILLINGS = appEnv.isLocal ? VCAP_LOCAL.URL_BILLINGS : process.env.URL_BILLINGS;
exports.TIME_EXPORT_BILLINGS = appEnv.isLocal ? VCAP_LOCAL.TIME_EXPORT_BILLINGS : process.env.TIME_EXPORT_BILLINGS;
exports.TIME_RETURN_BILLINGS = appEnv.isLocal ? VCAP_LOCAL.TIME_RETURN_BILLINGS : process.env.TIME_RETURN_BILLINGS;