import { FrontendFiles, Locale as LocaleName } from '@types';
import fs from 'fs';
import path from 'path';

type FrontendFileContent = Record<string, string | Record<string, any>>;
type FrontendFile = Record<FrontendFiles, FrontendFileContent>;
type Locale = Record<'frontend', FrontendFile>;
type Locales = Record<LocaleName, Locale>;

// read all the folders in the locales folder
const locales = fs.readdirSync(path.join(__dirname)).filter((paths) => !paths.includes('.'));

const result: any = locales.reduce(
  (acc, locale) => ({
    ...acc,
    [locale]: { frontend: {} },
  }),
  {}
);

function frontendFiles(locale: string) {
  const files = fs
    .readdirSync(path.join(__dirname, `${locale}/frontend`))
    .filter((file) => file.endsWith('.json'));

  const obj: any = {};
  for (const file of files) {
    obj[file.replace('.json', '') as FrontendFiles] = require(`./${locale}/frontend/${file}`);
  }

  return obj as FrontendFile;
}

for (const locale of locales) {
  result[locale as LocaleName]['frontend'] = frontendFiles(locale);
}

export default result as Locales;
