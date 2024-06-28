import fs from 'fs';
import path from 'path';

type Enums = {
  i18nKey: string;
  frontendFilesEnum: string;
  localeEnum: string;
  EApiErrorCodes: string;
};

function camelToSnake(str: string) {
  return str
    .replace(/[\w]([A-Z])/g, function (m) {
      return !m[0].endsWith('_') ? `${m[0]}_${m[1]}` : `${m[0]}${m[1]}`;
    })
    .replace(/[\.\,\;\'\(\)]*/g, '')
    .replace(/[\s\-]+/g, '_');
}

function injectEnumsEntries(enums: Enums, frontendFiles: string[]) {
  fs.readdirSync(path.resolve('lib/locales'))
    .filter((locale) => !locale.includes('.'))
    .forEach((locale) => {
      enums.localeEnum += `  ${camelToSnake(locale).toUpperCase()} = "${locale}",\n`;
    });

  frontendFiles.forEach((fileName: string) => {
    const content: Record<string, any> = require(`../lib/locales/en/frontend/${fileName}`);
    const fileNameWithoutExtension = fileName.replace('.json', '');
    enums.frontendFilesEnum += `  ${camelToSnake(
      fileNameWithoutExtension
    ).toUpperCase()} = "${fileNameWithoutExtension}",\n`;

    function buildDeepEnumKey(obj: Record<string, any>, prefixKey?: string) {
      const result: string[] = [];
      for (const key of Object.keys(obj)) {
        const k = `${prefixKey ? `${prefixKey}__` : ''}${key}`;
        if (typeof obj[key] === 'object') {
          result.push(...buildDeepEnumKey(obj[key], k));
        } else {
          result.push(k);
        }
      }

      return result;
    }

    buildDeepEnumKey(content).forEach((key) => {
      const enumName = camelToSnake(fileNameWithoutExtension.concat(`__${key}`)).toUpperCase();
      enums.i18nKey += `  ${enumName} = "${fileNameWithoutExtension}:${key.replace(
        /__/g,
        '.'
      )}",\n`;
      if (fileNameWithoutExtension === 'api-messages') {
        enums.EApiErrorCodes += `  ${key} = "${key}",\n`;
      }
    });
  });
}

function generateEnums(frontendFiles: string[]) {
  // Open the enums
  const enums: Enums = {
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

export default generateEnums;
