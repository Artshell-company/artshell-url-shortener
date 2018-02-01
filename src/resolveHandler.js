import shortyRepository from './shortyRepository';

export default async ({ pathParameters: { id } }, context, callback) => {
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
