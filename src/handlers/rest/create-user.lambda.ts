import { LambdaInterface } from '@aws-lambda-powertools/commons';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { User } from '../../models/user.model';
import { createUser } from '../../repositories/user.repositroy';

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

    if (!item['email'] || !item['password']) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'email or password is missing',
        }),
      };
    }

    const user = new User(item['email'], item['password']);
    await createUser(user);
    return {
      statusCode: 200,
      body: JSON.stringify({
        user,
      }),
    };
  }
}

export const handlerClass = new Lambda();
export const handler = handlerClass.handler;
