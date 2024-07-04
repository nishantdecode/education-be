const sequelize = require('./db');
const { User } = require('../models/user'); // Update the import statement for the User model
const { Collaborate } = require('../models/collaborate');
const { Video } = require('../models/video');
const { Advertisement } = require('../models/advertisement');
const { Founder } = require('../models/founder');
const { Testimonial } = require('../models/testimonial');
const { Offer } = require('../models/offer');
const { News } = require('../models/news');
const { Partner } = require('../models/partner');
const { Blog } = require('../models/blog');
const { Newsletter } = require('../models/newsletter');
const { Social } = require('../models/social');
const { BlogInteraction } = require('../models/blogInteraction');
const { Comment } = require('../models/comment');
const { CommentInteraction } = require('../models/commentInteraction');
const { CommentReport } = require('../models/commentReport');
const { VerificationRequest } = require('../models/verificationTag');
const { Course } = require('../models/course');
const { FeatureAd } = require('../models/featureAd');
const { College } = require('../models/college');
const { ServiceFAQ } = require('../models/serviceFAQ');
const { Scholarship } = require('../models/scholarship');
const { Coaching } = require('../models/coaching');
const { OTP } = require('../models/otp');
const { Conversation } = require('../models/conversation');
const { Slot } = require('../models/slot');
const { Order } = require('../models/order');
const { Meeting } = require('../models/meeting');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL database');

        await User.sync(); // This will create the User table if it doesn't exist
        await Collaborate.sync();
        await Video.sync();
        await Advertisement.sync(); // This will create the Advertisement table if it doesn't exist
        await Founder.sync();
        await Testimonial.sync();
        await Offer.sync();
        await News.sync();
        await Partner.sync();
        await Blog.sync();
        await Newsletter.sync();
        await Social.sync();
        await BlogInteraction.sync();
        await Comment.sync();
        await CommentInteraction.sync();
        await CommentReport.sync();
        await VerificationRequest.sync();
        await Course.sync();
        await FeatureAd.sync();
        await College.sync();
        await ServiceFAQ.sync();
        await Scholarship.sync();
        await Coaching.sync();
        await OTP.sync();
        await Conversation.sync();
        await Slot.sync();
        await Order.sync();
        await Meeting.sync();

        console.log('Tables created successfully');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close(); // Close the connection after creating the tables
    }
})();
