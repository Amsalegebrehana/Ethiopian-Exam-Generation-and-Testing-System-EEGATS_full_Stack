// // const fs = require('fs');
// import fs from 'fs';
// // const parse = require('csv-parse');
// import parse from 'csv-parser';

// // const inputFilePath = '/Users/leultefera/Desktop/EEGAT/eegatstry.csv';


// // create a writable stream
// export const convertToCsv = (inputFilePath: String) => {
//     const outputFilePath = inputFilePath.slice(0,inputFilePath.length - 4) + "new.csv";

//     const writableStream = fs.createWriteStream(outputFilePath);

//     // create a readable stream
//     fs.createReadStream(inputFilePath)
//       .pipe(parse({ delimiter: ',', from_line: 2 }))
//       .on('data', (row: string[]) => {
//         const password = row[1] + String(Math.ceil(Math.random() * 10 ** 4)).padStart(4, '0');
//         row.push(password);
//         await reg
//         // write the row to the output file
//         writableStream.write(row.join(',') + '\n');
//       })
//       .on('error', (error: { message: any; }) => {
//         console.log(error.message);
//       })
//       .on('end', () => {
//         console.log('finished');
//         // close the writable stream when done
//         writableStream.end();
//       }); 
// }


