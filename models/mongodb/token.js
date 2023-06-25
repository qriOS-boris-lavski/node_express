const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;