const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

router.get('/', ensureAuthenticated, (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories
      });
    });
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .populate('user')
    .then(story => {
      res.render('stories/show', {
        story
      });
    });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

router.post('/', (req, res) => {
  let allowComments;
  req.body.allowComments ? allowComments = true : allowComments = false;

  const newStory = {
    title: req.body.title,
    status: req.body.status,
    body: req.body.body1,
    allowComments: allowComments,
    user: req.user.id
  }

  // Create Story
  new Story(newStory)
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`)
    });
});

module.exports = router;
