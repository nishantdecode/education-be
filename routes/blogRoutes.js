const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

router.post('/blogs', blogController.createAdd);
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/currentmonth', blogController.getAllBlogsCurrentMonth);
router.get('/blogs/clicks', blogController.getAllBlogsByClicks);
router.get('/blogs/:id', blogController.getBlogById);
router.put('/blogs/:id', blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

// Like or dislike a blog based on user interaction
router.post('/blogs/:id/like', blogController.likeBlog);
router.post('/blogs/:id/dislike', blogController.dislikeBlog);

// Track clicks on a blog
router.post('/blogs/:id/click', blogController.trackClick);

// Get last interaction of a user with a particular blog
router.post('/blogs/:id/last-interaction', blogController.getLastInteraction);

// Get likes and dislikes count for a blog
router.get('/blogs/:id/likes-dislikes', blogController.getLikesDislikesCount);

// Get blogs by userId
router.get('/blogs/user/:userId', blogController.getBlogsByUserId);

module.exports = router;
