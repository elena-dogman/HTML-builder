const fs = require('fs');
const path = require('path');

const displayFileInfo = (folderPath) => {
  fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err.message);
      process.exit(1);
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file.name);

      if (file.isFile()) {
        fs.stat(filePath, (statErr, fileStats) => {
          if (statErr) {
            console.error('Error getting file stats:', statErr.message);
          } else {
            const fileName = path.basename(file.name, path.extname(file.name));
            const fileExtension = path.extname(file.name).slice(1);
            const fileSize = fileStats.size;
            console.log(
              `${fileName} - ${fileExtension} - ${fileSize.toFixed(3)}kb`,
            );
          }
        });
      } else {
        console.error(
          `Error: ${file.name} is a directory. Only files are allowed.`,
        );
      }
    });
  });
};

const folderPath = './03-files-in-folder/secret-folder';
displayFileInfo(folderPath);
