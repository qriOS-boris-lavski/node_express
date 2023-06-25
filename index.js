const express = require('express');
const bodyParser = require('body-parser');
const Account = require('./models/account');
const Token = require('./models/token');
const accountController = require('./controllers/accountController');
const tokenController = require('./controllers/tokenController');
const mongodbAccountController = require('./controllers/mongodbAccountController');
const mongodbTokenController = require('./controllers/mongodbTokenController');
const sequelize = require('./database/connection');

const app = express();
app.use(bodyParser.json());

app.get('/accounts', accountController.getAccounts);
app.post('/accounts', accountController.createAccount);
app.put('/accounts/:id', accountController.updateAccount);
app.delete('/accounts/:id', accountController.deleteAccount);

app.get('/accounts/:id/tokens', tokenController.getAccountTokens);
app.get('/tokens', tokenController.getAllTokens);
app.post('/tokens', tokenController.createToken);
app.put('/tokens/:id', tokenController.updateToken);
app.delete('/tokens/:id', tokenController.deleteToken);

app.get('/mongodb-accounts', mongodbAccountController.getAccounts);
app.post('/mongodb-accounts', mongodbAccountController.createAccount);
app.put('/mongodb-accounts/:id', mongodbAccountController.updateAccount);
app.delete('/mongodb-accounts/:id', mongodbAccountController.deleteAccount);

app.get('/mongodb-accounts/:id/tokens', mongodbTokenController.getAccountTokens);
app.get('/mongodb-tokens', mongodbTokenController.getAllTokens);
app.post('/mongodb-tokens', mongodbTokenController.createToken);
app.put('/mongodb-tokens/:id', mongodbTokenController.updateToken);
app.delete('/mongodb-tokens/:id', mongodbTokenController.deleteToken);


sequelize
  .sync()
  .then(() => {
    console.log('Connected to SQL database');
  })
  .catch((error) => {
    console.error('Unable to connect to the SQL database:', error);
  });

require('./database/connection');

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

