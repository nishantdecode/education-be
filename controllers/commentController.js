const { Comment, createComment } = require("../models/comment");
const { CommentInteraction } = require("../models/commentInteraction");
const { CommentReport } = require("../models/commentReport");
const { User } = require("../models/user");

const create = async (req, res) => {
  const { text, userId } = req.body;
  const blogId = req.params.id;

  try {
    const comment = await createComment({
      text,
      userId: userId,
      BlogId: blogId,
    });

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating comment", error: error.message });
  }
};

const getCommentsForBlog = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.body.userId;

  try {
    let comments;

    if (userId) {
      comments = await Comment.findAll({
        where: { BlogId: blogId },
        include: [
          {
            model: User,
            attributes: [
              "userId",
              "firstName",
              "lastName",
              "email",
              "mobile",
              "profileImageUrl",
            ],
          },
          {
            model: CommentInteraction,
            where: { userId: userId },
            required: false,
            order: [["createdAt", "DESC"]],
            limit: 1,
          },
          {
            model: CommentReport,
            where: { userId: userId },
            required: false,
            order: [["createdAt", "DESC"]],
            limit: 1,
          },
        ],
      });
    } else {
      comments = await Comment.findAll({
        where: { BlogId: blogId },
        include: [
          {
            model: User,
            attributes: [
              "userId",
              "firstName",
              "lastName",
              "email",
              "mobile",
              "profileImageUrl",
            ],
          },
        ],
      });
    }

    res
      .status(200)
      .json({ message: "Comments retrieved successfully", comments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving comments", error: error.message });
  }
};

const likeDislikeComment = async (req, res, interactionType) => {
  const commentId = req.params.id;
  const userId = req.body.userId; // Assuming you have user information in req.user after authentication

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already interacted with the comment
    const existingInteraction = await CommentInteraction.findOne({
      where: {
        userId: userId,
        commentId: commentId,
      },
    });

    if (existingInteraction) {
      if (existingInteraction.interactionType === interactionType) {
        return res.json({
          message: `Comment already ${interactionType}d by user`,
        });
      } else {
        existingInteraction.interactionType = interactionType;
        await existingInteraction.save();

        // Update comment's likes and dislikes based on the interactionType
        if (interactionType === "like") {
          comment.likes += 1;
          comment.dislikes -= 1;
        } else if (interactionType === "dislike") {
          comment.dislikes += 1;
          comment.likes -= 1;
        }

        await comment.save();
      }
    } else {
      await CommentInteraction.create({
        userId: userId,
        commentId: commentId,
        interactionType,
      });

      if (interactionType === "like") {
        comment.likes += 1;
      } else if (interactionType === "dislike") {
        comment.dislikes += 1;
      }

      await comment.save();
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const likeComment = async (req, res) => {
  await likeDislikeComment(req, res, "like");
};

const dislikeComment = async (req, res) => {
  await likeDislikeComment(req, res, "dislike");
};
const getLastInteraction = async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;

  try {
    const lastInteraction = await CommentInteraction.findOne({
      where: {
        userId: userId,
        commentId: id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ lastInteraction });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving last interaction",
      error: error.message,
    });
  }
};
const reportComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.body.userId; // Assuming you have user information in req.user after authentication

  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Create a report for the comment without requiring a reason
    await CommentReport.create({
      commentId: commentId,
      userId: userId,
    });

    res.status(201).json({ message: "Comment reported successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reporting comment", error: error.message });
  }
};

module.exports = {
  create,
  likeComment,
  dislikeComment,
  reportComment,
  getLastInteraction,
  getCommentsForBlog,
};
