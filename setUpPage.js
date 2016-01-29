//Made with help from https://nodejs.org/api/readline.html
//and https://www.npmjs.com/package/replace

var replace = require("replace");
const readline = require('readline');
const fs = require('fs');

fs.createReadStream('Moon2STL_proto.html').pipe(fs.createWriteStream('Moon2STL.html'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter a valid Google Maps API key: ', function(apikey){
  // TODO: Log the answer in a database
  console.log('API Key: ', apikey);

  replace({
    regex: "YOURGMAPSAPIKEY",
    replacement: apikey,
    paths: ['./Moon2STL.html']
  });

  rl.close();
});

