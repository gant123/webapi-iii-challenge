const express = require('express');
const Posts = require('./postDb');
const User = require('../users/userDb');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.get(req.query);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the posts'
    });
  }
});

router.get('/:id', validatePostId, async (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const count = await Posts.remove(req.params.id);
    if (count > 0) {
      res.status(200).json({ message: 'Post has been deleted!' });
    } else {
      res.status(404).json({ message: 'Aww man we could not find the id' });
    }
  } catch {}
});

router.put('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Posts.update(req.params.id, req.body);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Sorry the post cannot be found!' });
    }
  } catch (err) {
    res.status(500).json(error);
  }
});

// custom middleware
async function validatePostId(req, res, next) {
  try {
    const { id } = req.params;

    const post = await Posts.getById(id);

    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({ message: 'ID is not found bud!' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = router;
