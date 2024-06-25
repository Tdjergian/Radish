const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path'); 
import { Request, Response, NextFunction } from 'express'
import { DockerComposeFile } from '../../types/types';



const fileGenerationController : { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {};

fileGenerationController.createFiles = (req: Request, res: Response, next) => {
  console.log(req.body);
  // Destructure form data on req.body
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

   console.log(daemonize)


  // Construct the output directory path
  const outputDir = path.join(__dirname, 'output');

  // Determine number of redis.conf files to write and initialize file counter
  let redisFilesToWrite = shards * replicas;
  let redisFilesWritten = 0;

  let port = Number(portNumber);

  const dockerCompose: DockerComposeFile = {
      version: '3.8',
      services: {},
      volumes: {},
      networks: {
          'redis-cluster': {
              driver: 'bridge',
              ipam: {
                  config: [
                      { subnet: '172.20.0.0/16' }
                  ]
              }
          }
      }
  };
  dockerCompose.services['app'] = {
      image: 'client-app-js:latest',
      container_name: 'client-app-js',
      ports: ['80:80'],
      environment: ['REDIS_HOST=Redis-0-0',`REDIS_PORT=${portNumber}`, `REDIS_PASSWORD=${masterAuth}`, 'USE_REDIS=true' ],
      command: ['sh', '-c', 'sleep 10 && npm start'], 
      networks: ['redis-cluster']
  }

  
  for (let i = 0; i < shards; i++) {
    for (let j = 0; j < replicas; j++) {
      let serviceName = `redis-${i}-${j}`;
      let masterServiceName = `redis-${i}-0`;
      
      // Construct the content for redis.conf
      let redisConfigContent = `port ${port}
daemonize ${daemonize}
loglevel ${loglevel}
timeout ${timeout}
save ${saveSeconds} ${saveChanges}
appendonly ${appendonly}
appendfsync ${appendfsync}
rdbcompression ${rdbcompression}
rdbchecksum ${rdbchecksum}
replica-serve-stale-data ${replicaServeStaleData}
maxmemory ${maxmemory}
maxmemory-policy ${maxmemoryPolicy}
masterauth ${masterAuth}
requirepass ${masterAuth}
cluster-enabled yes
cluster-config-file nodes.conf
bind 0.0.0.0`;



      // The first config file is for a master node and does not have the replicaof property
      // if (j !== 0) redisConfigContent += `replicaof ${masterServiceName} ${port - j}\n`;


      // Write each redis configuration file to the output folder
      let outputFile = path.join(outputDir, `redis-${i}-${j}.conf`);
      fs.writeFile(outputFile, redisConfigContent, (err: Error) => {
          if (err) {
              console.error('Error writing redis.conf file(s):', err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
          redisFilesWritten++;
          // Check if the required number of files have been written before responding to the client
          if (redisFilesWritten === redisFilesToWrite) {
              // Write the require docker-compose.yml file
              const dockerComposeFile = path.join(outputDir, 'docker-compose.yml');
              fs.writeFile(dockerComposeFile, yaml.dump(dockerCompose), (err: Error) => {
                  if (err) {
                      console.error('Error writing docker-compose.yml file:', err);
                  }
                  res.status(200).json({ message: `All configuration files written successfully to path: ${outputDir}` });
              });
          }
        });

        // Define volume(s) to ensure data persistence after docker containers are stopped and removed.
        const volumeName = `redis-${i}-${j}-data`;

        // Add each redis instance to the docker-compose configuration
        dockerCompose.services[`redis-${i}-${j}`] = {
            image: 'redis:latest',
            container_name: serviceName,
            volumes: [
                `./redis-${i}-${j}.conf:/usr/local/etc/redis/redis.conf`,
                `${volumeName}:/data`
            ],
            command: `redis-server /usr/local/etc/redis/redis.conf`,
            ports: [`${port}:${port - j}`],
            networks: {'redis-cluster': {'ipv4_address': `172.20.0.${i+1}${j}`}}
        };

        // Add volume to the volumes section of the docker-compose file
        dockerCompose.volumes[volumeName] = {};

        // Increment port number as each Redis instance will run on a different port
        port++;
      }
    }
    // res.status(200)

    next();
  };

  module.exports = fileGenerationController;