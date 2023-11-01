import path from 'path';
import fs from 'fs';
import {
  makeExpectations,
  makeExpectationsForHtmlTags,
  makeExpectationsForTemplateVariables,
} from './common';
import { promisify } from 'util';

const readdirAsync = promisify(fs.readdir);

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

  async function validateEmailsContent({ emails }: { emails: Record<string, any> }) {
    const [firstEntry, ...restOfEntry] = Object.entries<string>(emails);
    const [mainLocale, firstEmails] = firstEntry;

    const promises = restOfEntry.map(async ([locale, emails]) => {
      expect(
        emails,
        `Expected the folders ${mainLocale}/emails and ${locale}/emails to have the same files`
      ).toStrictEqual(firstEmails);

      // Check the content of the files
      for (const email of emails) {
        const emailContent = fs.readFileSync(
          path.join(__dirname, `../locales/${locale}/emails/${email}`),
          {
            encoding: 'utf-8',
          }
        );
        const mainEmailContent = fs.readFileSync(
          path.join(__dirname, `../locales/${mainLocale}/emails/${email}`),
          {
            encoding: 'utf-8',
          }
        );

        // expect the values to have the same template variables
        makeExpectationsForTemplateVariables({
          str1: mainEmailContent,
          str2: emailContent,
          key: '',
          files: [`${mainLocale}/emails/${email}`, `${locale}/emails/${email}`],
        });

        // expect the values to have the same HTML tags
        makeExpectationsForHtmlTags({
          str1: mainEmailContent,
          str2: emailContent,
          key: '',
          files: [`${mainLocale}/emails/${email}`, `${locale}/emails/${email}`],
        });
      }
    });

    await Promise.all(promises);
  }

  async function validateEmailsSubjectExistence({ emails }: { emails: Record<string, any> }) {
    const promises = locales.map(async (locale) => {
      const index = require(`../locales/${locale}/emails/index.ts`).default;

      emails[locale].forEach((_emailFile: string) => {
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
    });

    await Promise.all(promises);
  }

  it('match all the emails file names and its content', async () => {
    const emails = {};

    const promises = locales.map(async (locale) => {
      const emailFiles = await readdirAsync(path.join(__dirname, `../locales/${locale}/emails`));

      expect(emailFiles, `The folder ${locale}/emails should have an 'index.ts' file`).toContain(
        'index.ts'
      );
      expect(emailFiles, `The folder ${locale}/emails should have an 'common.ts' file`).toContain(
        'common.ts'
      );

      emails[locale] = emailFiles.filter((file) => file.endsWith('.hbs'));
    });

    await Promise.all(promises);
    await validateEmailsSubjectExistence({ emails });
    await validateEmailsContent({ emails });
  });

  it('match all the common, subject and preheader keys/values names', async () => {
    const index = {};
    const common = {};

    const promises = locales.map(async (locale) => {
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
    });

    await Promise.all(promises);
    validateObj({ obj: index, file: 'index.ts' });
    validateObj({ obj: common, file: 'common.ts' });
  });
});
