import dynamodb from 'serverless-dynamodb-client';
import Promise from 'bluebird';

const dynamo = Promise.promisifyAll(dynamodb.doc);
const urlsByShortIdTable = process.env.urls_by_shortid_table;
const shortIdsByUrlTable = process.env.shortids_by_url_table;

export const findExistingShortId = async (url) => {
  const { Item } = await dynamo.getAsync({
    TableName: shortIdsByUrlTable,
    Key: { url },
  });
  return Item ? Item.id : null;
};

export const findUrl = async (id) => {
  const { Item } = await dynamo.getAsync({
    TableName: urlsByShortIdTable,
    Key: { id },
  });
  return Item ? Item.url : null;
};

export const createShortenedUrl = async (id, url) => {
  const item = { id, url };
  await dynamo.putAsync({ TableName: urlsByShortIdTable, Item: item });
  await dynamo.putAsync({ TableName: shortIdsByUrlTable, Item: item });
  return item;
};

export default {
  findExistingShortId,
  findUrl,
  createShortenedUrl,
};
