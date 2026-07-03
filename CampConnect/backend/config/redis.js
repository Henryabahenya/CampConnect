const { createClient } = require("redis");

const redisUrl =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`;

const client = createClient({ url: redisUrl });

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

client.on("connect", () => {
  console.log("Redis client connected safely");
});

const connectRedis = async () => {
  await client.connect();
};

module.exports = { connectRedis, redisClient: client };
