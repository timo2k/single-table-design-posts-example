import {
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { getClient } from '../database/client';
import { Post } from '../models/post.model';

export const createPost = async (post: Post): Promise<Post> => {
  const client = getClient();
  try {
    await client.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: post.toItem(),
        ConditionExpression: 'attribute_not_exists(PK)',
      })
    );
    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getPost = async (email: string, postId: string): Promise<Post> => {
  const client = getClient();
  const post = new Post(email, '', '', postId);

  try {
    const resp = await client.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: post.keys(),
      })
    );

    return Post.fromItem(resp.Item);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const listPostsFromUser = async (email: string): Promise<Post[]> => {
  const client = getClient();
  const post = new Post(email, '', '');

  try {
    const resp = await client.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: post.pk },
        },
        ScanIndexForward: false,
      })
    );

    return resp.Items!.map((item) => Post.fromItem(item));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const listAllPosts = async (): Promise<Post[]> => {
  const client = getClient();
  const post = new Post('', '', '');

  try {
    const resp = await client.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :gsi1pk',
        ExpressionAttributeValues: {
          ':gsi1pk': { S: post.gsi1pk },
        },
      })
    );

    console.log('ITEMS');
    console.log(resp.Items);

    return resp.Items!.map((item) => Post.fromItem(item));
  } catch (error) {}
  throw new Error();
};
