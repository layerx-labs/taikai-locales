import path from 'path';
import fs from 'fs';
import { makeExpectations, makeExpectationsForTemplateVariables } from './common';

describe('Email locales', () => {
  // read all the folders in the locales folder
  const locales = fs
    .readdirSync(path.join(__dirname, '../locales'))
    .filter((paths) => !paths.includes('.'));

  function validateObj({ obj, file }: { obj: Record<string, any>; file: string }) {
    const [firstEntry, ...restOfEntry] = Object.entries<Record<string, any>>(obj);
    const [mainLocale, firstNotificationContent] = firstEntry;

    for (const [locale, content] of restOfEntry) {
      makeExpectations({
        obj1: firstNotificationContent,
        obj2: content,
        files: [`${mainLocale}/emails/${file}`, `${locale}/emails/${file}`],
        withHtmlTags: true,
      });
    }
  }

  it('match all the common, subject and preheader keys/values names', () => {
    const index = {};
    const common = {};
    for (const locale of locales) {
      // dynamically import the index and common file
      index[locale] = require(`../locales/${locale}/emails/index.ts`).default;
      common[locale] = require(`../locales/${locale}/emails/common.ts`).default;
      expect(
        common[locale],
        `Expected the 'supportMsg' on '${locale}/emails/common.ts'`
      ).toHaveProperty('supportMsg');
      expect(
        common[locale],
        `Expected the 'expirationMsg' on '${locale}/emails/common.ts'`
      ).toHaveProperty('expirationMsg');
      expect(
        common[locale].supportMsg,
        `Expected the 'supportMsg' on '${locale}/emails/common.ts' not to be an empty string`
      ).not.toBe('');
      expect(
        common[locale].expirationMsg,
        `Expected the 'expirationMsg' on '${locale}/emails/common.ts' not to be an empty string`
      ).not.toBe('');
    }

    validateObj({ obj: index, file: 'index.ts' });
    validateObj({ obj: common, file: 'common.ts' });
  });

  it.skip('match all the emails file names', () => {
    // read all the files emails in each folder
    const emails = {};
    for (const locale of locales) {
      const _emailFiles = fs.readdirSync(path.join(__dirname, `../locales/${locale}/emails`));

      expect(_emailFiles, `The folder ${locale}/emails should have an 'index.ts' file`).toContain(
        'index.ts'
      );
      expect(_emailFiles, `The folder ${locale}/emails should have an 'common.ts' file`).toContain(
        'common.ts'
      );

      const emailFiles = _emailFiles.filter((file) => file.endsWith('.hbs'));
      emails[locale] = emailFiles;
      // dynamically import the index file
      const index = require(`../locales/${locale}/emails/index.ts`).default;

      emailFiles.forEach((_emailFile) => {
        const emailFile = _emailFile.replace('.hbs', '');
        expect(
          index,
          `Expected the subject and preheader on '${locale}/emails/index.ts' for the email '${emailFile}'`
        ).toHaveProperty(emailFile);
        expect(
          index[emailFile],
          `Expected the subject on '${locale}/emails/index.ts' for the email '${emailFile}'`
        ).toHaveProperty('subject');
        expect(
          index[emailFile],
          `Expected the preheader on '${locale}/emails/index.ts' for the email '${emailFile}'`
        ).toHaveProperty('preheader');
        expect(
          index[emailFile].subject,
          `Expected the subject on '${locale}/emails/index.ts' for the email '${emailFile}' not to be an empty string`
        ).not.toBe('');
        expect(
          index[emailFile].preheader,
          `Expected the preheader on '${locale}/emails/index.ts' for the email '${emailFile}' not to be an empty string`
        ).not.toBe('');
      });
    }

    // expect all the locales/emails to have the same filenames
    const [firstEntry, ...restOfEntry] = Object.entries(emails);
    const [mainLocale, firstEmails] = firstEntry;
    for (const [locale, emails] of restOfEntry) {
      expect(
        emails,
        `Expected the folders ${mainLocale}/emails and ${locale}/emails to have the same files`
      ).toStrictEqual(firstEmails);
    }
  });
});
