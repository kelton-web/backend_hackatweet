var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')

require('../models/connection');
const Tweet = require('../models/tweet');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/tweet', (req, res) => {
  if (!checkBody(req.body, ['content', 'user'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  // Check if the user has not already been registered
  Tweet.findOne({ content: req.body.content }).then(data => {
    if (data === null) {
      const newUser = new Tweet({
        content: req.body.content,
        date: new Date(),
        user: mongoose.Types.ObjectId(req.body.user.trim()),
        isLiked: [],
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'Content already exists' });
    }
  });
});


router.post('/like:token', (req, res) => {
  Tweet.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, canDeleteTask: data.canDeleteTask });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

router.put('/like', (req, res) => {
  Tweet.findOneAndUpdate({ isLiked: req.body.user }).then(data => {
    if (data) {
      res.json({ result: true, tweetLike: data });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

router.delete('/tweetDelete/', (req, res) => {
    Tweet.findOne({ content: { $regex: new RegExp(req.body.content, "i")} })
    .then(database => {
      if(database){
        Tweet.deleteOne({ content: { $regex: new RegExp(req.params.content, "i")} })
        .then(() => {
            Tweet.find().then(resultData => {
            res.json({ result: true, tweetAll: resultData });
          })
        })
      }else{
        res.json({ result: false, error: 'tweet not found' });
      }
    })
   });

module.exports = router;
