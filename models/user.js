const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isMobileVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  age: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  personality: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  traits: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  profileImageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verificationStatus: {
    type: DataTypes.ENUM('none', 'pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'none',
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
  usedTags: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interests: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Use the ARRAY data type
    allowNull: true,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Use the ARRAY data type
    allowNull: true,
  },
  school: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  college: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profession: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'User', // Explicitly set the table name to 'User'
});

// Define the createUser function and export it
const createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  User, // Export the User model itself
  createUser, // Export the createUser function
  updateUserVerificationStatus: async (userId, status) => {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        user.verificationStatus = status;
        await user.save();
      }
    } catch (error) {
      throw new Error('Error updating user verification status');
    }
  }
};
