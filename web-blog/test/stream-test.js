const fs = require('fs');
const path = require('path');

const filename1 = path.join(__dirname, 'data.txt')
const filename2 = path.join(__dirname, 'data-bak.txt')

const readStream = fs.createReadStream(filename1)
const writeStream = fs.createWriteStream(filename2)

readStream.pipe(writeStream);

readStream.on('end', () => {
    console.log('stream pipe done')
})