const VerificationToken = require('../models/verificationToken');
const User = require('../models/user');

const verifyToken = async (req, res) => {
  try {
    const { token } = req.params;

    const verificationRecord = await VerificationToken.findOne({ token });

    if (!verificationRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Mark user as verified (if needed)
    await User.findByIdAndUpdate(verificationRecord.userId, { isVerified: true });

    // Delete verification token after success
    await VerificationToken.deleteOne({ token });

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { verifyToken };
