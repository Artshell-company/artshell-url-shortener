import 'babel-polyfill'
import shortid from 'shortid';
import shortyRepository from './shortyRepository';
import parseUrl from './parseUrl';

const findOrCreateShortId = async (url) => {
  let id = await shortyRepository.findExistingShortId(url);
  if (!id) {
    id = shortid.generate();
    await shortyRepository.createShortenedUrl(id, url);
  }
  return { url, id };
};

module.exports.shorten = async (event, context, callback) => {
  const url = parseUrl(event);
  if (!url) {
    callback(null, { statusCode: 400, body: JSON.stringify({ error: "need a JSON payload with a valid 'url' parameter"}) })
    return;
  }
  const item = await findOrCreateShortId(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      originalUrl: url,
      id: item.id,
      url: `https://${event.headers.Host}/r/${item.id}`
    }),
  });
};

module.exports.resolve = async (event, context, callback) => {
  const id = event.pathParameters.id;
  const url = await shortyRepository.findUrl(id);
  if (!url) {
    callback(null, {
      statusCode: 404,
      body: JSON.stringify({
        error: `no URL found for '${id}'`
      }),
    });
    return;
  }
  callback(null, {
    statusCode: 302,
    body: '',
    headers: {
      Location: url,
    },
  });
};
