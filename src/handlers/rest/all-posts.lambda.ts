import { LambdaInterface } from '@aws-lambda-powertools/commons';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { listAllPosts } from '../../repositories/post.repository';

class Lambda implements LambdaInterface {
  public async handler(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    const posts = await listAllPosts();
    return {
      statusCode: 200,
      body: JSON.stringify({
        posts,
      }),
    };
  }
}

export const handlerClass = new Lambda();
export const handler = handlerClass.handler;
