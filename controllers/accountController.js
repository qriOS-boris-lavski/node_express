const Account = require('../models/account');

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll();
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
    const accountId = parseInt(req.params.id);
    const { username, password, role } = req.body;
    const [rowsUpdated] = await Account.update({ username, password, role }, { where: { id: accountId } });
    if (rowsUpdated === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }
    const updatedAccount = await Account.findByPk(accountId);
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const accountId = parseInt(req.params.id);
    const { username, password, role } = req.query;

    const adminAccount = await Account.findOne({ where: { role: 'Admin', username, password } });
    if (!adminAccount) {
      return res.status(401).json({ error: 'Insufficient privileges to delete the account' });
    }

    const deletedAccount = await Account.destroy({ where: { id: accountId } });
    if (deletedAccount === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
