import { LambdaInterface } from '@aws-lambda-powertools/commons';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Post } from '../../models/post.model';
import { createPost } from '../../repositories/post.repository';

class Lambda implements LambdaInterface {
  public async handler(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'event body is missing',
        }),
      };
    }

    const item =
      typeof event.body == 'object' ? event.body : JSON.parse(event.body);

    if (!item['email'] || !item['title'] || !item['content']) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'incomplete body',
        }),
      };
    }

    const post = new Post(item['email'], item['title'], item['content']);
    await createPost(post);
    return {
      statusCode: 200,
      body: JSON.stringify({
        post,
      }),
    };
  }
}

export const handlerClass = new Lambda();
export const handler = handlerClass.handler;
