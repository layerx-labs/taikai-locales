import fs from 'fs';
import { globby } from 'globby';

// An array containing which message paths
// to delete from the i18n files
export const messagesToDeleteFromLocales = [
  'report.report_project',
  'report.report_modal_title',
  'report.report_modal_description',
  'report.report_modal_button',
  'report.report_success_submission',
  'report.reason.report_reason_copyright',
  'report.reason.report_reason_content',
  'report.reason.report_reason_spam',
  'report.reason.report_reason_other',
  'label.current_email',
  'error.email_not_part_domain_list',
  'error.minimum_amount_insufficient',
  'connected_accounts.connect_metamask_wallet_description',
];

/**
 * Deeply remove "nested keys" from an object
 * @param obj the object
 * @param keys the key paths
 * @example ```
 * removeKeys({"example": "value"}, ["example", "example.nestedKey"])
 * ```
 */
function removeKeys(obj: object, keys: string[]) {
  var index;
  for (var prop in obj) {
    // important check that this object own property
    // not from prototype prop inherited
    if (obj.hasOwnProperty(prop)) {
      switch (typeof obj[prop]) {
        case 'string':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete obj[prop];
          }
          break;
        case 'object':
          index = keys.indexOf(prop);
          if (index > -1) {
            delete obj[prop];
          } else {
            removeKeys(obj[prop], keys);
          }
          break;
      }
    }
  }
}

const checkUnusedTranslationMessages = async () => {
  console.log('Checking and deleting unused translation messages');

  const notReadingDir = ['lib/**/frontend/**', '!**.ts', '!api-messages.json', '!countries.json'];
  const files = await globby(notReadingDir);

  for (const filePath of files) {
    const fileWithMessages = await import(`../${filePath}`);

    // use the ['default'] because of how the "unamed import" works
    const messagesToDeleteMap: Record<string, number> = { ...fileWithMessages['default'] };

    // dynamically delete deeply nested objects
    removeKeys(messagesToDeleteMap, messagesToDeleteFromLocales);

    // rewrite back the file with the objects removed
    fs.writeFile(filePath, JSON.stringify(messagesToDeleteMap, null, 2), (err) => {
      if (err) console.log(`Error writing back the file ${filePath}`, err);
    });
  }

  console.log('Successfuly verified the unused messages ✅');
};
(async () => await checkUnusedTranslationMessages())();
