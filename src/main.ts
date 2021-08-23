import { InstanceClass, InstanceSize, InstanceType } from '@aws-cdk/aws-ec2';
import { EndpointAccess, KubernetesVersion, MachineImageType } from '@aws-cdk/aws-eks';
import { PostgresEngineVersion } from '@aws-cdk/aws-rds';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as kong from '../../kong-control-plane/src/eks-index';


export class KongCpEks extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new kong.KongEks(this, 'KongEksCp', {
      controlPlaneClusterProps: {
        clusterName: 'kong-cp',
        version: KubernetesVersion.V1_20,
        defaultCapacity: 0,
        endpointAccess: EndpointAccess.PUBLIC_AND_PRIVATE,
      },
      controlPlaneNodeProps: {
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
        machineImageType: MachineImageType.AMAZON_LINUX_2,
        minCapacity: 2,
      },
      rdsProps: {
        postgresversion: PostgresEngineVersion.VER_12_7,
        databasename: 'kongdb',
        username: 'kongadmin',
      },
    });

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-west-2',
  // process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new KongCpEks(app, 'kong-cp', { env: devEnv });
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();