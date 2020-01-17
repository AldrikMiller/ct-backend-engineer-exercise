// This rule is disabled in this file because the Etsy API uses snake_case instead of camelCase.
/* eslint-disable camelcase */

import axios from 'axios';
import 'dotenv/config';

const { ETSY_API_KEY } = process.env;

/**
 * Removes unused information from the listings' JSON.
 *
 * @param {Object[]} rawListings - Unmodified listings from the Etsy API.
 *
 * @returns {Object} An object with listing IDs as keys and listing titles as vaules.
 */
export const transformListings = (rawListings) => (
  rawListings.reduce((result, listing) => {
    const { listing_id, title } = listing;

    return {
      ...result,
      [listing_id]: title,
    };
  }, {})
);

/**
 * Retrieves all the active listings for a given Etsy shop.
 *
 * @param {number} shopID
 * @param {number} [page = 1] - Used for recursively requesting additional listings if the given
 * shop has more listings than the limit (set to 100).
 * @param {Object[]} [initialListings = []] - Used for passing the prior iteration's listings
 * to the next iteration if recursion is required to retrieve all listings for a given shop.
 *
 * @returns {Object} An object containing an array of all a shop's listings and the shop's ID.
 */
const fetchShopActiveListings = async (shopID, page = 1, initialListings = []) => {
  try {
    const newListings = await axios.get(
      'https://openapi.etsy.com/v2/' // base URI
      + `shops/${shopID}/listings/active` // resource route
      + `?page=${page}&api_key=${ETSY_API_KEY}`, // params
    );

    const { pagination, results } = newListings.data;

    const accumulatedListings = [...initialListings, ...results];

    if (pagination.next_page) {
      return fetchShopActiveListings(shopID, pagination.next_page, accumulatedListings);
    }

    return { listings: transformListings(accumulatedListings), shopID };
  } catch (err) {
    return console.log(err);
  }
};

export default fetchShopActiveListings;
