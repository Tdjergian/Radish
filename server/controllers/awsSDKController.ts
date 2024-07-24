const aws = require('aws-sdk');
import { Request, Response, NextFunction } from 'express';

const awsSDKController: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {};

awsSDKController.configureSDK = (req: Request, res: Response, next: NextFunction) => {
  const { region, publicAccessKey, secretAccessKey } = req.body;

  aws.config.update({ 
    region: region, 
    accessKeyId: publicAccessKey,
    secretAccessKey: secretAccessKey
  });

  next();
};

awsSDKController.createSecurityGroup = async (req: Request, res: Response, next: NextFunction) => {
  aws.config.update({ region: 'us-west-2', accessKeyId: process.env.TOM_PUBLIC_KEY, secretAccessKey: process.env.TOM_SECRET_KEY})

  const { 
    vpcID
    } = req.body;

  const ec2 = new aws.EC2();

 
  const securityGroupParams: {Description: string; GroupName: string; VpcId: String} = {
    Description: 'Security group for Redis Cluster',
    GroupName: 'RedisClusterSecurityGroup-test1',
    VpcId: vpcID
  };

  try {
    const newSecurityGroup = await ec2.createSecurityGroup(securityGroupParams).promise();
    console.log('group id: ', newSecurityGroup.GroupId);
    const groupId: String = newSecurityGroup.GroupId;
    const securityGroupRulesParam = {
      GroupId: groupId,
      IpPermissions: [
        {
          IpProtocol: 'tcp',
          FromPort: 6379,
          ToPort: 6379,
          IpRanges: [
            {
              CidrIp: '0.0.0.0/0'
            }
          ]
        }, 
        {
          IpProtocol: 'tcp',
          FromPort: 16379,
          ToPort: 16379,
          IpRanges: [
            {
              CidrIp: '0.0.0.0/0'
            }
          ]
        },
        {
          IpProtocol: 'tcp',
          FromPort: 22,
          ToPort: 22,
          IpRanges: [
            {
              CidrIp: '0.0.0.0/0'
            }
          ]
        },

      ]
    };

    const newSecurityGroupRules = await ec2.authorizeSecurityGroupIngress(securityGroupRulesParam).promise();

    res.locals.securityGroupId = groupId;
    next();

  } catch (err) {
    console.log(err);
    next(err)
  }

};

awsSDKController.launchEC2s = async (req: Request, res: Response, next: NextFunction) => {
  const {
    subnetID,
    vpcID,
    region,
    instanceType,
    keyPairName,
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

  // This is the script for when the instances are launched. downloads redis and starts the server
  const redisStartupScript = `#!/bin/bash
sudo yum update
sudo amazon-linux-extras install redis6 -y
sleep 30
redis-server --cluster-enabled yes --protected-mode no --port 6379 --cluster-config-file nodes.conf --requirepass ${requirePass} --daemonize ${daemonize} --loglevel ${loglevel} --timeout ${timeout} --save ${saveSeconds} ${saveChanges} --appendonly ${appendonly} --appendfsync ${appendfsync} --rdbcompression ${rdbcompression} --rdbchecksum ${rdbchecksum} --replica-serve-stale-data ${replicaServeStaleData} --maxmemory ${maxmemory} --maxmemory-policy ${maxmemoryPolicy}`

  const ec2 = new aws.EC2();

  // These parameters set up the EC2 instancdes to be networked through the security group and subnet
  const ec2Params = {

    ImageId: 'ami-0323ead22d6752894',
    InstanceType: instanceType,
    KeyName: keyPairName,
    MinCount: shards * (replicas+1),
    MaxCount: shards * (replicas+1),
    UserData: Buffer.from(redisStartupScript).toString('base64'),

    NetworkInterfaces: [{
      Groups: [res.locals.securityGroupId],
      DeviceIndex: 0,
      AssociatePublicIpAddress: true,
      SubnetId: subnetID,
    }]
  };

  try {

    const ec2Data = await ec2.runInstances(ec2Params).promise();
    // gets a list of all the instances crfeated
    const instances = ec2Data.Instances;

    //grabs all the instance ids
    const isntanceIds = instances.map((instance: any) => {console.log('instance: ', instance.InstanceId); return instance.InstanceId});

    const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));

    //waits for instances to be ready to be described to get their ips
    await sleep(shards * (replicas+1) * 2000);

    //gets the the details of the instances to grab the IPs
    const IPData = await ec2.describeInstances({InstanceIds: isntanceIds}).promise();

    const ips = IPData.Reservations[0].Instances.map((instance: any) => {return instance.PublicIpAddress});

    console.log('ips: ', ips);

  
    const waitForStatuspararms = {
      InstanceIds: isntanceIds
    };
    console.log('waiting for instances to start')
    //we need to wait for all the instances to be fully running and for the startup commands to download and start
    //redis to be finished, so this waits for the status to be ok on all instances
    await ec2.waitFor('instanceStatusOk', waitForStatuspararms).promise();
    console.log('instances are running')

    //Now we are going to start an additional isntance that will actually run the cluster command so the user 
    //doesn't have to ssh into an isntance themselves
    const runClusterScript = `
    #!/bin/bash
    sudo yum update
    sudo amazon-linux-extras install redis6 -y
    sleep 30
    echo "yes" | redis-cli --cluster create ${ips.map((ip: string, index: number) => `${ip}:6379`).join(' ')} --cluster-replicas ${replicas} -a ${requirePass}
    `
    console.log('runClusterScript: ', runClusterScript)

    const starterEc2Params = {
      ImageId: 'ami-0323ead22d6752894',
      InstanceType: instanceType,
      KeyName: keyPairName,
      MinCount: 1,
      MaxCount: 1,
      UserData: Buffer.from(runClusterScript).toString('base64'),

      NetworkInterfaces: [{
        Groups: [res.locals.securityGroupId],
        DeviceIndex: 0,
        AssociatePublicIpAddress: true,
        SubnetId: subnetID,
      }]
    };

    const starterEc2Data = await ec2.runInstances(starterEc2Params).promise();
    console.log('starter data: ', starterEc2Data);
    const starterInstanceId = starterEc2Data.Instances[0].InstanceId; 

       //wait for the script to be run
    // await ec2.waitFor('instanceStatusOk', {InstanceIds: [starterInstanceId]}).promise();

       //since we just needed this node to start the cluster, we can just get rid of it when we're done
    // ec2.stopInstances({InstanceIds: [starterInstanceId]}).promise();




    
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }

};

awsSDKController.testIPRequest = async (req: Request, res: Response, next: NextFunction) => {
  aws.config.update({ region: 'us-west-2', accessKeyId: process.env.TOM_PUBLIC_KEY , secretAccessKey: process.env.TOM_SECRET_KEY})

  const ec2 = new aws.EC2();

  const IPData = await ec2.describeInstances({InstanceIds: ['i-09c6c2c82720f3604', 'i-0c02391dd4d28928a', 'i-0b91f3040aae8587b']}).promise();
  // console.log('ip data: ', IPData)
  // console.log('Instances: ', IPData.Reservations[0].Instances)
  // console.log( 'networkInterfaces: ', IPData.Reservations[0].Instances[0].NetworkInterfaces )
  const ips = IPData.Reservations[0].Instances.map((instance: any) => {return instance.PublicIpAddress});

  // console.log('ips: ', ips);
  res.locals.ips = ips;
  next();
};

module.exports = awsSDKController;