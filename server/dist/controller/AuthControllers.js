import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// Controllers For User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id.toString();
        return res.json({
            message: 'Account created successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
// Controllers For User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password || '');
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        req.session.isLoggedIn = true;
        req.session.userId = user._id.toString();
        return res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
// Controllers For User Logout
export const logoutUser = async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: error.message });
        }
        return res.json({ message: 'Logout successful' });
    });
};
// Controllers For User Verify
export const verifyUser = async (req, res) => {
    try {
        const { userId } = req.session;
        if (!userId) {
            return res.status(400).json({ message: 'Invalid user' });
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid user' });
        }
        return res.json({ user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
// Google Login Controller
export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: 'Token missing' });
        }
        // access_token se Google userinfo fetch karo
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${idToken}` }
        });
        if (!googleRes.ok) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }
        const profile = await googleRes.json();
        const { sub: googleId, email, name } = profile;
        // User dhundo ya naya banao
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                name: name || 'User',
                email,
                googleId
            });
            await user.save();
        }
        else if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }
        // Session set karo
        req.session.isLoggedIn = true;
        req.session.userId = user._id.toString();
        return res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=AuthControllers.js.map