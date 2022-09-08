import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";

import { kmsCmkAlias } from "./kms";
import { trustbridgeVpcPrivateSubnetIds } from "./vpcs";

const stack = pulumi.getStack();

const MAX_DOCUMENTDB_INSTANCES = 1;

//
// Create DocumentDB Cluster
export const schemaRegistryDocumentDbMasterPassword = new random.RandomPassword(
  "schemaRegistryDocumentDbMasterPassword",
  {
    length: 16,
    special: true,
    overrideSpecial: `!#$%&*()-_=+[]{}<>:?`,
  }
);

const schemaRegistryDocumentDbSubnetGroup = new aws.docdb.SubnetGroup(
  `${stack}-schema-registry-documentdb-subnet-group`,
  {
    description: "subnet group for schemaRegistryDocumentDbCluster. Refers to `trustbridgeVpcPrivateSubnetIds`.",
    name: `${stack}-schema-registry-documentdb-subnet-group`,
    subnetIds: trustbridgeVpcPrivateSubnetIds,
    tags: {
      Name: `${stack}-schema-registry-documentdb-subnet-group`,
    },
  }
);

export const schemaRegistryDocumentDbCluster = new aws.docdb.Cluster("schemaRegistryDocumentDbCluster", {
  applyImmediately: true,
  backupRetentionPeriod: 5,
  clusterIdentifier: `${stack}-schema-registry`,
  dbSubnetGroupName: schemaRegistryDocumentDbSubnetGroup.name,
  enabledCloudwatchLogsExports: ["audit", "profiler"],
  engine: "docdb",
  kmsKeyId: kmsCmkAlias.targetKeyArn,
  masterPassword: schemaRegistryDocumentDbMasterPassword.result,
  masterUsername: "vckitMasterUser",
  preferredBackupWindow: "07:00-09:00",
  skipFinalSnapshot: true,
  storageEncrypted: true,
});

const clusterInstances: aws.docdb.ClusterInstance[] = [];
for (const range = { value: 0 }; range.value < MAX_DOCUMENTDB_INSTANCES; range.value++) {
  clusterInstances.push(
    new aws.docdb.ClusterInstance(`clusterInstances-${range.value}`, {
      identifier: `${stack}-schema-registry-docdb-instance-${range.value}`,
      clusterIdentifier: schemaRegistryDocumentDbCluster.id,
      instanceClass: "db.t3.medium",
    })
  );
}
