import fs from 'fs';
import path from 'path';

import { FrontendFiles, Locale as LocaleName, LocaleEnum } from '../lib/types';

require('dotenv').config();

const generateEnums = require('./generate-frontend-enums');
const fetchApiErrorCodes = require('./fetch-api-error-codes');

type FrontendFileContent = Record<string, string | Record<string, any>>;
type FrontendFile = Record<FrontendFiles, FrontendFileContent>;
type Locale = Record<'frontend', FrontendFile>;
type Locales = Record<LocaleName, LocaleEnum>;

/**
 * Statically generate all the frontend message as an object
 */
const staticallyGenerateAllFrontendMessages = () => {
  const locales = fs
    .readdirSync(path.resolve('lib/locales'))
    .filter((paths) => !paths.includes('.'));

  let result: any = locales.reduce(
    (acc, locale) => ({
      ...acc,
      [locale]: { frontend: {} },
    }),
    {}
  );

  function frontendFiles(locale: string) {
    const files = fs
      .readdirSync(path.resolve(`lib/locales/${locale}/frontend`))
      .filter((file) => file.endsWith('.json'));

    const obj: any = {};
    for (const file of files) {
      obj[
        file.replace('.json', '') as FrontendFiles
      ] = require(`../lib/locales/${locale}/frontend/${file}`);
    }

    return obj as FrontendFile;
  }

  for (const locale of locales) {
    result[locale as LocaleName]['frontend'] = frontendFiles(locale);
  }

  console.log('result', result);
  console.log('locales', locales);

  fs.writeFileSync(
    path.resolve('lib/locales/index.ts'),
    `// ////////////////////////////////////////////////////////////////
// DO NOT MODIFY THIS FILE DIRECTLY. IT IS GENERATED.
// ////////////////////////////////////////////////////////////////

export default ${JSON.stringify(result)};
`,
    { encoding: 'utf8' }
  );
};

/**
 * Export the frontend filenames
 */
(async function () {
  console.log(`
  ██████╗ ███████╗███╗   ██╗███████╗██████╗  █████╗ ████████╗███████╗    ████████╗██╗   ██╗██████╗ ███████╗███████╗
  ██╔════╝ ██╔════╝████╗  ██║██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝    ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝
  ██║  ███╗█████╗  ██╔██╗ ██║█████╗  ██████╔╝███████║   ██║   █████╗         ██║    ╚████╔╝ ██████╔╝█████╗  ███████╗
  ██║   ██║██╔══╝  ██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║   ██║   ██╔══╝         ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  ╚════██║
  ╚██████╔╝███████╗██║ ╚████║███████╗██║  ██║██║  ██║   ██║   ███████╗       ██║      ██║   ██║     ███████╗███████║
   ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝       ╚═╝      ╚═╝   ╚═╝     ╚══════╝╚══════╝
`);
  const frontendFiles = fs
    .readdirSync(path.resolve('lib/locales/en/frontend'))
    .filter((file) => file.endsWith('.json'));

  const obj = frontendFiles.reduce(
    (acc, file) => ({
      ...acc,
      [file.replace('.json', '')]: '',
    }),
    {}
  );

  console.log('Generating enums...');
  fs.writeFileSync(
    path.resolve('lib/types/enums.ts'),
    `// ////////////////////////////////////////////////////////////////
// DO NOT MODIFY THIS FILE DIRECTLY. IT IS GENERATED.
// ////////////////////////////////////////////////////////////////
  ${generateEnums(frontendFiles)}`,
    { encoding: 'utf8' }
  );
  console.log('✅ Enums generated successfully\n');

  console.log('Generating frontend index...');
  fs.writeFileSync(
    path.resolve('lib/locales/en/frontend/index.ts'),
    `// ////////////////////////////////////////////////////////////////
// DO NOT MODIFY THIS FILE DIRECTLY. IT IS GENERATED.
// ////////////////////////////////////////////////////////////////

export default ${JSON.stringify(obj)};
`,
    { encoding: 'utf8' }
  );
  console.log('✅ Frontend index generated successfully\n');

  try {
    const result = await fetchApiErrorCodes();
    console.log(result ? '\nDone!🥳\n' : 'Process interrupted, resolve the alerts 😥\n');

    staticallyGenerateAllFrontendMessages();
  } catch (error) {
    console.error('❌ Error', error);
  }
})();
