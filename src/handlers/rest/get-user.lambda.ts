import { LambdaInterface } from '@aws-lambda-powertools/commons';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUser } from '../../repositories/user.repositroy';

class Lambda implements LambdaInterface {
  public async handler(
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> {
    const requestedItemEmail = event.pathParameters?.id;

    if (!requestedItemEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'missing email',
        }),
      };
    }

    const user = await getUser(requestedItemEmail);
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
