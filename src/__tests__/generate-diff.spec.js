/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import mock from 'mock-fs';
import diff from 'deep-diff';

import generateDiff from '../core/generate-diff';

const mockData = {
  listings: {
    123456789: 'Test Listing Name 4',
    123456788: 'Test Listing Name 3',
    123456787: 'Test Listing Name 2',
    123456786: 'Test Listing Name 1',
  },
  shopID: 123456,
};

const mockNewData = {
  listings: {
    123456790: 'Test Listing Name 5',
    123456789: 'Test Listing Name 4',
    123456788: 'Test Listing Name 3',
    123456786: 'Test Listing Name 1 With A New Name',
  },
  shopID: 123456,
};

describe('generateDiff', () => {
  beforeEach(() => {
    mock({ 'item-listings/123456.json': JSON.stringify(mockData) });
  });

  afterEach(mock.restore);

  it('reads the existing file', async () => {
    const data = await generateDiff(123456, mockData);

    expect(data).toBeUndefined();
  });

  it("generates an array of diff message objects if the objects don't match", async () => {
    const expectedDiff = diff(mockData.listings, mockNewData.listings);

    const generatedDiff = await generateDiff(123456, mockNewData);

    expect(generatedDiff).toMatchObject(expectedDiff);
  });
});
