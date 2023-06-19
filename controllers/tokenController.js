const Account = require('../models/account');
const Token = require('../models/token');

exports.getAccountTokens = async (req, res) => {
  try {
    const accountId = parseInt(req.params.id);
    const accountTokens = await Token.findAll({ where: { accountId } });
    res.json(accountTokens);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.findAll();
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createToken = async (req, res) => {
  try {
    const { accountId } = req.body;
    const account = await Account.findByPk(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    const token = await Token.create({ accountId, token: `${account.username}-token` });
    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateToken = async (req, res) => {
  try {
    const tokenId = parseInt(req.params.id);
    const { accountId } = req.body;
    const token = await Token.findOne({ where: { id: tokenId, accountId } });
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }
    const account = await Account.findByPk(accountId);
    token.token = `${account.username}-token`;
    await token.save();
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteToken = async (req, res) => {
  try {
    const tokenId = parseInt(req.params.id);
    const { accountId } = req.query;
    const deletedToken = await Token.destroy({ where: { id: tokenId, accountId: parseInt(accountId) } });
    if (deletedToken === 0) {
      return res.status(404).json({ error: 'Token not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
