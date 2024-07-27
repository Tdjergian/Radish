import { Request, Response, NextFunction } from 'express';
const { createClient } = require('redis');
const Redis = require('ioredis');
import { exec } from 'child_process';

require('dotenv').config();
interface RedisRequestBody {
  host: string;
  port: number;
  redisPassword: string;
}

const performanceController: { [key: string]: any } = {};
//connect to AWS cluster

const cluster = new Redis.Cluster(
  [
    // { host: '35.92.138.72', port: 6379 },
    // { host: '54.245.154.133', port: 6379 },
    // { host: '18.246.149.105', port: 6379 },
    { host: '52.38.48.179', port: 6379 },
    { host: '52.25.17.33', port: 6379 },
    { host: '34.214.39.67', port: 6379 },
  ],
  { redisOptions: { password: 12345 } }
);


cluster.on("connect", () => {
  console.log("AWS cluster connected");
});

cluster.on('error', (err: Error) => {
  console.error('AWS cluster connection error', err);
});

performanceController.connectAWSCluster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await cluster.set('key', 'value');
    console.log('set result from AWS connection', result);
    return next();
  } catch (err) {
    return next({
      log: `redisController.connectUserRedis error ${err}`,
      message: `could not connect to Redis instance`,
      status: 500,
    });
  }
};

// connect to Redis cloud

performanceController.connectUserRedis = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('in the connectUserRedis function');
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
    console.log('redis connected');
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
  console.log('in the disconnectRedis function');
  try {
    await res.locals.redisClient.disconnect();
  } catch (err) {
    return next({
      log: `redisController.disconnectRedis error ${err}`,
      message: `could not disconnect to Redis instance`,
      status: 500,
    });
  }

  next();
};

performanceController.getMemory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('in the getMemory function');
  try {
    //const redisClient = res.locals.redisClient;
    //switch back to above if use redis cloud
    const redisClient = cluster;

    console.log('redisClient', redisClient);

    if (!redisClient) {
      throw new Error('Redis client is not available');
    }
    const stats = await redisClient.info('memory');
    console.log('stats', stats);
    const metrics: string[] = stats.split('\r\n');
    let usedMemory = metrics.find(str => str.startsWith('used_memory_human'));
    let peakUsedMemory = metrics.find(str =>
      str.startsWith('used_memory_peak_human')
    );
    let totalMemory = metrics.find(str =>
      str.startsWith('total_system_memory_human')
    );
    if (usedMemory)
      usedMemory = usedMemory.slice(usedMemory.indexOf(':') + 1).trim();
    if (peakUsedMemory)
      peakUsedMemory = peakUsedMemory
        .slice(peakUsedMemory.indexOf(':') + 1)
        .trim();

    console.log('usedMemory', usedMemory, 'peakUsedMemory', peakUsedMemory);
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
  console.log('in the getUsedCPU function');
  try {
    //const redisClient = res.locals.redisClient;
    const redisClient = cluster;
    if (!redisClient) {
      throw new Error('Redis client is not available');
    }
    const stats = await redisClient.info('CPU');
    const metrics: string[] = stats.split('\r\n');
    let usedCPU = metrics.find(str => str.startsWith('used_cpu_user'));
    if (usedCPU) usedCPU = usedCPU.slice(usedCPU.indexOf(':') + 1).trim();
    console.log('usedCPU', usedCPU);
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

performanceController.runBenchmark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 6379;
    const num_clients = 5;
    const num_requests = 10;
    const tests = 'set,get';
    const password = process.env.REDIS_PASSWORD || 12345;
    console.log('inside benchmark');
    // const command = `redis-benchmark -h ${host} -p ${port} -a ${password} -c ${num_clients} -n ${num_requests} -t ${tests}`;
    //cluster mode
    // const command = `redis-benchmark -h 54.190.149.145 -h 34.219.192.177 -h 54.244.103.234 -p ${port} -a ${password} -c ${num_clients} -n ${num_requests} -t ${tests} `;

    //const command = `redis-benchmark -h 34.219.192.177 -h 54.244.103.234 -h 54.190.149.145 -p ${port} -a ${password} -c ${num_clients} -n ${num_requests} -t ${tests}`;
    const command = `redis-benchmark -h 52.38.48.179 -h 52.25.17.33 -h 34.214.39.67 -p ${port} -a ${password} -c ${num_clients} -n ${num_requests} -t ${tests}`;
    exec(command, (error, stdout, stderr) => {
      console.log('inside exec');
      if (error) {
        console.error('Error running redis-benchmark:', stderr);
        return res.status(500).json({ success: false, error: stderr });
      }
      console.log('Benchmark result:', stdout);
      return res.json({ success: true, output: stdout });
    });
  } catch (err) {
    next({
      log: `redisController.runBenchmark error ${err}`,
      message: `Could not run Benchmarking`,
      status: 500,
    });
  }
};

module.exports = performanceController;
