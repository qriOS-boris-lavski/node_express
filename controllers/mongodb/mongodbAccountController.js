const Account = require('../models/mongodb/account');
const Token = require('../models/mongodb/token');

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newAccount = await Account.create({ username, password, role });
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const { username, password, role } = req.body;
    const account = await Account.findByIdAndUpdate(accountId, { username, password, role }, { new: true });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const deletedAccount = await Account.findByIdAndDelete(accountId);
    if (!deletedAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }
    await Token.deleteMany({ accountId: deletedAccount._id });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
