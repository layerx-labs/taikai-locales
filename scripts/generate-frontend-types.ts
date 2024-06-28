import 'dotenv/config';

import fs from 'fs';
import path from 'path';

import { FrontendFiles, Locale as LocaleName } from '../lib/types';
import fetchActivityFeedsCodes from './fetch-activity-feed-codes';
import fetchApiErrorCodes from './fetch-api-error-codes';
import generateEnums from './generate-frontend-enums';

type FrontendFileContent = Record<string, string | Record<string, any>>;
type FrontendFile = Record<FrontendFiles, FrontendFileContent>;

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
    const apiErrorCodesResult = await fetchApiErrorCodes();
    console.log(
      '\n============================================================================================\n'
    );
    const activityFeedCodesResult = await fetchActivityFeedsCodes();
    console.log(
      apiErrorCodesResult && activityFeedCodesResult
        ? '\nDone!🥳\n'
        : 'Process interrupted, resolve the alerts 😥\n'
    );

    staticallyGenerateAllFrontendMessages();
  } catch (error) {
    console.error('❌ Error', error);
  }
})();
