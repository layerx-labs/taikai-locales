const fs = require('fs');
const path = require('path');

/**
 * Replace the dependency path reference after generated a new package version
 */
(function main() {
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
    path.resolve('lib/locales/en/frontend/index.ts'),
    `// ////////////////////////////////////////////////////////////////
// DO NOT MODIFY THIS FILE DIRECTLY. IT IS GENERATED.
// ////////////////////////////////////////////////////////////////

export default ${JSON.stringify(obj)};`,
    { encoding: 'utf8' }
  );
})();
