import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Item } from './base.model';
import { ulid } from 'ulid';

export class Post extends Item {
  email: string;
  title: string;
  content: string;
  postId: string;

  constructor(
    email: string,
    title: string,
    content: string,
    postId: string = ulid()
  ) {
    super();
    this.email = email;
    this.title = title;
    this.content = content;
    this.postId = postId;
  }

  static fromItem(item?: Record<string, AttributeValue>) {
    if (!item) throw new Error('No Item!');
    return new Post(
      item.email.S!,
      item.title.S!,
      item.content.S!,
      item.postId.S!
    );
  }

  get pk(): string {
    return `UP#${this.email}`;
  }

  get sk(): string {
    return `POST#${this.postId}`;
  }

  get gsi1pk(): string {
    return 'POST#';
  }

  get gsi1sk(): string {
    return 'POST#';
  }

  toItem(): Record<string, AttributeValue> {
    return {
      ...this.keys(),
      GSI1PK: { S: this.gsi1pk },
      GSI1SK: { S: this.gsi1sk },
      email: { S: this.email },
      postId: { S: this.postId },
      title: { S: this.title },
      content: { S: this.content },
    };
  }
}
