import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apisDir = path.join(__dirname, 'apis');

async function loadDirectory(dir) {
  const exports = {};
  
  if (!fs.existsSync(dir)) return exports;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      exports[item] = await loadDirectory(fullPath);
    } else if (stat.isFile() && item.endsWith('.js')) {
      const moduleName = item.replace('.js', '');
      
      try {
        const moduleUrl = pathToFileURL(fullPath).href;
        const moduleContent = await import(moduleUrl);
        
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const firstLine = fileContent.split('\n')[0].trim();
        const useModuleMode = firstLine === '"runInMoudel"' || firstLine === "'runInMoudel'" || firstLine === 'runInMoudel';
        
        if (useModuleMode) {
          exports[moduleName] = moduleContent.default || moduleContent;
        } else {
          if (moduleContent.default) {
            Object.assign(exports, moduleContent.default);
          }
          
          Object.keys(moduleContent).forEach(key => {
            if (key !== 'default') {
              exports[key] = moduleContent[key];
            }
          });
        }
      } catch (error) {
        exports[moduleName] = `Error: ${error.message}`;
      }
    }
  }
  
  return exports;
}

const loaded = await loadDirectory(apisDir);

// Export {name: value}
Object.keys(loaded).forEach(key => {
  exports[key] = loaded[key];
});

// Export {default: }
export default loaded;