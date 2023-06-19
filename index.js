const express = require('express');
const bodyParser = require('body-parser');
const Account = require('./models/account');
const Token = require('./models/token');
const accountController = require('./controllers/accountController');
const tokenController = require('./controllers/tokenController');

const app = express();
app.use(bodyParser.json());

// Define routes
app.get('/accounts', accountController.getAccounts);
app.post('/accounts', accountController.createAccount);
app.put('/accounts/:id', accountController.updateAccount);
app.delete('/accounts/:id', accountController.deleteAccount);

app.get('/accounts/:id/tokens', tokenController.getAccountTokens);
app.get('/tokens', tokenController.getAllTokens);
app.post('/tokens', tokenController.createToken);
app.put('/tokens/:id', tokenController.updateToken);
app.delete('/tokens/:id', tokenController.deleteToken);

// Establish database connection and sync models
(async () => {
  try {
    await Account.sync();
    await Token.sync();
    console.log('Database connection established');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
