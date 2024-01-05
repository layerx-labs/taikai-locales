const fs = require('fs');
const path = require('path');

function camelToSnake(str) {
  return str
    .replace(/[\w]([A-Z])/g, function (m) {
      return !m[0].endsWith('_') ? `${m[0]}_${m[1]}` : `${m[0]}${m[1]}`;
    })
    .replace(/[\.\,\;\'\(\)]*/g, '')
    .replace(/[\s\-]+/g, '_')
    .toUpperCase();
}

function injectEnumsEntries(enums, frontendFiles) {
  fs.readdirSync(path.resolve('lib/locales'))
    .filter((locale) => !locale.includes('.'))
    .forEach((locale) => {
      enums.localeEnum += `  ${camelToSnake(locale)} = "${locale}",\n`;
    });

  frontendFiles.forEach((fileName) => {
    const content = require(`../lib/locales/en/frontend/${fileName}`);
    const fileNameWithoutExtension = fileName.replace('.json', '');
    enums.frontendFilesEnum += `  ${camelToSnake(
      fileNameWithoutExtension
    )} = "${fileNameWithoutExtension}",\n`;

    Object.keys(content).forEach((key) => {
      const enumName = camelToSnake(fileNameWithoutExtension.concat(`__${key}`));
      enums.i18nKey += `  ${enumName} = "${fileNameWithoutExtension}:${key}",\n`;
      if (fileNameWithoutExtension === 'api-messages') {
        enums.EApiErrorCodes += `  ${key} = "${key}",\n`;
      }
    });
  });
}

function generateEnums(frontendFiles) {
  // Open the enums
  const enums = {
    i18nKey: '\nexport enum i18nKey {\n',
    frontendFilesEnum: '\nexport enum FrontendFilesEnum {\n',
    localeEnum: '\nexport enum LocaleEnum {\n',
    EApiErrorCodes: '\nexport enum EApiErrorCodes {\n',
  };

  // Inject the enums entries
  injectEnumsEntries(enums, frontendFiles);

  // Close the enums
  Object.keys(enums).forEach((key) => {
    enums[key] += '}\n';
  });

  // Return the enums
  return Object.values(enums).join('');
}

module.exports = generateEnums;
