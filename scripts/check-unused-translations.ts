import fs from 'fs';
import { globby } from 'globby';

/** Delete deeply nested key from an object */
function deleteKey(obj: object, path: string) {
  const keys = path.split('.');
  let currentObj = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!currentObj || typeof currentObj !== 'object') {
      return;
    }
    currentObj = currentObj[keys[i]];
  }

  const lastKey = keys[keys.length - 1];
  if (currentObj && typeof currentObj === 'object' && lastKey in currentObj) {
    delete currentObj[lastKey];
  }
}

// An array containing which message paths
// to delete from the i18n files
export const messagesToDeleteFromLocales = [
  'S1',
  'W1',
  'E634',
  'E633',
  'E632',
  'E631',
  'E630',
  'E629',
  'E628',
];

const checkUnusedTranslationMessages = async () => {
  console.log('Checking and deleting unused translation messages');

  const notReadingDir = [
    'lib/**/frontend/**',
    '!**.ts',
    '!**/api-messages.json',
    '!**/countries.json',
  ];
  const files = await globby(notReadingDir);

  for (const filePath of files) {
    const fileWithMessages = await import(`../${filePath}`);

    // use the ['default'] because of how the "unamed import" works
    const messagesToDeleteMap: Record<string, number> = { ...fileWithMessages['default'] };

    // dynamically delete deeply nested objects
    messagesToDeleteFromLocales.forEach((message) => deleteKey(messagesToDeleteMap, message));

    // rewrite back the file with the objects removed
    fs.writeFile(filePath, JSON.stringify(messagesToDeleteMap, null, 2), (err) => {
      if (err) console.log(`Error writing back the file ${filePath}`, err);
    });
  }

  console.log('Successfuly verified the unused messages ✅');
};
(async () => await checkUnusedTranslationMessages())();
