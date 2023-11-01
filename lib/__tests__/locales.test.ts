import path from 'path';
import fs from 'fs';

function makeExpectationsForTemplateVariables({ str1, str2, key, files }) {
  const regex = /{{\s*([a-zA-Z0-9]+)\s*}}/g;
  const matches1 = str1.matchAll(regex);
  const matches2 = str2.matchAll(regex);

  const keys1: Array<string> = [];
  for (const match of matches1) {
    keys1.push(match[1]);
  }

  const keys2: Array<string> = [];
  for (const match of matches2) {
    keys2.push(match[1]);
  }

  expect(
    keys1.sort(),
    `Expected the files ${files.join(
      '; '
    )} to have the same templates variable on property '${key}'`
  ).toStrictEqual(keys2.sort());
}

function makeExpectations({ obj1, obj2, files }) {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  // expect the keys to be the same
  expect(keys1, `Expected the files ${files.join('; ')} to have the same keys`).toStrictEqual(
    keys2
  );

  keys1.forEach((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    // expect the values to be the same type
    // console.log(`Test for key: '${key}'`);
    expect(typeof value1).toBe(typeof value2);
    if (typeof value1 === 'object') {
      makeExpectations({ obj1: value1, obj2: value2, files });
    } else {
      // expect the values to be strings
      expect(
        typeof value1,
        `Expected the value on property ${key} to be a string type, file: '${files[0]}'`
      ).toBe('string');
      expect(
        typeof value2,
        `Expected the value on property ${key} to be a string type, file: '${files[1]}'`
      ).toBe('string');

      // expect the values not to be empty
      expect(
        value1,
        `Expected the value on property ${key} not to be an empty string, file: '${files[0]}'`
      ).not.toBe('');
      expect(
        value2,
        `Expected the value on property ${key} not to be an empty string, file: '${files[1]}'`
      ).not.toBe('');

      // expect the values to have the same template variables
      makeExpectationsForTemplateVariables({ str1: value1, str2: value2, key, files });
    }
  });
}

describe('Make sure all the locales match each other in terms of property names', () => {
  // read all the folders in the locales folder
  const locales = fs
    .readdirSync(path.join(__dirname, '../locales'))
    .filter((paths) => !paths.includes('.'));

  it('match all the emails file names', () => {
    // read all the files emails in each folder
    const emails = {};
    for (const locale of locales) {
      const emailFiles = fs.readdirSync(path.join(__dirname, `../locales/${locale}/emails`));
      emails[locale] = emailFiles;

      expect(emailFiles).toContain('index.ts');
      expect(emailFiles).toContain('common.ts');

      // dynamically import the index file
      const index = require(`../locales/${locale}/emails/index.ts`).default;

      emailFiles.forEach((_emailFile) => {
        // console.log(`Test for email file '${_emailFile}'`);
        // Expect the index to have an object with the keys of the emails
        if (!_emailFile.endsWith('.ts')) {
          const emailFile = _emailFile.replace('.hbs', '');
          expect(index).toHaveProperty(emailFile);
          expect(index[emailFile]).toHaveProperty('subject');
          expect(index[emailFile]).toHaveProperty('preheader');
          expect(index[emailFile].subject).not.toBe('');
          expect(index[emailFile].preheader).not.toBe('');
        }
      });

      // dynamically import the common file
      const common = require(`../locales/${locale}/emails/common.ts`).default;
      expect(common).toHaveProperty('supportMsg');
      expect(common).toHaveProperty('expirationMsg');
      expect(common.supportMsg).not.toBe('');
      expect(common.expirationMsg).not.toBe('');
    }

    // expect all the locales/emails to have the same filenames
    const [firstEntry, ...restOfEntry] = Object.entries(emails);
    const [_, firstEmails] = firstEntry;
    for (const [__, emails] of restOfEntry) {
      expect(emails).toHaveLength((firstEmails as Array<string>).length);
      expect(emails).toStrictEqual(firstEmails);
    }
  });

  it('match all the frontend file names', () => {
    // read all the files in each folder
    const frontend = {};
    for (const locale of locales) {
      const frontendFiles = fs.readdirSync(path.join(__dirname, `../locales/${locale}/frontend`));
      frontend[locale] = frontendFiles.filter((file) => file.endsWith('.json'));
    }

    const [firstEntry, ...restOfEntry] = Object.entries(frontend);
    const [mainLocale, firstFrontendFiles] = firstEntry;

    console.log(`Frontend files, using ${mainLocale} as the main locale`);
    for (const [locale, files] of restOfEntry) {
      expect(
        firstFrontendFiles,
        `Expected the folders ${mainLocale}/frontend; ${locale}/frontend to have the same json files`
      ).toStrictEqual(files);
      // Check the content of the files
      (files as Array<string>).forEach((file) => {
        const fileContent = require(`../locales/${locale}/frontend/${file}`);
        const mainFileContent = require(`../locales/${mainLocale}/frontend/${file}`);
        makeExpectations({
          obj1: mainFileContent,
          obj2: fileContent,
          files: [`${mainLocale}/frontend/${file}`, `${locale}/frontend/${file}`],
        });
      });
    }
  });

  it('match all the notification file names', () => {
    // read all the files in each folder
    const notifications = {};
    for (const locale of locales) {
      notifications[locale] = require(`../locales/${locale}/notifications/index.ts`).default;
    }

    const [firstEntry, ...restOfEntry] = Object.entries(notifications);
    const [mainLocale, firstNotificationContent] = firstEntry;

    console.log(`Notification files, using ${mainLocale} as the main locale`);
    for (const [locale, content] of restOfEntry) {
      makeExpectations({
        obj1: firstNotificationContent,
        obj2: content,
        files: [`${mainLocale}/notifications`, `${locale}/notifications`],
      });
    }
  });
});
