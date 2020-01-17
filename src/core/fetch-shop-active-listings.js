/**
 * This rule is disabled in this file because we can't generate all the promises necessary to fetch
 * all listings for a given Etsy shop without iterating on the URI due to pagination.
 */
/* eslint-disable no-await-in-loop */

// This rule is disabled in this file because the Etsy API uses snake_case instead of camelCase.
/* eslint-disable camelcase */

import axios from 'axios';
import 'dotenv/config';

const { ETSY_API_KEY } = process.env;

/**
 * An ES6 generator that retrieves all the active listings for a given Etsy shop.
 *
 * @param {number} shopID - An Etsy shop ID to fetch listings for.
 *
 * @yields {Object} A single listing object.
 */
async function* fetchShopActiveListings(shopID) {
  let page = 1;

  let url = `https://openapi.etsy.com/v2/shops/${shopID}/listings/active?api_key=${ETSY_API_KEY}&page=${page}`;

  while (url) {
    const response = await axios(url);

    const listings = await response.data.results;

    const { next_page } = await response.data.pagination;

    for (const listing of listings) {
      yield { listing_id: listing.listing_id, title: listing.title };
    }

    if (next_page) {
      page = next_page;
    } else {
      url = null;
    }
  }
}

export default fetchShopActiveListings;
