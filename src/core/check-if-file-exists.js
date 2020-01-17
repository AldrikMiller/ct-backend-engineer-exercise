import util from 'util';
import fs from 'fs';

const accessAsync = util.promisify(fs.access);

const checkIfFileExists = async (shopID) => {
  try {
    const exists = await accessAsync(`item-listings/${shopID}.json`, fs.constants.R_OK);

    return !exists;
  } catch (err) {
    return false;
  }
};

export default checkIfFileExists;
