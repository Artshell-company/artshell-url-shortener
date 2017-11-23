import 'babel-polyfill'
import AWS from 'aws-sdk';
import Promise from 'bluebird';
import shortid from 'shortid';
import normalizeUrl from 'normalize-url';

const dynamo = Promise.promisifyAll(new AWS.DynamoDB.DocumentClient());
const normalizeOpts = {
  stripFragment: false,
  stripWWW: false,
};
const urlsByShortIdTable = process.env.urls_by_shortid_table;
const shortIdsByUrlTable = process.env.shortids_by_url_table;

const parseUrl = (event) => {
  try {
    const url = JSON.parse(event.body).url;
    return url && url.length > 0 ? normalizeUrl(url, normalizeOpts) : null;
  } catch (_e) {
    return null;
  }
};

const findExistingShortId = async (url) => {
  const { Item } = await dynamo.getAsync({ TableName: shortIdsByUrlTable, Key: { url } });
  return Item ? { id: Item.id, url } : null;
};

const createShortenedUrl = async (url) => {
  const item = {
    url,
    id: shortid.generate(),
  };
  await dynamo.putAsync({ TableName: urlsByShortIdTable, Item: item });
  await dynamo.putAsync({ TableName: shortIdsByUrlTable, Item: item });
  return item;
};

module.exports.shorten = async (event, context, callback) => {
  const url = parseUrl(event);
  if (!url) {
    callback(null, { statusCode: 400, body: JSON.stringify({ error: "need a JSON payload with a valid 'url' parameter"}) })
    return;
  }
  let item = (await findExistingShortId(url)) || (await createShortenedUrl(url));
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      originalUrl: url,
      id: item.id,
      url: `https://${event.headers.Host}/r/${item.id}`
    }),
  });
};

const findUrl = async (id) => {
  const { Item } = await dynamo.getAsync({ TableName: urlsByShortIdTable, Key: { id }});
  return Item ? Item.url : null;
};

module.exports.resolve = async (event, context, callback) => {
  const id = event.pathParameters.id;
  const Location = await findUrl(event.pathParameters.id);
  if (!Location) {
    callback(null, { statusCode: 404, body: JSON.stringify({ error: `no URL found for '${id}'`}) });
    return;
  }
  callback(null, { statusCode: 302, body: '', headers: { Location } });
};
