import dynamodb from 'serverless-dynamodb-client';
import Promise from 'bluebird';
import shortid from 'shortid';

const dynamo = Promise.promisifyAll(dynamodb.doc);

const urlsByShortIdTable = process.env.URLS_BY_SHORTID_TABLE;
const shortIdsByUrlTable = process.env.SHORTIDS_BY_URL_TABLE;

const findShortId = async (url) => {
  const { Item } = await dynamo.getAsync({
    TableName: shortIdsByUrlTable,
    Key: { url },
  });
  return Item ? Item.id : null;
};

const findUrl = async (id) => {
  const { Item } = await dynamo.getAsync({
    TableName: urlsByShortIdTable,
    Key: { id },
  });
  return Item ? Item.url : null;
};

const createShortenedUrl = async (id, url) => {
  const item = { id, url, createdAt: new Date() };
  await dynamo.putAsync({ TableName: urlsByShortIdTable, Item: item });
  await dynamo.putAsync({ TableName: shortIdsByUrlTable, Item: item });
  return item;
};

const findOrCreateShortId = async (url) => {
  let id = await findShortId(url);
  if (!id) {
    id = shortid.generate();
    await createShortenedUrl(id, url);
  }
  return { url, id };
};


export default {
  urlsByShortIdTable,
  shortIdsByUrlTable,
  findShortId,
  findUrl,
  createShortenedUrl,
  findOrCreateShortId,
};
