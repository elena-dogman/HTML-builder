const fs = require('fs/promises');
const path = require('path');
const copyDir = async () => {
  const initialDir = path.join(__dirname, 'files');
  const destinationDir = path.join(__dirname, 'files-copy');
  try {
    await fs.mkdir(destinationDir, { recursive: true });
    console.log('Directory created.');
    const files = await fs.readdir(initialDir);
    console.log('Files:', files);
    for (let file of files) {
      const initialPath = path.join(initialDir, file);
      const destinationPath = path.join(destinationDir, file);
      await fs.copyFile(initialPath, destinationPath);
      console.log(`${file} copied.`);
    }
    console.log('All files copied');
  } catch (error) {
    console.error('Error:', error);
  }
};

copyDir();
