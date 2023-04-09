import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Item } from './base.model';

export class User extends Item {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
  }

  static fromItem(item?: Record<string, AttributeValue>) {
    if (!item) throw new Error('No Item!');
    return new User(item.email.S!, item.password.S!);
  }

  get pk(): string {
    return `USER#${this.email}`;
  }
  get sk(): string {
    return `USER#${this.email}`;
  }
  toItem(): Record<string, AttributeValue> {
    return {
      ...this.keys(),
      email: { S: this.email },
      password: { S: this.password },
    };
  }
}
