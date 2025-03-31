import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Register admin user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Register attempt with:', { email });
    
    // Check if default admin exists
    const defaultAdmin = await User.findOne({ email: 'admin@admin.com' });
    
    if (!defaultAdmin) {
      console.log('Default admin does not exist');
      return res.status(400).json({
        success: false,
        error: 'Default admin does not exist',
      });
    }

    // Check if another admin already exists (not the default one)
    const adminCount = await User.countDocuments({ email: { $ne: 'admin@admin.com' } });
    if (adminCount > 0) {
      console.log('Another admin already exists');
      return res.status(400).json({
        success: false,
        error: 'Another admin user already exists',
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
    });

    // Remove default admin
    await User.findOneAndDelete({ email: 'admin@admin.com' });
    console.log('Default admin removed, new admin created');

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Check if default admin exists
// @route   GET /api/auth/check-default-admin
// @access  Public
export const checkDefaultAdmin = async (req, res) => {
  try {
    const defaultAdmin = await User.findOne({ email: 'admin@admin.com' });
    
    // Also check if any other admin exists
    const otherAdminExists = await User.exists({ email: { $ne: 'admin@admin.com' } });
    
    res.status(200).json({
      success: true,
      exists: defaultAdmin ? true : false,
      otherAdminExists: otherAdminExists ? true : false
    });
  } catch (error) {
    console.error('Check default admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt with:', { email });

  // Validate email & password
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({
      success: false,
      error: 'Please provide an email and password',
    });
  }

  try {
    // Special case for first login with default admin - direct creation and authentication
    if (email === 'admin@admin.com' && password === 'admin') {
      console.log('Default admin login attempt');
      
      // Check if another admin already exists
      const otherAdminExists = await User.exists({ email: { $ne: 'admin@admin.com' } });
      if (otherAdminExists) {
        console.log('Login attempt with default admin but another admin exists');
        return res.status(401).json({
          success: false,
          error: 'Default admin login is not allowed once another admin has been created',
        });
      }
      
      // Look for existing default admin user
      let user = await User.findOne({ email: 'admin@admin.com' });
      
      // If no user found, create one
      if (!user) {
        console.log('Creating new default admin user');
        user = new User({
          email: 'admin@admin.com',
          password: 'admin'
        });
        
        // Manually generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash('admin', salt);
        
        await user.save();
        console.log('Default admin created successfully');
      }
      
      // Generate JWT token
      const token = user.getSignedJwtToken();
      
      return res.status(200).json({
        success: true,
        token,
        isDefaultAdmin: true
      });
    }

    // Regular login process for non-default users
    console.log('Regular login process');
    
    // Check for user and include the password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    console.log('User found, checking password');
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    console.log('Login successful');
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message,
    });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  console.log('Token generated for user:', user.email);
  
  res.status(statusCode).json({
    success: true,
    token,
    isDefaultAdmin: user.email === 'admin@admin.com'
  });
};
