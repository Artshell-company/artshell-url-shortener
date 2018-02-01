import { expect } from 'chai';
import Promise from 'bluebird';
import shortyRepository from './shortyRepository';
import dynamodb from 'serverless-dynamodb-client';

const dynamo = Promise.promisifyAll(dynamodb.doc);

describe('shortyRepository', () => {
  describe('::findShortId', () => {
    it('returns null if no shorty has been generated for the given url', async () => {
      const result = await shortyRepository.findShortId('https://www.mikamai.com');
      expect(result).to.be.null;
    });

    it('returns the short id', async () => {
      await dynamo.putAsync({
        TableName: shortyRepository.shortIdsByUrlTable,
        Item: { id: 'asd', url: 'https://www.mikamai.com' },
      });
      const result = await shortyRepository.findShortId('https://www.mikamai.com');
      expect(result).to.eq('asd');
    });
  });

  describe('::findUrl', () => {
    it('returns null if the given shorty id cannot be found', async () => {
      const result = await shortyRepository.findUrl('asd');
      expect(result).to.be.null;
    })

    it('returns the url shortened with the given short id', async () => {
      await dynamo.putAsync({
        TableName: shortyRepository.urlsByShortIdTable,
        Item: { id: 'asd', url: 'https://www.mikamai.com' },
      });
      const result = await shortyRepository.findUrl('asd');
      expect(result).to.eq('https://www.mikamai.com');
    });
  });

  describe('::createShortenedUrl', () => {
    it('returns a shorty', async () => {
      const result = await shortyRepository.createShortenedUrl('asd', 'https://www.mikamai.com');
      expect(result.id).to.eq('asd');
      expect(result.url).to.eq('https://www.mikamai.com');
      expect(result.createdAt).to.be.a('date');
    });

    it('stores the item for url lookup', async () => {
      await shortyRepository.createShortenedUrl('asd', 'https://www.mikamai.com');
      const result = await dynamo.getAsync({
        TableName: shortyRepository.shortIdsByUrlTable,
        Key: { url: 'https://www.mikamai.com' },
      });
      expect(result.Item.id).to.eq('asd');
    });

    it('stores the item for id lookup', async () => {
      await shortyRepository.createShortenedUrl('asd', 'https://www.mikamai.com');
      const result = await dynamo.getAsync({
        TableName: shortyRepository.urlsByShortIdTable,
        Key: { id: 'asd' },
      });
      expect(result.Item.url).to.eq('https://www.mikamai.com');
    });
  });

  describe('::findOrCreateShortId', () => {
    it('returns an existing shorty if it already exists', async () => {
      await dynamo.putAsync({
        TableName: shortyRepository.shortIdsByUrlTable,
        Item: { id: 'asd', url: 'https://www.mikamai.com' },
      });
      const result = await shortyRepository.findOrCreateShortId('https://www.mikamai.com');
      expect(result.id).to.eq('asd');
    });

    it('creates a new shorty if there is none', async () => {
      const item = await shortyRepository.findOrCreateShortId('https://www.mikamai.com');
      const result = await dynamo.getAsync({
        TableName: shortyRepository.urlsByShortIdTable,
        Key: { id: item.id },
      });
      expect(result.Item.url).to.eq('https://www.mikamai.com');
    });
  });
});
