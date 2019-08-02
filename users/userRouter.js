const express = require('express');
const Posts = require('../posts/postDb');
const db = require('./userDb');

const router = express.Router();

// router.post('/', async (req, res) => {
//   try {
//     const user = await Users.add(req.body);
//     res.status(200).json(user);
//   } catch (error) {
//     res.status();
//   }
// });

// router.post('/:id/posts', (req, res) => {});

// router.get('/', (req, res) => {});

// router.get('/:id', (req, res) => {});

// router.get('/:id/posts', (req, res) => {});

// router.delete('/:id', (req, res) => {});

// router.put('/:id', (req, res) => {});

//custom middleware

router.get('/', validateUser, async (req, res) => {
  try {
    const users = await db.get();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (req.body.name) {
      const newPost = await db.insert(req.body);
      res.status(201).json(newPost);
    } else {
      res.status(400).json({ message: 'Please provide a name.' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error posting to database' });
  }
});

router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const { id } = req.params;
    const remove = await db.remove(id);
    remove
      ? res.status(200).end()
      : res.status(404).json({ message: 'No user by that id' });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: 'Everything exploded, sorry.  Try again.' });
  }
});

router.put('/:id', validatePostId, validateUser, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.name) {
      const updateUser = await db.update(id, req.body);
      updateUser
        ? res.status(200).end()
        : res.status(404).json({ message: 'No user by that ID found' });
    } else {
      res.status(400).json({ message: 'I need the new name you use to use' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'There was an error updating the user' });
  }
});

router.get('/:id/posts', validatePost, async (req, res) => {
  try {
    const { id } = req.params;
    const userPosts = await db.getUserPosts(id);
    res.status(200).json({ userPosts });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong getting the user's posts" });
  }
});

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

function requireBody(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    next();
  } else {
    next({ message: 'You need to supply a body with this request' });
  }
}

function validateUser(req, res, next) {
  const user = req.body;

  if (!user.name) {
    res.status(400).json({
      success: false,
      message: 'Please provide a name for the user.'
    });
  } else {
    req.user = user;
    next();
  }
}

function validatePost(req, res, next) {
  const post = req.body;
  if (!post.text) {
    res.status(400).json({
      success: false,
      message: 'Please provide text for the post.'
    });
  } else {
    req.post = post;
    next();
  }
}
module.exports = router;
