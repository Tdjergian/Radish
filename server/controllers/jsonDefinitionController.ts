import { Request, Response, NextFunction } from 'express';
const fs = require('fs');
const path = require('path'); 
import { TaskDefinition, ContainerDefinition } from '../../types/types';
import { json } from 'body-parser';

const jsonDefinitionController: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {};

jsonDefinitionController.createTaskDefinition = (req: Request, res: Response, next: NextFunction) => { 

  const { cpu, memory, OS } = req.body;
  
  const outputDir: string = path.join(__dirname, '../output/json-definitions');

  const TaskDefinition: TaskDefinition = {
    family: 'redis-cluster-task',
    networkMode: 'awsvpc',
    ContainerDefinitions: [],
    volumes: []
  }
 
  const containerDefinition: ContainerDefinition = {
    name: ``,
    image: 'redis:latest',
    memory: memory,
    cpu: cpu,
    essential: true,
    command: [],
    portMappings: [
      {
        containerPort: 6379,
        hostPort: 6379,
        protocol: 'tcp'
      },
      {
        containerPort: 16379,
        hostPort: 16379,
        protocol: 'tcp'
      }
    ],
    mountPoints: [
      {
        sourceVolume: `redis-data`,
        containerPath: '/data'
      }
    ]
  }
  
  
  console.log('task definition: ', TaskDefinition);
  next();
}

jsonDefinitionController.createServiceDefinition = (req: Request, res: Response, next: NextFunction) => {
  
}

module.exports = jsonDefinitionController;