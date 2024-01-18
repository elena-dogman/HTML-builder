const fs = require('fs');
const readline = require('readline');

const filePath = './02-write-file/output.txt';
const writeStream = fs.createWriteStream(filePath);
console.log('Hello! Ready when you are. Just type anything you want. Print "exit" or press Ctrl+C to leave');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    if (input.toLowerCase() === 'exit') {
        console.log('Goodbye! See you.');
        rl.close();
        process.exit();
    }
    writeStream.write(`${input}\n`);
});

process.on('SIGINT', () => {
    console.log('Goodbye!');
    rl.close();
    process.exit();
});