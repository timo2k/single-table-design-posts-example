import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { getClient } from '../database/client';
import { User } from '../models/user.model';

export const createUser = async (user: User): Promise<User> => {
  const client = getClient();

  try {
    await client.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: user.toItem(),
        ConditionExpression: 'attribute_not_exists(PK)',
      })
    );

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUser = async (email: string): Promise<User> => {
  const client = getClient();
  const user = new User(email, '');

  try {
    const resp = await client.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: user.keys(),
      })
    );

    return User.fromItem(resp.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
