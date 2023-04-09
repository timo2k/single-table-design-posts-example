#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { RestAPIStack } from '../lib/rest-api.stack';

const app = new cdk.App();
const database = new DatabaseStack(app, 'DatabaseStack', {});
new RestAPIStack(app, 'RestApiStack', {
  postAppTable: database.postAppTable,
});
