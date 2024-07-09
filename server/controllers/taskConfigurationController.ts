import { Request, Response, NextFunction } from 'express';
const fs = require('fs');
const path = require('path'); 
import { TaskDefinition, ContainerDefinition } from '../../types/types';

const taskConfigurationController: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {};

taskConfigurationController.createTaskDefinition = (req: Request, res: Response, next: NextFunction) => { 

  let { 
    shards,
    replicas, 
    protectedMode, 
    portNumber, 
    masterAuth, 
    requirePass, 
    daemonize, 
    loglevel,
    timeout,
    saveSeconds,
    saveChanges,
    appendonly,
    appendfsync,
    rdbcompression,
    rdbchecksum,
    replicaServeStaleData,
    maxmemory,
    maxmemoryPolicy
   } = req.body;
  
  const outputDir: string = path.join(__dirname, '../output');

  const TaskDefinition: TaskDefinition = {
    // Task Definition Name
    family: 'redis-cluster-task',
    // Task Definition Version
    networkMode: 'awsvpc',
    ContainerDefinitions: [],
    volumes: []
  }

  for (let i = 0; i < shards; i++) {
    for (let j = 0; j < replicas; j++) {
      const containerDefinition: ContainerDefinition = {
        name: `redis-${i}-${j}`,
        image: 'redis:latest',
        memory: 512,
        cpu: 256,
        essential: true,
        command: [
          `redis-server --protected-mode ${protectedMode} --port ${portNumber} --masterauth ${masterAuth} --requirepass ${requirePass} --daemonize ${daemonize} --loglevel ${loglevel} --timeout ${timeout} --save ${saveSeconds} ${saveChanges} --appendonly ${appendonly} --appendfsync ${appendfsync} --rdbcompression ${rdbcompression} --rdbchecksum ${rdbchecksum} --replica-serve-stale-data ${replicaServeStaleData} --maxmemory ${maxmemory} --maxmemory-policy ${maxmemoryPolicy}`
        ],
        portMappings: [
          {
            containerPort: 6379,
          }
        ],
        mountPoints: [
          {
            sourceVolume: `redis-${i}-${j}-data`,
            containerPath: '/data'
          }
        ]
      }

      TaskDefinition.volumes.push({
        name: `redis-${i}-${j}-data`,
        host: {}
      });

      TaskDefinition.ContainerDefinitions.push(containerDefinition);
    }
  } 

  console.log(TaskDefinition);
  next();

}