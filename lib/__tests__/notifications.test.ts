import path from 'path';
import fs from 'fs';
import { makeExpectations } from './common';

describe('Notifications locales', () => {
  // read all the folders in the locales folder
  const locales = fs
    .readdirSync(path.join(__dirname, '../locales'))
    .filter((paths) => !paths.includes('.'));

  it('match all the notification keys/values names', () => {
    // read all the files in each folder
    const notifications = {};
    for (const locale of locales) {
      notifications[locale] = require(`../locales/${locale}/notifications/index.ts`).default;
    }

    const [firstEntry, ...restOfEntry] = Object.entries<Record<string, any>>(notifications);
    const [mainLocale, firstNotificationContent] = firstEntry;

    for (const [locale, content] of restOfEntry) {
      makeExpectations({
        obj1: firstNotificationContent,
        obj2: content,
        files: [`${mainLocale}/notifications`, `${locale}/notifications`],
        withHtmlTags: true,
      });
    }
  });
});
