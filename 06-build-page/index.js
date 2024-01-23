const fs = require('fs/promises');
const path = require('path');

const mergeStyles = async () => {
  try {
    const stylesDir = path.join(__dirname, 'styles');
    const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

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
    console.error('Error merging styles:', error);
  }
};

const copyAssets = async () => {
  try {
    const assetsDir = path.join(__dirname, 'assets');
    const targetAssetDir = path.join(__dirname, 'project-dist', 'assets');

    console.log('Copying assets from:', assetsDir);
    console.log('To:', targetAssetDir);

    await fs.mkdir(targetAssetDir, { recursive: true });

    const copyRecursive = async (source, destination) => {
      const entries = await fs.readdir(source, { withFileTypes: true });

      for (const entry of entries) {
        const sourcePath = path.join(source, entry.name);
        const destinationPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
          await fs.mkdir(destinationPath, { recursive: true });
          await copyRecursive(sourcePath, destinationPath);
        } else {
          try {
            await fs.copyFile(sourcePath, destinationPath);
            console.log('Copied asset:', entry.name);
          } catch (error) {
            console.error(`Error copying asset ${entry.name}:`, error);
          }
        }
      }
    };

    await copyRecursive(assetsDir, targetAssetDir);

    console.log('Assets copied successfully');
  } catch (error) {
    console.error('Error:', error);
  }
};

const buildPage = async () => {
  try {
    const templatePath = path.join(__dirname, 'template.html');
    const componentsDir = path.join(__dirname, 'components');
    const outPath = path.join(__dirname, 'project-dist', 'index.html');

    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const templateTags = templateContent.match(/{{(.*?)}}/g);

    if (templateTags) {
      let modifiedContent = templateContent;
      for (let tag of templateTags) {
        const tagName = tag.slice(2, -2).trim();
        try {
          const componentPath = path.join(componentsDir, `${tagName}.html`);
          const componentContent = await fs.readFile(componentPath, 'utf-8');
          modifiedContent = modifiedContent.replace(tag, componentContent);
        } catch (error) {
          console.error('Error:', error);
        }
      }

      await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
      await fs.writeFile(outPath, modifiedContent);
      console.log('File created');

      await mergeStyles();
      await copyAssets();
    } else {
      console.error('Error: No template tags found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

(async () => {
  await buildPage();
})();
