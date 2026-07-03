const { redisClient } = require("../config/redis");

/**
 * Session Middleware
 * Tracks active sessions in Redis
 * Used to enforce single-session or rate-limit login attempts
 */

/**
 * Record user session in Redis
 * TTL: 7 days (matches JWT expiry)
 */
const recordSession = async (userId, token) => {
  if (!redisClient) {
    console.warn("Redis not available for session tracking");
    return;
  }

  try {
    const sessionKey = `session:${userId}`;
    await redisClient.setex(
      sessionKey,
      7 * 24 * 60 * 60, // 7 days
      JSON.stringify({
        userId,
        token,
        createdAt: new Date().toISOString(),
      }),
    );
  } catch (err) {
    console.error("Error recording session:", err);
  }
};

/**
 * Retrieve user session from Redis
 */
const getSession = async (userId) => {
  if (!redisClient) return null;

  try {
    const sessionKey = `session:${userId}`;
    const session = await redisClient.get(sessionKey);
    return session ? JSON.parse(session) : null;
  } catch (err) {
    console.error("Error retrieving session:", err);
    return null;
  }
};

/**
 * Invalidate user session in Redis (logout)
 */
const invalidateSession = async (userId) => {
  if (!redisClient) return;

  try {
    const sessionKey = `session:${userId}`;
    await redisClient.del(sessionKey);
  } catch (err) {
    console.error("Error invalidating session:", err);
  }
};

/**
 * Track failed login attempts to prevent brute force
 */
const recordFailedLogin = async (email) => {
  if (!redisClient) return;

  try {
    const attemptKey = `failed_login:${email}`;
    const attempts = await redisClient.incr(attemptKey);

    // Set expiry on first attempt (1 hour window)
    if (attempts === 1) {
      await redisClient.expire(attemptKey, 3600);
    }

    return attempts;
  } catch (err) {
    console.error("Error recording failed login:", err);
    return 0;
  }
};

/**
 * Clear failed login attempts on successful login
 */
const clearFailedLogins = async (email) => {
  if (!redisClient) return;

  try {
    const attemptKey = `failed_login:${email}`;
    await redisClient.del(attemptKey);
  } catch (err) {
    console.error("Error clearing failed logins:", err);
  }
};

/**
 * Check if account is locked due to too many failed attempts
 */
const isAccountLocked = async (email, maxAttempts = 5) => {
  if (!redisClient) return false;

  try {
    const attemptKey = `failed_login:${email}`;
    const attempts = await redisClient.get(attemptKey);
    return parseInt(attempts || 0) >= maxAttempts;
  } catch (err) {
    console.error("Error checking account lock:", err);
    return false;
  }
};

module.exports = {
  recordSession,
  getSession,
  invalidateSession,
  recordFailedLogin,
  clearFailedLogins,
  isAccountLocked,
};
