const fs = require('fs/promises');
const path = require('path');

const mergeStyles = async () => {
  const stylesDir = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

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

const buildPage = async () => {
  const templatePath = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const outPath = path.join(__dirname, 'project-dist', 'index.html');

  try {
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

      const assetsDir = path.join(__dirname, 'assets');
      const targetAssetDir = path.join(__dirname, 'project-dist', 'assets');

      const assetFiles = await fs.readdir(assetsDir);
      await Promise.all(
        assetFiles.map(async (file) => {
          const sourcePath = path.join(assetsDir, file);
          const destPath = path.join(targetAssetDir, file);
          try {
            const fileContent = await fs.readFile(sourcePath);
            await fs.writeFile(destPath, fileContent);
          } catch (error) {
            console.error('Error', error);
          }
        }),
      );

      console.log('Assets copied');
    } else {
      console.error('Error');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

buildPage();
