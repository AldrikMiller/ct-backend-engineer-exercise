import util from 'util';
import fs from 'fs';
import diff from 'deep-diff';

const readFileAsync = util.promisify(fs.readFile);

/**
 * Validates a string as JSON.
 *
 * @param {string} jsonString - A string to validate as JSON.
 *
 * @returns {Object|false} A valid JSON object if validation was successful, or false if not.
 */
const validateJSON = (jsonString) => {
  try {
    const result = JSON.parse(jsonString);

    /**
     * This conditional is to handle non-exception-throwing cases.
     *
     * For example, neither JSON.parse(true) or JSON.parse(123) will throw an error, not they are
     * not valid JSON for the purposes of our comparison. In addition, JSON.parse(null) returns
     * null, and typeof null === 'object', so we need to check for truthiness as well.
     */
    if (result && typeof result === 'object') {
      return result;
    }

    return false;
  } catch (err) {
    return false;
  }
};

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

  const parsedOldListings = validateJSON(oldListings);

  if (!parsedOldListings) {
    return 'INVALID_JSON';
  }

  return diff(parsedOldListings.listings, newListings.listings);
};

export default generateDiff;
