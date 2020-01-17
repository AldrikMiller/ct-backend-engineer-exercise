/* eslint-disable no-undef */
import mock from 'mock-fs';

import checkIfFileExists from '../core/check-if-file-exists';

describe('checkIfFileExists', () => {
  beforeEach(() => {
    mock({
      'item-listings/123456.json': '{ "content": "hello, test world!" }',
    });
  });

  afterEach(mock.restore);

  it('should return true if a given file exists', async () => {
    const data = await checkIfFileExists(123456);
    expect(data).toBe(true);
  });

  it('should return false if a given file does not exist', async () => {
    const data = await checkIfFileExists(654321);
    expect(data).toBe(false);
  });
});
