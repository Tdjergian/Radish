import { Request, Response, NextFunction } from 'express';
const fs = require('fs');
const path = require('path'); 

const bashScriptController: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {};

bashScriptController.pushImagetoECR = (req: Request, res: Response, next: NextFunction) => {
  let { 
    region,
    accountNumber,
    repositoryName,
    imageTag
  } = req.body;

  const bashScript = `#!/bin/bash
# Define variables
region=${region}
accountNumber=${accountNumber}
repositoryName=${repositoryName}
# Login to ECR
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $accountNumber.dkr.ecr.$region.amazonaws.com
# Tag the image
docker tag $repositoryName:latest $accountNumber.dkr.ecr.$region.amazonaws.com/$repositoryName:latest
# Push the image
docker push $accountNumber.dkr.ecr.$region.amazonaws.com/$repositoryName:latest
# Logout of ECR
docker logout $accountNumber.dkr.ecr.$region.amazonaws.com
  `;

  const outputDir = path.join(__dirname, '../output/bash-scripts');

  fs.writeFile(`${outputDir}/pushImageToECR.sh`, bashScript, (err: Error) => {
    if (err) {
      console.error('Error writing bash script:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Bash script written successfully');
    next();
  });
}

bashScriptController.buildRedisImage = (req: Request, res: Response, next: NextFunction) => {
  const bashScript = `docker build -t customer-redis:latest -f ../output/RedisDockerfile .`;
  const outputDir = path.join(__dirname, '../output/bash-scripts');

  fs.writeFile(`${outputDir}/buildRedisImage.sh`, bashScript, (err: Error) => {
    if (err) {
      console.error('Error writing bash script:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Bash script written successfully');
    next();
  });
}

module.exports = bashScriptController;

