const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

router.get('/', ensureAuthenticated, (req, res) => {
  Story.find({ status: 'public' })
    .populate('user')
    .sort({date: 'desc'})
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
    .populate('comments.commentUser')
    .then(story => {
      res.render('stories/show', {
        story
      });
    });
});

// List stories from a single user
router.get('/user/:userId', (req, res) => {
  Story.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories
      });
    });
});

// Logged in user stories
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({user: req.user.id})
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories
      });
    });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      story.user != req.user.id ? res.redirect('/') : res.render('stories/edit', {
        story
      });
    });
});

// Process Add Story
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

// Edit Form Process
router.put('/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .then(story => {
      let allowComments;
      req.body.allowComments ? allowComments = true : allowComments = false;

      // New values
      story.title = req.body.title;
      story.status = req.body.status;
      story.body = req.body.body1;
      story.allowComments = allowComments;

      story.save()
        .then(story => {
          res.redirect('/dashboard');
        });
    });
});

// Delete Story
router.delete('/:id', (req, res) => {
  Story.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect('/dashboard');
    });
});

// Add Comment
router.post('/comment/:id', (req, res) => {
  Story.findOne({ _id: req.params.id })
    .then(story => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
      }

      // Add to comment array
      story.comments.unshift(newComment);

      story.save()
        .then(story => {
          res.redirect(`/stories/show/${story.id}`);
        });
    });
});

module.exports = router;
