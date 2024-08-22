import fs from 'fs/promises';
import path from 'path';

import { detectCodeChanges, fetchCodes, syncCodes } from './common';

const API_MESSAGES_PATH = 'lib/locales/en/frontend/api-messages.json';
const apiMessagesEntries = Object.entries<string>(require(`../${API_MESSAGES_PATH}`));

async function main() {
  console.log('Fetching API Error Messages...');
  const data = await fetchCodes('/api-messages/en');
  console.log('✅ API Error Messages fetched successfully\n');
  const { codesAdded, codesRemoved } = detectCodeChanges({
    newCodes: data,
    oldCodeEntries: apiMessagesEntries,
  });

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
      JSON.stringify(
        syncCodes({ codesAdded, codesRemoved, actualCodesEntries: apiMessagesEntries }),
        null,
        2
      )
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

export default main;
