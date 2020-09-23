const app = require('./config/express')();
const bmConfig = require('./config/bmConfig');
require('./config/database')(bmConfig.URL_MONGODB);

require('./helper/AutoRun');

app.listen(app.get('port'), () => console.info('Express Server on port', app.get('url')));