import { FrontendFiles, Locale } from '@types';
import fs from 'fs';
import path from 'path';

type Frontend = Record<FrontendFiles, string>;
type Result = Record<Locale, Record<'frontend', Frontend>>;

// read all the folders in the locales folder
const locales = fs.readdirSync(path.resolve('lib/locales')).filter((paths) => !paths.includes('.'));

const result: any = {
  en: {},
  br: {},
  fr: {},
};

function frontendFiles(locale: string) {
  const files = fs
    .readdirSync(path.resolve(`lib/locales/${locale}/frontend`))
    .filter((file) => file.endsWith('.json'));

  const obj: any = {};
  for (const file of files) {
    obj[file.replace('.json', '') as FrontendFiles] = require(`./${locale}/frontend/${file}`);
  }

  return obj as Frontend;
}

for (const locale of locales) {
  result[locale as Locale]['frontend'] = frontendFiles(locale);
}

export default result as Result;
