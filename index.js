const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');

const databaseURI = process.env.MONGODB_URI;
const hostname = process.env.HOSTNAME;
const port = process.env.PORT;
const masterKey = process.env.MASTER_KEY;
const masterPassword = process.env.MASTER_PASSWORD;
const appId = process.env.APP_ID;
const appName = process.env.APP_NAME;

if (!databaseURI || !hostname || !port || !masterKey || 
	!masterPassword || !appId || !appName) {
  console.log('Please check environment variables!');
  return false;
}

const apiConfigPath = '/api';
const serverURL = hostname + apiConfigPath;

var apiConfig = new ParseServer({
	databaseURI: databaseURI,
	appId: appId,
	masterKey: masterKey,
	serverURL: serverURL
});

var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": serverURL,
      "appId": appId,
      "masterKey": masterKey,
      "appName": appName
    }
  ],
  "users": [
    {
      "user": appId,
      "pass": masterPassword
    }
  ],
  "trustProxy": 1
});

var app = express();

app.use(apiConfigPath, apiConfig);

app.get('/', function(req, res) {
	res.status(200).send('Backend Server for Re:Coded Client Project');
});

app.use('/dashboard', dashboard);

app.enable('trust proxy');

var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
	console.log('Re:Coded Backend Server is running on port ' + port + '.');
});