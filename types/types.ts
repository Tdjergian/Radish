export interface DockerComposeFile {
  version: string;
  services: Record<string, Service>; // Services with string keys and Service values
  volumes?: Record<string, unknown>; // Volumes with string keys and unknown values
  networks?: Record<string, Network>; // Networks with string keys and Network values
}

export interface Service {
  image?: string;
  build?: string | Build;
  ports?: string[];
  environment?: Record<string, string> | string[];
  volumes?: string[];
  networks?: string[] | Record<string, unknown>;
  [key: string]: unknown; // for additional properties
}

export interface Build {
  context: string;
  dockerfile?: string;
  args?: Record<string, string>;
  [key: string]: unknown; // for additional properties
}

export interface Network {
  driver: string;
  ipam?: Ipam;
  [key: string]: unknown; // for additional properties
}

export interface Ipam {
  config: Array<{ subnet: string }>;
  [key: string]: unknown; // for additional properties
}

export interface TaskDefinition {
  family: string;
  networkMode: string;
  ContainerDefinitions: any[];
  volumes: any[];
}

export interface ContainerDefinition {
  name: string;
  image: string;
  memory: number;
  cpu: number;
  essential: boolean;
  command: string[];
  portMappings: PortMapping[];
  mountPoints: MountPoint[];
}

export interface PortMapping {
  containerPort: number;
  hostPort: number;
  protocol: string;
}

export interface MountPoint {
  sourceVolume: string;
  containerPath: string;
}

export interface Ec2Instance {
  instanceType: string;
  imageId: string;
  keyName: string;
  subnetId: string;
  securityGroupIds: string[];
}

export type Ec2ClusterDataState = Record<string, Ec2Instance>;



// Example dockerCompose object

export interface MemoryData {
  usedMemory: number;
  peakUsedMemory: number;
}

export interface CPUData {
  usedCPU: number;
}