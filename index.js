import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apis = {};
const apisDir = path.join(__dirname, 'apis');

async function loadDirectory(dir, baseObj) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      baseObj[item] = {};
      await loadDirectory(fullPath, baseObj[item]);
    } else if (stat.isFile() && item.endsWith('.js')) {
      const moduleName = item.replace('.js', '');

      try {
        const moduleUrl = pathToFileURL(fullPath).href;
        const moduleContent = await import(moduleUrl);

        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const firstLine = fileContent.split('\n')[0].trim();
        const useModuleMode = firstLine === '"runInMoudel"' || firstLine === "'runInMoudel'" || firstLine === 'runInMoudel';

        if (useModuleMode) {
          baseObj[moduleName] = moduleContent.default || moduleContent;
        } else {
          if (moduleContent.default) {
            Object.assign(baseObj, moduleContent.default);
          }

          Object.keys(moduleContent).forEach(key => {
            if (key !== 'default') {
              baseObj[key] = moduleContent[key];
            }
          });

          if (!Object.keys(moduleContent).length) {
            baseObj[moduleName] = 'Empty module';
          }
        }
      } catch (error) {
        baseObj[moduleName] = `Error: ${error.message}`;
      }
    }
  }
}

let apisLoaded = false;
let apisPromise = null;

async function loadApis() {
  if (!apisPromise) {
    apisPromise = (async () => {
      await loadDirectory(apisDir, apis);
      apisLoaded = true;
      return apis;
    })();
  }
  return await apisPromise;
}

const loadedApis = await loadApis();

const emam = loadedApis;
const defaultExport = loadedApis;

export {
  emam,
  loadedApis as apis,
  loadedApis as default
};

Object.keys(loadedApis).forEach(key => {
  if (key !== 'default' && !exports.hasOwnProperty(key)) {
    exports[key] = loadedApis[key];
  }
});

export default defaultExport;