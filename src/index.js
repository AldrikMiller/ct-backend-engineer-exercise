import pipeShopListings from './core/pipe-shop-listings';
import outputDiffReport from './core/output-diff-report';

/**
 * Generates a report of differences in given Etsy shops' listings from the last time a report was
 * requested for a given shop.
 *
 * @param {number[]} shopIDs - An array containing the shop IDs to generate a report for.
 *
 * @returns {Function} Outputs the report to the console.
 */
const generateReport = async (shopIDs) => {
  try {
    const results = await Promise.all(
      shopIDs.map((shopID) => pipeShopListings(shopID)),
    );

    return outputDiffReport(results);
  } catch (err) {
    console.log(err);
  }
};

export default generateReport;

const testShopIDs = [
  22121623,
  22125767,
  22126053,
  22136219,
  22135823,
  22137381,
];

generateReport(testShopIDs);
