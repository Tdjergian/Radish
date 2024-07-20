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

jsonDefinitionController.createSecurityGroupDefinition = (req: Request, res: Response, next: NextFunction) => {
  const { vpcID } = req.body;

  const outputDir: string = path.join(__dirname, '../output/json-definitions');
  const SecurityGroupDefinition = {
    Description: 'Security group for Redis nodes',
    VpcId: vpcID,
    GroupName: 'redis-security-group',
    Ingress: [
      {
        IpProtocol: 'tcp',
        FromPort: 6379,
        ToPort: 6379,
        IpRanges: [
          {
            CidrIp: '0.0.0.0/16'
          },
        ],
      },
      {
        IpProtocol: 'tcp',
        FromPort: 16379,
        ToPort: 16379,
        IpRanges: [
          {
            CidrIp: '0.0.0.0/16'
          }
        ]
      }
    ], 
    Egress: [
      {
        IpProtocol: 'tcp',
        IpRanges: [
          {
            CidrIp: '0.0.0.0/0'
          }
        ]
      }
    ]
  }
  
  fs.writeFile(`${outputDir}/securityGroupDefinition.json`, JSON.stringify(SecurityGroupDefinition, null, 2), (err: Error) => {
    if (err) {
      console.error('Error writing security group definition:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Security group definition written successfully');
    next();
  });

}

module.exports = jsonDefinitionController;