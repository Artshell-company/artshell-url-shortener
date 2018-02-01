import parseUrl from './parseUrl';
import shortyRepository from './shortyRepository';

export default async (event, context, callback) => {
  const url = parseUrl(event);
  if (!url) {
    callback(null, { statusCode: 400, body: JSON.stringify({ error: "need a JSON payload with a valid 'url' parameter" }) })
    return;
  }
  const item = await shortyRepository.findOrCreateShortId(url);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      originalUrl: url,
      id: item.id,
      url: `https://${event.headers.Host}/r/${item.id}`
    }),
  });
};
