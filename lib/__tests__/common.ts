export function makeExpectationsForHtmlTags({
  str1,
  str2,
  key = '',
  files,
}: {
  str1: string;
  str2: string;
  key: string;
  files: Array<string>;
}) {
  const regex = /(<\s*[a-zA-Z0-9]+\s*\/{0,1}>)/g;
  const matches1 = str1.matchAll(regex);
  const matches2 = str2.matchAll(regex);

  const keys1: Array<string> = [];
  for (const match of matches1) {
    keys1.push(match[1].replace(/\s*/g, ''));
  }

  const keys2: Array<string> = [];
  for (const match of matches2) {
    keys2.push(match[1].replace(/\s*/g, ''));
  }

  expect(
    keys1.sort(),
    `Expected the files ${files.join('; ')} to have the same HTML tags ${
      key.length ? `on property '${key}'` : ''
    }`
  ).toStrictEqual(keys2.sort());
}

export function makeExpectationsForTemplateVariables({
  str1,
  str2,
  key,
  files,
}: {
  str1: string;
  str2: string;
  key: string;
  files: Array<string>;
}) {
  const regex = /{{\s*([a-zA-Z0-9\.]+)\s*}}/g;
  const matches1 = str1.matchAll(regex);
  const matches2 = str2.matchAll(regex);

  const keys1: Array<string> = [];
  for (const match of matches1) {
    keys1.push(match[1]);
  }

  const keys2: Array<string> = [];
  for (const match of matches2) {
    keys2.push(match[1]);
  }

  expect(
    keys1.sort(),
    `Expected the files ${files.join('; ')} to have the same variable templates ${
      key.length ? `on property '${key}'` : ''
    }`
  ).toStrictEqual(keys2.sort());
}

export function makeExpectations({
  obj1,
  obj2,
  files,
  key = '',
  withHtmlTags = false,
}: {
  obj1: Record<string, any>;
  obj2: Record<string, any>;
  files: Array<string>;
  key?: string;
  withHtmlTags?: boolean;
}) {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  // expect the keys to be the same
  expect(keys1, `Expected the files ${files.join('; ')} to have the same keys`).toStrictEqual(
    keys2
  );

  keys1.forEach((k) => {
    const value1 = obj1[k];
    const value2 = obj2[k];
    // expect the values to be the same type
    const printingKey = `${key.length ? `${key}.` : ''}${k}`;
    expect(typeof value1).toBe(typeof value2);
    if (typeof value1 === 'object') {
      makeExpectations({ obj1: value1, obj2: value2, key: printingKey, files, withHtmlTags });
    } else {
      // expect the values to be strings
      expect(
        typeof value1,
        `Expected the value on property '${printingKey}' to be a string type, file: '${files[0]}'`
      ).toBe('string');
      expect(
        typeof value2,
        `Expected the value on property '${printingKey}' to be a string type, file: '${files[1]}'`
      ).toBe('string');

      // expect the values not to be empty
      expect(
        value1,
        `Expected the value on property '${printingKey}' not to be an empty string, file: '${files[0]}'`
      ).not.toBe('');
      expect(
        value2,
        `Expected the value on property '${printingKey}' not to be an empty string, file: '${files[1]}'`
      ).not.toBe('');

      // expect the values to have the same template variables
      makeExpectationsForTemplateVariables({ str1: value1, str2: value2, key: printingKey, files });

      if (withHtmlTags) {
        // expect the values to have the same html tags
        makeExpectationsForHtmlTags({ str1: value1, str2: value2, key: printingKey, files });
      }
    }
  });
}
