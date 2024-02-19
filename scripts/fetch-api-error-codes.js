const API_MESSAGES_PATH = 'lib/locales/en/frontend/api-messages.json';

const fs = require('fs/promises');
const path = require('path');

const apiMessagesEntries = Object.entries(require(`../${API_MESSAGES_PATH}`));

const BACKEND_URL = process.env.BACKEND_URL;

const fetchApiErrorCodes = async () => {
  const data = await fetch(`${BACKEND_URL}/api-messages/en`, {
    method: 'GET',
  });
  return await data.json();
};

/**
 * Compares the new codes with the old ones and detects changes (new codes, removed codes)
 * @param {*} newCodes
 */
function detectCodeChanges(newCodes) {
  const newCodesValues = Object.entries(newCodes);
  const codesAdded = newCodesValues.filter(
    ([code]) => !apiMessagesEntries.some(([oldCode]) => code === oldCode)
  );
  const codesRemoved = apiMessagesEntries.filter(
    ([oldCode]) => !newCodesValues.some(([code]) => code === oldCode)
  );

  return {
    codesAdded,
    codesRemoved,
  };
}

function syncCodes({ codesAdded, codesRemoved }) {
  return apiMessagesEntries.reduce(
    (acc, [code, message]) =>
      codesRemoved.some((codeRemoved) => codeRemoved === code)
        ? acc
        : {
            ...acc,
            [code]: message,
          },
    Object.fromEntries(codesAdded)
  );
}

async function main() {
  console.log('Fetching API Error Messages...');
  const data = await fetchApiErrorCodes();
  console.log('✅ API Error Messages fetched successfully\n');
  const { codesAdded, codesRemoved } = detectCodeChanges(data);

  // Print an alert if code changes detected
  if (codesAdded.length || codesRemoved.length) {
    console.log(
      `⚠️  API Error Codes Changes Detected, Synching the codes in '${API_MESSAGES_PATH}'...\n`
    );
    console.log('👍 Codes Added (+):');
    console.log('⚬', codesAdded.join('\n⚬ '), '\n');
    console.log('👎 Codes Removed (-):');
    console.log('⚬', codesRemoved.join('\n⚬ '), '\n');

    await fs.writeFile(
      path.resolve(API_MESSAGES_PATH),
      JSON.stringify(syncCodes({ codesAdded, codesRemoved }), null, 2)
    );
    console.log('✅ Codes synched successfully \n');
    const locales = await fs.readdir(path.resolve('lib/locales'));
    const apiMessagesInDifferentLocales = await Promise.all(
      locales
        .filter((locale) => locale !== 'en' && !locale.includes('.'))
        .map(async (locale) => `lib/locales/${locale}/frontend/api-messages.json`)
    );
    console.log(
      '❗️ Please update manually  the following files: \n',
      apiMessagesInDifferentLocales.join('\n')
    );
  } else {
    console.log('✅ No changes detected\n');
  }
  return true;
}

module.exports = main;
