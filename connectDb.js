import mongoose from "mongoose";
import log from "loglevel";
import RedisClient from "./Redis/Redisconnection.js";

log.setLevel(log.levels.ERROR);
log.setLevel(log.levels.INFO);

function connectDb(uri) {
  mongoose.connect(uri).then(() => {
    log.info("Database connected!");
  });
}

export default connectDb;
