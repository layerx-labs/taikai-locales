require('dotenv').config();
const fs = require('fs');
const path = require('path');
const generateEnums = require('./generate-frontend-enums');
const fetchApiErrorCodes = require('./fetch-api-error-codes');

/**
 * Export the frontend filenames
 */
(function () {
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

export default ${JSON.stringify(obj)};`,
    { encoding: 'utf8' }
  );
  console.log('✅ Frontend index generated successfully\n');

  fetchApiErrorCodes()
    .then((result) => {
      console.log(result ? '\nDone!🥳\n' : 'Process interrupted, resolve the alerts 😥\n');
    })
    .catch((error) => {
      console.error('❌ Error', error);
    });
})();
