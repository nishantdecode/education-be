const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

router.post('/blogs', upload, blogController.createAdd);
router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/currentmonth', blogController.getAllBlogsCurrentMonth);
router.get('/blogs/clicks', blogController.getPopularBloggers);
router.get('/blogs/:id', blogController.getBlogById);
router.put('/blogs/:id', blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

router.post('/blogs/:id/like', blogController.likeBlog);
router.post('/blogs/:id/dislike', blogController.dislikeBlog);
router.post('/blogs/:id/click', blogController.trackClick);
router.post('/blogs/interaction/:id', blogController.getInteraction);
router.get('/blogs/:id/likes-dislikes', blogController.getLikesDislikesCount);
router.get('/blogs/user/:userId', blogController.getBlogsByUserId);

module.exports = router;
