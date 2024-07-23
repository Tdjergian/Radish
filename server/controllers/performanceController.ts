import { Request, Response, NextFunction } from "express";
const { createClient } = require("redis");
const Redis = require("ioredis");

require("dotenv").config();
interface RedisRequestBody {
  host: string;
  port: number;
  redisPassword: string;
}

const performanceController: { [key: string]: any } = {};
//connect to AWS cluster
const cluster = new Redis.Cluster([
  { host: "52.32.221.157", port: 6379 },
  { host: "54.70.94.134", port: 6379 },
  { host: "34.221.141.10", port: 6379 },
  { host: "54.245.151.142", port: 6379 },
]);

cluster.on("connect", () => {
  console.log("AWS cluster connected");
});

cluster.on("error", (err: Error) => {
  console.error("AWS cluster connection error", err);
});

performanceController.connectAWSCluster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await cluster.set("key", "value");
    console.log("set result from AWS connection", result);
    return next();
  } catch (err) {
    return next({
      log: `redisController.connectUserRedis error ${err}`,
      message: `could not connect to Redis instance`,
      status: 500,
    });
  }
};

//connect to Redis cloud

performanceController.connectUserRedis = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { host, port, redisPassword } = req.body;
    host = host || process.env.HOST;
    port = port || process.env.PORT;
    redisPassword = redisPassword || process.env.REDIS_PASSWORD;
    const redisClient = createClient({
      password: redisPassword,
      socket: { host, port },
    });
    await redisClient.connect();
    console.log("redis connected");
    res.locals.redisClient = redisClient;
    return next();
  } catch (err) {
    return next({
      log: `redisController.connectUserRedis error ${err}`,
      message: `could not connect to Redis instance`,
      status: 500,
    });
  }
};

performanceController.disconnectRedis = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await res.locals.redisClient.disconnect();
  } catch (err) {
    return next({
      log: `redisController.disconnectRedis error ${err}`,
      message: `could not disconnect to Redis instance`,
      status: 500,
    });
  }
};

performanceController.getMemory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //const redisClient = res.locals.redisClient;
    //switch back to above if use redis cloud
    const redisClient = cluster;
    if (!redisClient) {
      throw new Error("Redis client is not available");
    }
    const stats = await redisClient.info("memory");
    const metrics: string[] = stats.split("\r\n");
    let usedMemory = metrics.find((str) => str.startsWith("used_memory_human"));
    let peakUsedMemory = metrics.find((str) =>
      str.startsWith("used_memory_peak_human")
    );
    let totalMemory = metrics.find((str) =>
      str.startsWith("total_system_memory_human")
    );
    if (usedMemory)
      usedMemory = usedMemory.slice(usedMemory.indexOf(":") + 1).trim();
    if (peakUsedMemory)
      peakUsedMemory = peakUsedMemory
        .slice(peakUsedMemory.indexOf(":") + 1)
        .trim();

    console.log("usedMemory", usedMemory, "peakUsedMemory", peakUsedMemory);
    res.locals.memory = {
      usedMemory: usedMemory,
      peakUsedMemory: peakUsedMemory,
    };
    return next();
  } catch (err) {
    return next({
      log: `redisController.getMemory error ${err}`,
      message: `could not get Memory`,
      status: 500,
    });
  }
};

performanceController.getUsedCPU = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //const redisClient = res.locals.redisClient;
    const redisClient = cluster;
    if (!redisClient) {
      throw new Error("Redis client is not available");
    }
    const stats = await redisClient.info("CPU");
    const metrics: string[] = stats.split("\r\n");
    let usedCPU = metrics.find((str) => str.startsWith("used_cpu_user"));
    if (usedCPU) usedCPU = usedCPU.slice(usedCPU.indexOf(":") + 1).trim();
    console.log("usedCPU", usedCPU);
    res.locals.getUsedCPU = { usedCPU: usedCPU };
    next();
  } catch (err) {
    return next({
      log: `redisController.getResponseTimes error ${err}`,
      message: `could not get Response Times`,
      status: 500,
    });
  }
};

module.exports = performanceController;
