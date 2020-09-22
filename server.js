require('./config/databasesConnections')();
const app = require('./config/express')();
require('./helper/AutoRun');
app.listen(app.get('port'), () => console.info('Express Server on port', app.get('url')));