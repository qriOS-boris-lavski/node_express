const Account = require('../models/mongodb/account');
const Token = require('../models/mongodb/token');

exports.getAccountTokens = async (req, res) => {
  try {
    const accountId = req.params.id;
    const accountTokens = await Token.find({ accountId });
    res.json(accountTokens);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find();
    res.json(tokens);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createToken = async (req, res) => {
  try {
    const { accountId } = req.body;
    const account = await Account.findById(accountId);
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
    const tokenId = req.params.id;
    const { accountId } = req.body;
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    const token = await Token.findByIdAndUpdate(tokenId, { token: `${account.username}-token` }, { new: true });
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }
    res.json(token);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteToken = async (req, res) => {
  try {
    const tokenId = req.params.id;
    const deletedToken = await Token.findByIdAndDelete(tokenId);
    if (!deletedToken) {
      return res.status(404).json({ error: 'Token not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
