/**
 * Parses a diff object to create the report string.
 *
 * @param {Object} diff - A diff object.
 *
 * @returns {string} The created string.
 */
const parseDiff = (diff) => {
  if (diff.kind === 'D') return `- removed ${diff.path} ${diff.lhs}`;
  if (diff.kind === 'N') return `+ added ${diff.path} ${diff.rhs}`;

  return `% edited ${diff.path} ${diff.rhs}`;
};

/**
 * Iterates over an array of messages and outputs each one to the console.
 *
 * @param {Object[]} messages - An array of message objects to iterate over.
 *
 * @returns {Function} Outputs messages to the console.
 */
const outputDiffReport = (messages) => {
  messages.forEach((message) => {
    console.log(`\nShop ID ${message.shopID}`);

    if (message.type === 'diff') {
      return message.diff.forEach((entry) => console.log(parseDiff(entry)));
    }

    return console.log(`${message.message}`);
  });
};

export default outputDiffReport;
