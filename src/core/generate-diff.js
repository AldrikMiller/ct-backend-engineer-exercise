import util from 'util';
import fs from 'fs';
import diff from 'deep-diff';

const readFileAsync = util.promisify(fs.readFile);

/**
 * Generates a diff object for a given shop's listings.
 *
 * @param {number} shopID - An Etsy shop ID.
 * @param {Object[]} newListings - An array of the newly retrieved listings for the given shop.
 *
 * @returns {Object[]} An array of diff message objects.
 */
const generateDiff = async (shopID, newListings) => {
  const oldListings = await readFileAsync(`item-listings/${shopID}.json`, 'utf8');

  const parsedOldListings = JSON.parse(oldListings);

  if (!parsedOldListings) {
    return 'INVALID_JSON';
  }

  return diff(parsedOldListings.listings, newListings.listings);
};

export default generateDiff;
