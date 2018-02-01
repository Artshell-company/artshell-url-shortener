import { expect } from 'chai';
import Promise from 'bluebird';
import shortenHandler from './shortenHandler';

describe('shorten handler', () => {
  it('returns the shortened url', async () => {
    const jsonPayload = JSON.stringify({ url: 'https://www.mikamai.com' });
    const headers = { Host: 'www.artshell.eu' };
    await shortenHandler({ body: jsonPayload, headers }, {}, (_err, { statusCode, body }) => {
      const json = JSON.parse(body);
      expect(statusCode).to.eq(200);
      expect(json.originalUrl).to.eq('https://www.mikamai.com');
      expect(json.id).to.be.a('string');
      expect(json.url).to.match(/^https:\/\/www.artshell.eu\/r\/[_\-A-Za-z0-9]+$/);
    });
  });

  it('reuses existing shorties', async () => {
    const jsonPayload = JSON.stringify({ url: 'https://www.mikamai.com' });
    const headers = { Host: 'www.artshell.eu' };

    let idToCheck;
    await shortenHandler({ body: jsonPayload, headers }, {}, (_err, { _statusCode, body }) => {
      const json = JSON.parse(body);
      idToCheck = json.id;
    });
    await shortenHandler({ body: jsonPayload, headers }, {}, (_err, { _statusCode, body }) => {
      const json = JSON.parse(body);
      expect(json.id).to.eq(idToCheck);
    });
  });

  it('returns an error if no url has been provided', async () => {
    const jsonPayload = JSON.stringify({ url: '' });
    const headers = { Host: 'www.artshell.eu' };
    await shortenHandler({ body: jsonPayload, headers }, {}, (_err, { statusCode }) => {
      expect(statusCode).to.eq(400);
    });
  });
});
