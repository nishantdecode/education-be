// Import required modules
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { User } = require('../models/index')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//  const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

require('dotenv').config();
// Create an Express application
const app = express();

// Configure express-session middleware
app.use(session({
  secret: 'abcdefgh@123344',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Google Strategy for Passport.js
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/social/google/callback'
},
  async (accessToken, refreshToken, profile, done) => {
    // Extract user data from the profile object
    const user = {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
    };
    // Pass the user object to the done callback function
    done(null, user);
  }
));

// Configure session serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Define routes

// Route for Google authentication
app.get('/', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Callback route after successful authentication
app.get('/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    // Redirect to a success page or the user's profile page
    console.log(req.user.email);
    try {
      let usr = await User.findOne({ email: req.user.email });
      if (!usr) {
        usr = new User({ phoneNumber: "234567", email: req.user.email });
      } else {
        return res.json({
          message: 'user already verified',
          usr,
        });
      }
      usr.verified = true;
      await usr.save();
      res.json({
        message: 'successfull',
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

app.get('/login', function (req, res) {
  res.send('login');
});
module.exports = app;
