const Otp = require('../models/otpModel');

/**
 * OtpRepository - MongoDB Persistence for Password Reset OTPs
 */
class OtpRepository {
  /**
   * Save or update an OTP in MongoDB
   * @param {string} email 
   * @param {string} otp 
   * @param {number} expiresInMinutes (default 5)
   * @returns {Promise<Object>}
   */
  async saveOtp(email, otp, expiresInMinutes = 5) {
    const lowerEmail = email.toLowerCase().trim();
    const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;

    const otpRecord = await Otp.findOneAndUpdate(
      { email: lowerEmail },
      {
        email: lowerEmail,
        otp: String(otp).trim(),
        expiresAt,
        isVerified: false
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return {
      email: otpRecord.email,
      otp: otpRecord.otp,
      expiresAt: otpRecord.expiresAt,
      isVerified: otpRecord.isVerified,
      createdAt: otpRecord.createdAt
    };
  }

  /**
   * Retrieve active OTP record by email from MongoDB
   * @param {string} email 
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    if (!email) return null;
    const lowerEmail = email.toLowerCase().trim();
    const record = await Otp.findOne({ email: lowerEmail });
    if (!record) return null;
    return {
      email: record.email,
      otp: record.otp,
      expiresAt: record.expiresAt,
      isVerified: record.isVerified,
      createdAt: record.createdAt
    };
  }

  /**
   * Mark OTP as verified in MongoDB
   * @param {string} email 
   * @returns {Promise<boolean>}
   */
  async markVerified(email) {
    const lowerEmail = email.toLowerCase().trim();
    const result = await Otp.updateOne({ email: lowerEmail }, { isVerified: true });
    return result.modifiedCount > 0 || result.matchedCount > 0;
  }

  /**
   * Delete OTP record after successful reset or invalidation in MongoDB
   * @param {string} email 
   * @returns {Promise<boolean>}
   */
  async deleteOtp(email) {
    const lowerEmail = email.toLowerCase().trim();
    const result = await Otp.deleteOne({ email: lowerEmail });
    return result.deletedCount > 0;
  }
}

module.exports = new OtpRepository();
