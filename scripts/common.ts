const BACKEND_URL = process.env.BACKEND_URL;

export async function fetchCodes(endpoint: string) {
  const data = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'GET',
  });
  return await data.json();
}

/**
 * Compares the new codes with the old ones and detects changes (new codes, removed codes)
 * @param {*} newCodes
 */
export function detectCodeChanges({
  newCodes,
  oldCodeEntries,
}: {
  newCodes: Record<string, string>;
  oldCodeEntries: [string, string][];
}) {
  const newCodesValues = Object.entries(newCodes);
  const codesAdded = newCodesValues.filter(
    ([code]) => !oldCodeEntries.some(([oldCode]) => code === oldCode)
  );
  const codesRemoved = oldCodeEntries.filter(
    ([oldCode]) => !newCodesValues.some(([code]) => code === oldCode)
  );

  return {
    codesAdded,
    codesRemoved,
  };
}

export function syncCodes({
  codesAdded,
  codesRemoved,
  actualCodesEntries,
}: {
  codesAdded: [string, string][];
  codesRemoved: [string, string][];
  actualCodesEntries: [string, string][];
}) {
  return actualCodesEntries.reduce(
    (acc, [code, message]) =>
      codesRemoved.some(([codeRemoved]) => codeRemoved === code)
        ? acc
        : {
            ...acc,
            [code]: message,
          },
    Object.fromEntries(codesAdded)
  );
}
