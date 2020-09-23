var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var VCAP_LOCAL = require('./vcap');
var vcapEnv = appEnv.isLocal ? VCAP_LOCAL : JSON.parse(process.env.VCAP_SERVICES);

exports.URL_MONGODB = vcapEnv['compose-for-mongodb'][0].credentials.uri;