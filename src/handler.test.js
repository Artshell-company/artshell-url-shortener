import { expect } from 'chai';
const handler = require('./handler');

describe('handler', () => {
  it('exposes the shorten function', () => {
    expect(handler.shorten).to.be.a('function');
  });

  it('exposes the resolve function', () => {
    expect(handler.resolve).to.be.a('function');
  });
});
