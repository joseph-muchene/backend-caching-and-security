import RedisClient from "./Redisconnection.js";

// init redis client assuming we are running it locally
async function setCache(key, data) {
  // Assuming data is a javascript object, you can store it as a JSON string in Redis

  await RedisClient.set(key, JSON.stringify(data));
}

// getting data from cache
async function getFromCache(key) {
  // retrieve the cached data from redis
  const cachedData = await RedisClient.get(key);
  //   if data is found in the cache, parse the json string into the reversed javascript object

  return cachedData ? JSON.parse(cachedData) : null;
}

async function setCacheWithExpiration(key, data, expirationInSeconds) {
  // set the data in Redis with an expiration  in seconds

  await RedisClient.set(key, JSON.stringify(data), "EX", expirationInSeconds);
}

export default {
  getFromCache,
  setCache,
  setCacheWithExpiration,
};
