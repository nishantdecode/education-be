const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/blogs/:id/comments', commentController.create);
router.post('/comments/:id/like', commentController.likeComment);
router.post('/comments/:id/last-interaction', commentController.getLastInteraction);
router.post('/comments/:id/dislike', commentController.dislikeComment);
router.post('/comments/:id/report', commentController.reportComment);
router.post('/blogs/:id/comments/all', commentController.getCommentsForBlog);

module.exports = router;
