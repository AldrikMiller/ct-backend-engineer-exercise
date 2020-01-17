/* eslint-disable no-undef */
import axios from 'axios';
import fetchShopActiveListings, { transformListings } from '../core/fetch-shop-active-listings';

jest.mock('axios');

const { ETSY_API_KEY } = process.env;

const responseObject = {
  data: {
    count: 4,
    results: [
      {
        listing_id: 770608215,
        state: 'active',
        user_id: 12345,
        title: 'Oak charcuterie board',
        description: 'Finished in tung oil to emphasise the beautiful grain and texturing of this Oak board.',
        quantity: 1,
      },
      {
        listing_id: 770608216,
        state: 'active',
        user_id: 12345,
        title: 'Maple charcuterie board',
        description: 'Finished in tung oil to emphasise the beautiful grain and texturing of this maple board.',
        quantity: 1,
      },
    ],
    pagination: {
      next_page: 2,
    },
  },
};

const secondResponseObject = {
  data: {
    count: 4,
    results: [
      {
        listing_id: 770608217,
        state: 'active',
        user_id: 12345,
        title: 'Ash charcuterie board',
        description: 'Finished in tung oil to emphasise the beautiful grain and texturing of this ash board.',
        quantity: 1,
      },
      {
        listing_id: 770608218,
        state: 'active',
        user_id: 12345,
        title: 'Walnut charcuterie board',
        description: 'Finished in tung oil to emphasise the beautiful grain and texturing of this walnut board.',
        quantity: 1,
      },
    ],
    pagination: {
      next_page: null,
    },
  },
};

const finalResult = {
  listings: {
    770608215: 'Oak charcuterie board',
    770608216: 'Maple charcuterie board',
    770608217: 'Ash charcuterie board',
    770608218: 'Walnut charcuterie board',
  },
  shopID: 123456,
};

describe('transformListings', () => {
  it("accepts an array of listing objects with metadata and returns a listings object with each listing's ID as a key and it's title as a property", () => {
    const data = transformListings([
      ...responseObject.data.results,
      ...secondResponseObject.data.results,
    ]);

    expect(Object.keys(data).length).toEqual(responseObject.data.count);
    expect(data).toMatchObject(finalResult.listings);
  });
});

describe('fetchShopActiveListings', () => {
  beforeEach(() => {
    axios.mockClear();

    axios.get.mockImplementationOnce(() => Promise.resolve(responseObject));
    axios.get.mockImplementationOnce(() => Promise.resolve(secondResponseObject));
  });

  it('fetches the listings for a given shop', async () => {
    await fetchShopActiveListings(123456);

    expect(axios.get).toHaveBeenCalledWith(`https://openapi.etsy.com/v2/shops/123456/listings/active?page=1&api_key=${ETSY_API_KEY}`);
  });

  it('fetches listings from all API pages', async () => {
    await fetchShopActiveListings(123456);

    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it("returns an object containing the shop's ID and an array of all the shop's listings", async () => {
    expect(await fetchShopActiveListings(123456)).toMatchObject(finalResult);
  });
});
