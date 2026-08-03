const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else if (/\.(tsx?|jsx?)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function parseImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /import\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.') || importPath.startsWith('@/')) {
      imports.push(importPath);
    }
  }
  return imports;
}

const allFiles = getFiles(srcDir);
const relativeFiles = allFiles.map((f) => path.relative(__dirname, f));

console.log('\n==================================================');
console.log('      🗺️  MACRO TERMINAL FILE CONNECTION MAP      ');
console.log('==================================================\n');

relativeFiles.forEach((file) => {
  const imports = parseImports(path.join(__dirname, file));
  console.log(`📄 ${file}`);
  if (imports.length === 0) {
    console.log('   └── (No internal imports)');
  } else {
    imports.forEach((imp, index) => {
      const isLast = index === imports.length - 1;
      const prefix = isLast ? '   └── 🔗 ' : '   ├── 🔗 ';
      console.log(`${prefix}${imp}`);
    });
  }
  console.log('');
});
