const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  content: String,
  date: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  isLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
});

const Tweet = mongoose.model('tweet', tweetSchema);

module.exports = Tweet;