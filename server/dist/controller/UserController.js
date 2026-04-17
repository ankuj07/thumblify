import Thumbnail from '../models/Thumbnail.js';
import User from '../models/User.js';
// Controllers to get All User Thumbnails
export const getUserThumbnails = async (req, res) => {
    try {
        const { userId } = req.session;
        const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });
        res.json({ thumbnails });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
// Controllers to get single Thumbnail of a User
export const getThumbnailById = async (req, res) => {
    try {
        const { userId } = req.session;
        const { id } = req.params;
        const thumbnail = await Thumbnail.findOne({ userId, _id: id });
        res.json({ thumbnail });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const getCredits = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('credits');
        res.json({ credits: user?.credits ?? 0 });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
// Profile get karo
export const getProfile = async (req, res) => {
    try {
        const { userId } = req.session;
        const user = await User.findById(userId).select('-password');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const totalThumbnails = await Thumbnail.countDocuments({ userId });
        const thisMonthThumbnails = await Thumbnail.countDocuments({
            userId,
            createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
        });
        res.json({ user, totalThumbnails, thisMonthThumbnails });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Name update karo
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.session;
        const { name } = req.body;
        if (!name?.trim())
            return res.status(400).json({ message: 'Name is required' });
        const user = await User.findByIdAndUpdate(userId, { name }, { new: true }).select('-password');
        res.json({ message: 'Profile updated successfully', user });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//# sourceMappingURL=UserController.js.map