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

  const bashScript: string = `#!/bin/bash
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
};

bashScriptController.buildRedisImage = (req: Request, res: Response, next: NextFunction) => {
  const bashScript = `docker build -t redis-node:latest -f ../../../dockerfile-redis .`;
  const outputDir = path.join(__dirname, '../output/bash-scripts');

  fs.writeFile(`${outputDir}/buildRedisImage.sh`, bashScript, (err: Error) => {
    if (err) {
      console.error('Error writing bash script:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Bash script written successfully');
    next();
  });
};

bashScriptController.createUserDataScript = (req: Request, res: Response, next: NextFunction) => {

  const {
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
  

  const bashScript = `#!/bin/bash
# download redis
sudo apt-get update
sudo apt-get install redis-server -y
redis-server --protected-mode ${protectedMode} --port ${portNumber} --masterauth ${masterAuth} --requirepass ${requirePass} --daemonize ${daemonize} --loglevel ${loglevel} --timeout ${timeout} --save ${saveSeconds} ${saveChanges} --appendonly ${appendonly} --appendfsync ${appendfsync} --rdbcompression ${rdbcompression} --rdbchecksum ${rdbchecksum} --replica-serve-stale-data ${replicaServeStaleData} --maxmemory ${maxmemory} --maxmemory-policy ${maxmemoryPolicy}
`
  
    const outputDir = path.join(__dirname, '../output/bash-scripts');
  
    fs.writeFile(`${outputDir}/userDataScript.sh`, bashScript, (err: Error) => {
      if (err) {
        console.error('Error writing bash script:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log('Bash script written successfully');
      next();
    });
};

bashScriptController.createSecurityGroupScript = (req: Request, res: Response, next: NextFunction) => {
  const { vpcID } = req.body;
  const outputDir = path.join(__dirname, '../output/bash-scripts');

  const bashScript = `#!/bin/bash
GROUP_OUTPUT=$(aws ec2 create-security-group --description "Security group for Redis nodes" --vpc-id ${vpcID} --group-name "redis-security-group")
GROUP_ID=$(echo $GROUP_OUTPUT | jq -r '.GroupId')

JSON_OUTPUT=$(jq -n \
  --arg group_id "$GROUP_ID" \
  '{ GroupId: $group_id }')

# Write JSON output to file
echo "$JSON_OUTPUT" > "server/output/AWSIDs.json"

RULE1=$(aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 6379 --cidr 0.0.0.0/0)
RULE2=$(aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 16379 --cidr 0.0.0.0/0)
RULE3=$(aws ec2 authorize-security-group-ingress --group-id $GROUP_ID --protocol tcp --port 22 --cidr 0.0.0.0/0)


`
  fs.writeFile(`${outputDir}/createSecurityGroup.sh`, bashScript, (err: Error) => {
    if (err) {
      console.error('Error writing bash script:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('Bash script written successfully');
    next();
  });
};



module.exports = bashScriptController;

