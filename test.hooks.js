import dynamodb from 'serverless-dynamodb-client';
import Promise from 'bluebird';

const dynamo = Promise.promisifyAll(dynamodb.raw);

beforeEach(async () => {
  // if you change this, remember to also change the tables definitions in serverless.yml
  await dynamo.createTableAsync({
    TableName: process.env.URLS_BY_SHORTID_TABLE,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });
  await dynamo.createTableAsync({
    TableName: process.env.SHORTIDS_BY_URL_TABLE,
    KeySchema: [
      { AttributeName: 'url', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'url', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });
});
afterEach(async () => {
  await dynamo.deleteTableAsync({ TableName: process.env.URLS_BY_SHORTID_TABLE });
  await dynamo.deleteTableAsync({ TableName: process.env.SHORTIDS_BY_URL_TABLE });
});
