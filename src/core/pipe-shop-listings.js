import checkIfFileExists from './check-if-file-exists';
import fetchShopActiveListings from './fetch-shop-active-listings';
import generateDiff from './generate-diff';
import writeListingsToFile from './write-listings-to-file';

/**
 * Creates a message object to be used in generating a diff report.
 *
 * @param {string} message - A message string.
 * @param {string} type - A message type string.
 * @param {number} shopID - An Etsy shop ID.
 *
 * @returns {Object} An object with the type, shop ID, and message.
 */
const createMessage = (shopID, message, type = 'system') => (
  { type, shopID, message }
);

/**
 * Fetches a given Etsy shop's listings and generates a diff if a file exists for that shop's
 * listings. Writes the updated listings to a file, overwriting the existing file if one exists.
 *
 * @param {number} shopID - A single Etsy shop's ID.
 *
 * @returns {Object} A message object.
 */
const pipeShopListings = async (shopID) => {
  try {
    const newListings = await fetchShopActiveListings(shopID);
    const fileExists = await checkIfFileExists(shopID);

    if (fileExists) {
      const diff = await generateDiff(shopID, newListings);

      writeListingsToFile(shopID, newListings);

      if (diff === 'INVALID_JSON') {
        return createMessage(shopID, 'Data was corrupted; overwriting with the latest');
      }

      if (!diff) return createMessage(shopID, 'No changes since last sync');

      return { type: 'diff', shopID, diff };
    }

    writeListingsToFile(shopID, newListings);

    return createMessage(shopID, `First sync for shop ID ${shopID}`);
  } catch (error) {
    return console.log(error);
  }
};

export default pipeShopListings;
