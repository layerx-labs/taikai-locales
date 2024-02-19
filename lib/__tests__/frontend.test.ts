import path from 'path';
import fs from 'fs';
import { makeExpectations } from './common';
import { promisify } from 'util';

const readdirAsync = promisify(fs.readdir);

describe('Frontend locales', () => {
  // read all the folders in the locales folder
  const locales = fs
    .readdirSync(path.join(__dirname, '../locales'))
    .filter((paths) => !paths.includes('.'));

  it('match all the frontend file names', async () => {
    // read all the files in each folder
    const frontend = {};

    const promises = locales.map(async (locale) => {
      const frontendFiles = await readdirAsync(
        path.join(__dirname, `../locales/${locale}/frontend`)
      );
      frontend[locale] = frontendFiles.filter((file) => file.endsWith('.json'));
    });

    await Promise.all(promises);

    const [firstEntry, ...restOfEntry] = Object.entries(frontend);
    const [mainLocale, firstFrontendFiles] = firstEntry;

    for (const [locale, files] of restOfEntry) {
      expect(
        firstFrontendFiles,
        `Expected the folders ${mainLocale}/frontend and ${locale}/frontend to have the same json files`
      ).toStrictEqual(files);
      // Check the content of the files
      (files as Array<string>).forEach((file) => {
        const fileContent = require(`../locales/${locale}/frontend/${file}`);
        const mainFileContent = require(`../locales/${mainLocale}/frontend/${file}`);
        makeExpectations({
          obj1: mainFileContent,
          obj2: fileContent,
          files: [`${mainLocale}/frontend/${file}`, `${locale}/frontend/${file}`],
          withHtmlTags: false,
        });
      });
    }
  });
});
