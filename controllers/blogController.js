const cloudinary = require('cloudinary').v2;
const { Blog } = require('../models/blog');
const { createBlog } = require('../models/blog');
const { BlogInteraction } = require('../models/blogInteraction');
const { Op } = require('sequelize');
const moment = require('moment');
const { User } = require('../models/user');

const createAdd = async (req, res) => {
    const { userId, title, owner, description, ownerUrl, tags } = req.body;
    console.log("Uploaded Image File:", req.files.image);

    if (!req.files || !req.files.image) {
        return res.status(400).json({ message: 'No image file provided' });
    }

    const imageFile = req.files.image;
    console.log("Image File Path:", imageFile.tempFilePath);

    if (!imageFile.tempFilePath) {
        return res.status(400).json({ message: 'Image file path is missing' });
    }

    try {
        // Convert tags from a comma-separated string to an array of tags
        const tagArray = tags.split(',').map(tag => tag.trim());

        const result = await cloudinary.uploader.upload(imageFile.tempFilePath, { folder: "edmertion" });

        const blog = await createBlog({ userId, title, owner, description, imageUrl: result.url, ownerUrl, tags: tagArray });

        // Update user's usedTags
        const user = await User.findByPk(userId);

        if (user) {
            const userTags = user.usedTags ? user.usedTags.split(',') : [];

            // Add new tags to user's usedTags
            tagArray.forEach(tag => {
                if (!userTags.includes(tag)) {
                    userTags.push(tag);
                }
            });

            user.usedTags = userTags.join(',');
            await user.save();
        }

        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        console.error('Error in createBlog:', error);  // Log the complete error
        res.status(500).json({
            message: 'Error creating Blog',
            error: error.message,  // Send detailed error message
            stack: error.stack     // Optionally include the stack trace
        });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            include:  [{
                model: User,
                attributes: ['userId', 'firstName','email','mobile','lastName','profileImageUrl'],
            }],
            order: [['likes', 'DESC']], // Order by likes in descending order
        });
        res.status(200).json({ message: 'All blogs retrieved successfully', blogs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving blogs', error: error.message });
    }
};

const getBlogById = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog retrieved successfully', blog });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving blog', error: error.message });
    }
};

const getAllBlogsCurrentMonth = async (req, res) => {
    try {
        const currentDate = moment();
        const startOfMonth = currentDate.startOf('month').format('YYYY-MM-DD HH:mm:ss');
        const endOfMonth = currentDate.endOf('month').format('YYYY-MM-DD HH:mm:ss');

        const blogs = await Blog.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfMonth, endOfMonth],
                },
            },
            order: [['likes', 'DESC']], // Order by likes in descending order
        });

        res.status(200).json({ message: 'Blogs of the current month retrieved successfully', blogs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving blogs of the current month', error: error.message });
    }
};

const getAllBlogsByClicks = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            order: [['clicks', 'DESC']], // Order by clicks in descending order
        });
        res.status(200).json({ message: 'All blogs retrieved by clicks successfully', blogs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving blogs by clicks', error: error.message });
    }
};

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, owner, description, imageUrl, ownerUrl } = req.body;

    try {
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.title = title;
        blog.tags = tags;
        blog.owner = owner;
        blog.description = description;
        blog.imageUrl = imageUrl;
        blog.ownerUrl = ownerUrl;

        await blog.save();

        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog', error: error.message });
    }
};

const deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        await blog.destroy();

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
};

const likeDislikeBlog = async (req, res, interactionType) => {
    const blogId = req.params.id;
    const userId = req.body.userId; // Assuming you have user information in req.user after authentication

    try {
        const blog = await Blog.findByPk(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if the user has already interacted with the blog
        const existingInteraction = await BlogInteraction.findOne({
            where: {
                UserId: userId,
                BlogId: blogId,
            },
        });

        if (existingInteraction) {
            if (existingInteraction.interactionType === interactionType) {
                // User is trying to interact with the same type again
                return res.json({ message: `Blog already ${interactionType}d by user` });
            } else {
                // User is trying to switch interaction type
                existingInteraction.interactionType = interactionType;
                await existingInteraction.save();

                // Update blog's likes and dislikes based on the interactionType
                if (interactionType === 'like') {
                    blog.likes += 1;
                    blog.dislikes -= 1;
                } else if (interactionType === 'dislike') {
                    blog.dislikes += 1;
                    blog.likes -= 1;
                }

                await blog.save();
            }
        } else {
            // User is interacting for the first time
            await BlogInteraction.create({
                UserId: userId,
                BlogId: blogId,
                interactionType,
            });

            // Update blog's likes and dislikes based on the interactionType
            if (interactionType === 'like') {
                blog.likes += 1;
            } else if (interactionType === 'dislike') {
                blog.dislikes += 1;
            }

            await blog.save();
        }

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const likeBlog = async (req, res) => {
    await likeDislikeBlog(req, res, 'like');
};

const dislikeBlog = async (req, res) => {
    await likeDislikeBlog(req, res, 'dislike');
};


const trackClick = async (req, res) => {
    const blogId = req.params.id;

    try {
        const blog = await Blog.findByPk(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.clicks += 1;
        await blog.save();

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getLikesDislikesCount = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findByPk(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const totalLikes = blog.likes;
        const totalDislikes = blog.dislikes;

        res.status(200).json({ totalLikes, totalDislikes });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving likes and dislikes count', error: error.message });
    }
};

const getLastInteraction = async (req, res) => {
    const { id } = req.params;
    const userId = req.body.userId;

    try {
        const lastInteraction = await BlogInteraction.findOne({
            where: {
                UserId: userId,
                BlogId: id,
            },
            order: [['interactionTimestamp', 'DESC']],
        });

        res.status(200).json({ lastInteraction });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving last interaction', error: error.message });
    }
};

const getBlogsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const blogs = await Blog.findAll({
            where: {
                userId: userId,
            },
            order: [['createdAt', 'DESC']], // Order by createdAt in descending order
        });

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: 'No blogs found for the specified user' });
        }

        res.status(200).json({ message: 'Blogs retrieved successfully', blogs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving blogs by userId', error: error.message });
    }
};

module.exports = {
    createAdd,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    trackClick,
    getLikesDislikesCount,
    getLastInteraction,
    getAllBlogsCurrentMonth,
    getAllBlogsByClicks,
    getBlogsByUserId
};
