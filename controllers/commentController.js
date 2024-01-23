const { Comment, createComment } = require('../models/comment');
const { CommentInteraction } = require('../models/commentInteraction');
const { CommentReport } = require('../models/commentReport');
const { User } = require('../models/user');
const { Blog } = require('../models/blog');

const create = async (req, res) => {
    const { text, userId } = req.body;
    const blogId = req.params.id;

    try {
        const comment = await createComment({
            text,
            userId: userId,
            BlogId: blogId,
        });

        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating comment', error: error.message });
    }
};

const getCommentsForBlog = async (req, res) => {
    const blogId = req.params.id; // Assuming the blog id is available in the request
    const userId = req.body.userId
    try {
        const comments = await Comment.findAll({
            raw:true,
            where: {
                BlogId: blogId,
            },
            include:  [{
                model: User,
                attributes: ['userId', 'firstName','email','mobile','lastName','profileImageUrl'],
            }],
        });
        const result = []
        for (let i = 0 ; i<=comments.length ; i++){
            
            console.log({commentId:comments[i]})
            const last_interaction = await CommentInteraction.findOne({
                where: {
                    UserId: userId,
                    CommentId: comments[i].CommentId,
                },
                order: [['createdAt', 'DESC']],
            });
            comments[i].last_interaction = last_interaction;
        }
        res.status(200).json({ message: 'Comments retrieved successfully', comments });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving comments', error: error.message });
    }
};

const likeDislikeComment = async (req, res, interactionType) => {
    const commentId = req.params.id;
    const userId = req.body.userId; // Assuming you have user information in req.user after authentication

    try {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the user has already interacted with the comment
        const existingInteraction = await CommentInteraction.findOne({
            where: {
                UserId: userId,
                CommentId: commentId,
            },
        });

        if (existingInteraction) {
            if (existingInteraction.interactionType === interactionType) {
                return res.json({ message: `Comment already ${interactionType}d by user` });
            } else {
                existingInteraction.interactionType = interactionType;
                await existingInteraction.save();

                // Update comment's likes and dislikes based on the interactionType
                if (interactionType === 'like') {
                    comment.likes += 1;
                    comment.dislikes -= 1;
                } else if (interactionType === 'dislike') {
                    comment.dislikes += 1;
                    comment.likes -= 1;
                }

                await comment.save();
            }
        } else {
            await CommentInteraction.create({
                UserId: userId,
                CommentId: commentId,
                interactionType,
            });

            if (interactionType === 'like') {
                comment.likes += 1;
            } else if (interactionType === 'dislike') {
                comment.dislikes += 1;
            }

            await comment.save();
        }

        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const likeComment = async (req, res) => {
    await likeDislikeComment(req, res, 'like');
};

const dislikeComment = async (req, res) => {
    await likeDislikeComment(req, res, 'dislike');
};
const getLastInteraction = async (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId;

    try {
        const lastInteraction = await CommentInteraction.findOne({
            where: {
                UserId: userId,
                CommentId: id,
            },
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({ lastInteraction });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving last interaction', error: error.message });
    }
};
const reportComment = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.body.userId; // Assuming you have user information in req.user after authentication

    try {
        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Create a report for the comment without requiring a reason
        await CommentReport.create({
            CommentId: commentId,
            UserId: userId,
        });

        res.status(201).json({ message: 'Comment reported successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error reporting comment', error: error.message });
    }
};

module.exports = {
    create,
    likeComment,
    dislikeComment,
    reportComment,
    getLastInteraction,
    getCommentsForBlog
};
