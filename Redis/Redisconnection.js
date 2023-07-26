import Redis from "ioredis";

const redisConfig = {
  host: "localhost",
  port: 6379,
  // password  redis password (optional)
  // other configuration setup such ssl cert
};

const redisClient = new Redis(redisConfig);

export default redisClient;
