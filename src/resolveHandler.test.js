import { expect } from 'chai';
import Promise from 'bluebird';
import shortyRepository from './shortyRepository';
import resolveHandler from './resolveHandler';

describe('resolve handler', () => {
  it('redirects the user to the full url', async () => {
    await shortyRepository.createShortenedUrl('asd', 'https://www.mikamai.com');
    await resolveHandler({ pathParameters: { id: 'asd' }}, {}, (_err, { statusCode, body, headers }) => {
      expect(statusCode).to.eq(302);
      expect(headers.Location).to.eq('https://www.mikamai.com');
    });
  });

  it('raises a 404 if no id can be found', async () => {
    await resolveHandler({ pathParameters: { id: 'asd' }}, {}, (_err, { statusCode }) => {
      expect(statusCode).to.eq(404);
    });
  });
});
