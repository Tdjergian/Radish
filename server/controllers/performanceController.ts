import { Request, Response, NextFunction } from 'express';
const { createClient } = require('redis');
const Redis = require('ioredis');
import { exec } from 'child_process';
import { CostExplorer } from 'aws-sdk';

require('dotenv').config();
interface RedisRequestBody {
  host: string;
  port: number;
  redisPassword: string;
}

const performanceController: { [key: string]: any } = {};
//connect to AWS cluster

// const cluster = new Redis.Cluster(
//   [
//     { host: '52.38.48.179', port: 6379 },
//     { host: '52.25.17.33', port: 6379 },
//     { host: '34.214.39.67', port: 6379 },
//     { host: '44.242.222.211', port: 6379 },
//     { host: '35.93.23.179', port: 6379 },
//     { host: '35.95.31.110', port: 6379 },
//   ],
//   { redisOptions: { password: 12345 } }
// );

// cluster.on('connect', () => {
//   console.log('AWS cluster connected');
//   console.log('cluster isn not down')
// });

// cluster.on('error', (err: Error) => {
//   console.error('AWS cluster connection error', err);
// });

// performanceController.connectAWSCluster = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const result = await cluster.set('key', 'value');
//     console.log('set result from AWS connection', result);
//     return next();
//   } catch (err) {
//     return next({
//       log: `redisController.connectUserRedis error ${err}`,
//       message: `could not connect to Redis instance`,
//       status: 500,
//     });
//   }
// };

// connect to Redis cloud

performanceController.connectUserRedis = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
 
  console.log('in the connectUserRedis function');
  
  // try {
  //   console.log(res.locals.user);
  //   const ips = res.locals.user.clusterIPs;
  //   console.log('ips', ips);
  //   // console.log('res.locals.user ', res.locals.user);
  //   // const clusterNodes: {host: string, port: number}[] = [];
  //   // ips.forEach((ip: string) => {
  //   //   clusterNodes.push({
  //   //     host: ip,
  //   //     port: 6379,
  //   //   });
  //   // });
  //   next();
  // }
  // catch(err){
  //   return next({
  //     log: `redisController.connectUserRedis error ${err}`,
  //     message: `could not connect to Redis instance`,
  //     status: 500,
  //   });
  // }

  // ----------------------------------------------

  try {
    const ips = res.locals.user.clusterIPs;
    console.log('res.locals.user ', res.locals.user);
    const clusterNodes: {host: string, port: number}[] = [];
    ips.forEach((ip: string) => {
      clusterNodes.push({
        host: ip,
        port: 6379,
      });
    });


    // console.log('clusterNodes', clusterNodes);
    // const redisClient = new Redis.Cluster(clusterNodes, {
    //   redisOptions: {
    //     password: req.body.redisPassword || 12345,
    //   },
    // });

    // console.log('redisClient', redisClient)

    // redisClient.on('connect', () => {
    //   console.log('Redis client connected');
    //   res.locals.redisClient = redisClient;
    //   // next();
    // });

    // redisClient.on('error', (err: Error) => {
    //   console.error('Redis client connection error:', err);
    //   return next({
    //     log: `redisController.connectUserRedis error ${err}`,
    //     message: `could not connect to Redis instance`,
    //     status: 500,
    //   });
    // });

    // res.locals.redisClient = redisClient;
    next();

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
    const redisClient = res.locals.redisClient;

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
    const redisClient = res.locals.redisClient;
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
  console.log('in the runBenchmark function');
    //   const host = process.env.HOST || 'localhost';
    // const port = process.env.PORT || 6379;
    // const num_clients = 100;
    // const num_requests = 3;
    // const tests = 'set,get';
    // const password = process.env.REDIS_PASSWORD || 12345;
    // console.log('inside benchmark');

    
    // const ips = res.locals.user.clusterIPs;
    // let nodes = '';
    // ips.forEach((ip: string) => {
    //   nodes += `-h ${ip} `;
    // });

    // const command = `redis-benchmark ${nodes} -p ${port} -a ${password} -c ${num_clients} -n ${num_requests} -t ${tests} --cluster`;
    // console.log('command', command);
    // next();

  
  
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 6379;
    const num_clients = 100;
    const num_requests = 300;
    const tests = 'set,get';
    const password = process.env.REDIS_PASSWORD || 12345;
    console.log('inside benchmark');
    // const command = `redis-benchmark -h ${host} -p ${port} -a ${password} -c ${num_clients} -n ${num_requests} -t ${tests}`;
    // cluster mode
    // const command = `redis-benchmark -h 54.190.149.145 -h 34.219.192.177 -h 54.244.103.234 -p ${port} -a ${password} -c ${num_clients} -n ${num_requests} -t ${tests} `;
    const ips = res.locals.user.clusterIPs;
    let nodes = '';
    ips.forEach((ip: string) => {
      nodes += `-h ${ip} `;
    });

    const command = `redis-benchmark ${nodes} -p ${port} -a ${password} -c ${num_clients} -n ${num_requests} -t ${tests} --cluster`;
    console.log('command', command);

    exec(command, (error, stdout, stderr) => {
      console.log('inside exec');
      if (error) {
        console.error('Error running redis-benchmark:', stderr);
        return res.status(500).json({ success: false, error: stderr });
      }
      console.log('Benchmark result:', stdout);
      // return res.status(200).json({ success: true, output: stdout });
      res.locals.benchmark ={success: true, output: stdout};
      next();
    });

};

module.exports = performanceController;
