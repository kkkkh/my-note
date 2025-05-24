// vite-plugin-html-string.js
import fs from 'node:fs';
import path from 'node:path';

function htmlString() {
  return {
    name: 'html-string',
    transform(code, id) {
      if (id.endsWith('.html')) {
        const filePath = path.resolve(id);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        // console.log(htmlContent)
        return {
          code: `export default ${JSON.stringify(htmlContent)};`,
          map: null,
        };
      }
    },
  };
}

export default htmlString;
