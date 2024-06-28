import fs from 'fs';
import path from 'path';

/**
 * Replace the dependency path reference after generated a new package version
 */
(function () {
  try {
    const libPkgJson = require('../package.json');
    const newPackedName = `${libPkgJson.name}-${libPkgJson.version}.tgz`
      .replace(/\//g, '-')
      .replace(/\@/g, '');

    const libTesterPkgJsonStringified = fs.readFileSync(path.resolve('lib-tester/package.json'), {
      encoding: 'utf8',
    });

    const newContent = libTesterPkgJsonStringified.replace(
      /\"file:\.\.\/.*\"/g,
      `"file:../${newPackedName}"`
    );

    fs.writeFileSync(path.resolve('lib-tester/package.json'), newContent, { encoding: 'utf8' });
  } catch (error) {
    console.log();
  }
})();
