const { redisClient } = require("../config/redis");

const DEFAULT_SESSION_TTL_SECONDS = 24 * 60 * 60;

/**
 * Session Middleware
 * Tracks token whitelist state and failed login attempts in Redis.
 */

const recordSession = async (
  userId,
  token,
  ttl = DEFAULT_SESSION_TTL_SECONDS,
) => {
  if (!redisClient) {
    console.warn("Redis not available for session tracking");
    return;
  }

  try {
    const tokenKey = `token:${userId}`;
    const sessionKey = `session:${userId}`;
    await redisClient.set(tokenKey, token, { EX: ttl });
    await redisClient.set(
      sessionKey,
      JSON.stringify({ userId, token, createdAt: new Date().toISOString() }),
      { EX: ttl },
    );
  } catch (err) {
    console.error("Error recording session:", err);
  }
};

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

const getWhitelistedToken = async (userId) => {
  if (!redisClient) return null;

  try {
    const tokenKey = `token:${userId}`;
    return await redisClient.get(tokenKey);
  } catch (err) {
    console.error("Error retrieving whitelisted token:", err);
    return null;
  }
};

const invalidateSession = async (userId) => {
  if (!redisClient) return;

  try {
    const tokenKey = `token:${userId}`;
    const sessionKey = `session:${userId}`;
    await redisClient.del(tokenKey, sessionKey);
  } catch (err) {
    console.error("Error invalidating session:", err);
  }
};

const recordFailedLogin = async (email) => {
  if (!redisClient) return 0;

  try {
    const attemptKey = `failed_login:${email}`;
    const attempts = await redisClient.incr(attemptKey);
    if (attempts === 1) {
      await redisClient.expire(attemptKey, 3600);
    }
    return attempts;
  } catch (err) {
    console.error("Error recording failed login:", err);
    return 0;
  }
};

const clearFailedLogins = async (email) => {
  if (!redisClient) return;

  try {
    await redisClient.del(`failed_login:${email}`);
  } catch (err) {
    console.error("Error clearing failed logins:", err);
  }
};

const isAccountLocked = async (email, maxAttempts = 5) => {
  if (!redisClient) return false;

  try {
    const attempts = await redisClient.get(`failed_login:${email}`);
    return parseInt(attempts || 0, 10) >= maxAttempts;
  } catch (err) {
    console.error("Error checking account lock:", err);
    return false;
  }
};

module.exports = {
  recordSession,
  getSession,
  getWhitelistedToken,
  invalidateSession,
  recordFailedLogin,
  clearFailedLogins,
  isAccountLocked,
};
