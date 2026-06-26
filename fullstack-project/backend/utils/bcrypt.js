const bcrypt = require("bcryptjs");

/**
 * Hashes a plaintext password using bcrypt.
 * @param {string} password - Plain text password.
 * @returns {Promise<string>} - Hashed password.
 */
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plaintext password against a hash.
 * @param {string} password - Plain text password.
 * @param {string} hashed - Hashed password.
 * @returns {Promise<boolean>} - True if matching.
 */
async function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

module.exports = {
  hashPassword,
  comparePassword
};
