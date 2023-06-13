const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let accounts = [
  { id: 1, username: 'admin', password: 'admin123', role: 'Admin' },
  { id: 2, username: 'user1', password: 'pass1', role: 'User' },
  { id: 3, username: 'user2', password: 'pass2', role: 'User' }
];

let tokens = [];

app.get('/accounts', (req, res) => {
  res.json(accounts);
});

app.post('/accounts', (req, res) => {
  const { username, password, role } = req.body;
  const id = accounts.length + 1;
  const newAccount = { id, username, password, role };
  accounts.push(newAccount);
  res.status(201).json(newAccount);
});

app.put('/accounts/:id', (req, res) => {
  const accountId = parseInt(req.params.id);
  const { username, password, role } = req.body;
  const account = accounts.find(acc => acc.id === accountId);
  if (!account) {
    return res.status(404).json({ error: 'Обліковий запис не знайдено' });
  }
  account.username = username;
  account.password = password;
  account.role = role;
  res.json(account);
});

app.delete('/accounts/:id', (req, res) => {
  const accountId = parseInt(req.params.id);
  const { username, password, role } = req.query;

  const adminAccount = accounts.find(acc => acc.role === 'Admin' && acc.username === username && acc.password === password);
  if (!adminAccount) {
    return res.status(401).json({ error: 'Недостатньо прав для видалення облікового запису' });
  }

  const index = accounts.findIndex(acc => acc.id === accountId);
  if (index === -1) {
    return res.status(404).json({ error: 'Обліковий запис не знайдено' });
  }
  accounts.splice(index, 1);
  res.sendStatus(204);
});

app.get('/accounts/:id/tokens', (req, res) => {
  const accountId = parseInt(req.params.id);
  const accountTokens = tokens.filter(token => token.accountId === accountId);
  res.json(accountTokens);
});

app.get('/tokens', (req, res) => {
  res.json(tokens);
});

app.post('/tokens', (req, res) => {
  const { accountId } = req.body;
  const account = accounts.find(acc => acc.id === accountId);
  if (!account) {
    return res.status(404).json({ error: 'Обліковий запис не знайдено' });
  }
  const token = { accountId, token: `${account.username}-token` };
  tokens.push(token);
  res.status(201).json(token);
});

app.put('/tokens/:id', (req, res) => {
  const tokenId = parseInt(req.params.id);
  const { accountId } = req.body;
  const token = tokens.find(t => t.accountId === accountId && t.id === tokenId);
  if (!token) {
    return res.status(404).json({ error: 'Токен не знайдено' });
  }
  token.token = `${accounts.find(acc => acc.id === accountId).username}-token`;
  res.json(token);
});

app.delete('/tokens/:id', (req, res) => {
  const tokenId = parseInt(req.params.id);
  const { accountId } = req.query;
  const index = tokens.findIndex(token => token.accountId === parseInt(accountId) && token.id === tokenId);
  if (index === -1) {
    return res.status(404).json({ error: 'Токен не знайдено' });
  }
  tokens.splice(index, 1);
  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log('Сервер запущено на порту 3000');
});
