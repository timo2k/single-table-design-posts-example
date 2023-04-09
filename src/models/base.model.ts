import { AttributeValue } from '@aws-sdk/client-dynamodb';

export abstract class Item {
  abstract get pk(): string;
  abstract get sk(): string;

  public keys(): Record<string, AttributeValue> {
    return { PK: { S: this.pk }, SK: { S: this.sk } };
  }

  abstract toItem(): Record<string, unknown>;
}
