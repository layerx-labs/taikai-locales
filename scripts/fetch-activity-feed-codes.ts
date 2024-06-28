import fs from 'fs/promises';
import path from 'path';

import { detectCodeChanges, fetchCodes, syncCodes } from './common';

const ACTIVITY_FEED_MESSAGES_PATH = 'lib/locales/en/frontend/activity-feed.json';
const activityFeedEntries = Object.entries<string>(require(`../${ACTIVITY_FEED_MESSAGES_PATH}`));

async function main() {
  console.log('Fetching Activity Feed Messages...');
  const data = await fetchCodes('/feed-messages');
  console.log('✅ Activity Feed Messages fetched successfully\n');
  const { codesAdded, codesRemoved } = detectCodeChanges({
    newCodes: data,
    oldCodeEntries: activityFeedEntries,
  });

  // Print an alert if code changes detected
  if (codesAdded.length || codesRemoved.length) {
    console.log(
      `⚠️  Activity Feed Codes Changes Detected, Synching the codes in '${ACTIVITY_FEED_MESSAGES_PATH}'...\n`
    );
    console.log('👍 Codes Added (+):');
    console.log('⚬', codesAdded.join('\n⚬ '), '\n');
    console.log('👎 Codes Removed (-):');
    console.log('⚬', codesRemoved.join('\n⚬ '), '\n');

    await fs.writeFile(
      path.resolve(ACTIVITY_FEED_MESSAGES_PATH),
      JSON.stringify(
        syncCodes({ codesAdded, codesRemoved, actualCodesEntries: activityFeedEntries }),
        null,
        2
      )
    );
    console.log('✅ Codes synched successfully \n');
    const locales = await fs.readdir(path.resolve('lib/locales'));
    const activityFeedInDifferentLocales = await Promise.all(
      locales
        .filter((locale) => locale !== 'en' && !locale.includes('.'))
        .map(async (locale) => `lib/locales/${locale}/frontend/activity-feed.json`)
    );
    console.log(
      '❗️ Please update manually  the following files: \n',
      activityFeedInDifferentLocales.join('\n')
    );
  } else {
    console.log('✅ No changes detected\n');
  }
  return true;
}

export default main;
