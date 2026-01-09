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
      const moduleName = path.basename(item, '.js');
      
      try {
        const moduleUrl = pathToFileURL(fullPath).href;
        const moduleContent = await import(moduleUrl);
        
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const firstLine = fileContent.split('\n')[0].trim();
        const useModuleMode = firstLine === '"runInMoudel"' || firstLine === "'runInMoudel'" || firstLine === 'runInMoudel';
        
        if (useModuleMode) {
          baseObj[moduleName] = moduleContent.default || moduleContent;
        } else {
          Object.keys(moduleContent).forEach(key => {
            baseObj[key] = moduleContent[key];
          });
        }
      } catch (error) {
        console.error(`Error loading ${fullPath}:`, error.message);
      }
    }
  }
}

await loadDirectory(apisDir, apis);

const result = apis;
export { result };
export default apis;
