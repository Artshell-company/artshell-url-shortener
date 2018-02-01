import { expect } from 'chai';
import Promise from 'bluebird';
import parseUrl from './parseUrl';

describe('parseUrl helper', () => {
  it('parses and normalizes the url from a json payload in the body param', () => {
    const json = JSON.stringify({ url: 'https://www.mikamai.com/' });
    expect(parseUrl({ body: json })).to.eq('https://www.mikamai.com');
  });

  it('returns null if the json payload does not contain any url', () => {
    const json = JSON.stringify({ url: '' });
    expect(parseUrl({ body: json })).to.be.null;
  });

  it('returns null if the payload is not valid', () => {
    expect(parseUrl({ body: '--'})).to.be.null;
  })
});
