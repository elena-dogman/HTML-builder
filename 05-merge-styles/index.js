const fs = require('fs/promises');
const path = require('path');

const mergeStyles = async () => {
  const stylesDir = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

  try {
    const files = await fs.readdir(stylesDir);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    const stylesArray = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesDir, file);
        try {
          const fileContent = await fs.readFile(filePath);
          return fileContent;
        } catch (error) {
          console.error(`Error reading ${file}:`, error);
          return '';
        }
      }),
    );
    const bundleContent = stylesArray.join('\n');
    await fs.writeFile(bundlePath, bundleContent);
    console.log('Bundle created');
  } catch (error) {
    console.error('Error:', error);
  }
};

mergeStyles();
