const fs = require('fs');
const path = require('path');
const generateEnums = require('./generate-frontend-enums');

/**
 * Export the frontend filenames
 */
(function () {
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

  fs.writeFileSync(
    path.resolve('lib/types/enums.ts'),
    `// ////////////////////////////////////////////////////////////////
// DO NOT MODIFY THIS FILE DIRECTLY. IT IS GENERATED.
// ////////////////////////////////////////////////////////////////
  ${generateEnums(frontendFiles)}`,
    { encoding: 'utf8' }
  );

  fs.writeFileSync(
    path.resolve('lib/locales/en/frontend/index.ts'),
    `// ////////////////////////////////////////////////////////////////
// DO NOT MODIFY THIS FILE DIRECTLY. IT IS GENERATED.
// ////////////////////////////////////////////////////////////////

export default ${JSON.stringify(obj)};`,
    { encoding: 'utf8' }
  );
})();
