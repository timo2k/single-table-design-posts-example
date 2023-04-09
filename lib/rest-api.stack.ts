import { Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

export interface RestAPIProps extends StackProps {
  postAppTable: Table;
}

export class RestAPIStack extends Stack {
  constructor(scope: Construct, id: string, props?: RestAPIProps) {
    super(scope, id, props);

    const sharedLambdaProps: NodejsFunctionProps = {
      depsLockFilePath: join(__dirname, '../src/', 'package-lock.json'),
      environment: {
        TABLE_NAME: props?.postAppTable.tableName!,
      },
      runtime: Runtime.NODEJS_18_X,
    };

    const createUserFunction = new NodejsFunction(this, 'createUserFunction', {
      entry: join(__dirname, '/../src/handlers/rest/create-user.lambda.ts'),
      ...sharedLambdaProps,
    });
    const getUserFunction = new NodejsFunction(this, 'getUserFunction', {
      entry: join(__dirname, '/../src/handlers/rest/get-user.lambda.ts'),
      ...sharedLambdaProps,
    });
    const createPostFunction = new NodejsFunction(this, 'createPostFunction', {
      entry: join(__dirname, '/../src/handlers/rest/create-post.lambda.ts'),
      ...sharedLambdaProps,
    });
    const allPostsFunction = new NodejsFunction(this, 'allPostsFunction', {
      entry: join(__dirname, '/../src/handlers/rest/all-posts.lambda.ts'),
      ...sharedLambdaProps,
    });

    props?.postAppTable.grantReadWriteData(createUserFunction);
    props?.postAppTable.grantReadWriteData(getUserFunction);
    props?.postAppTable.grantReadWriteData(createPostFunction);
    props?.postAppTable.grantReadWriteData(allPostsFunction);

    const createUserIntegration = new LambdaIntegration(createUserFunction);
    const getUserIntegration = new LambdaIntegration(getUserFunction);
    const createPostIntegration = new LambdaIntegration(createPostFunction);
    const allPostsIntegration = new LambdaIntegration(allPostsFunction);

    const restApi = new RestApi(this, 'Posts-App', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    const v1 = restApi.root.addResource('v1');
    const user = v1.addResource('user');
    user.addMethod('POST', createUserIntegration);

    const singleUser = user.addResource('{id}');
    singleUser.addMethod('GET', getUserIntegration);

    const post = v1.addResource('post');
    post.addMethod('POST', createPostIntegration);
    post.addMethod('GET', allPostsIntegration);
  }
}
