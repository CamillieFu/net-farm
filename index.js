// core modules
const fs = require('fs');
const http = require('http');
const url = require('url');
// custom modules
const replaceTemplate = require('./modules/replaceTemplate');
///////////////FILES/////////////////////////////////
// how to read and write to and from files in nodeJS

//synchronous (blocking)
// const today = new Date(Date.now()).toLocaleDateString();
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// const textOut = `アボカドに関する情報は以下の通りです：\n${textIn}\n${today}に作成されました。`
// fs.writeFileSync('./txt/アウトプット.txt', textOut)
// console.log('ファイルが正常にtxtフォルダに書き込まれました。')

// non-blocking (asynchronous)
// the first parameter in a callback is usually the error, the second is data
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR 💣');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);
//       const finalTxt = `${data2}\n${data3}`;
//       fs.writeFile('./txt/final.txt', finalTxt, 'utf-8', err => {
//         console.log('Files have been written 🥂');
//       })
//     })
//   })
// })
// as shown above, reading of files can be dependent upon previous readings of files,
// and executed in a nested way
// to avoid over-nesting, use promises / async / await
// console.log('This will be read first!');

/////////////////SERVER/////////////////////

// the code (below) which is outside of the server callback function
// is only run once when the app is loaded, not on every request (top level)
// we can put the data in a ready-to-use variable
// to access files even when executing the code outside of the
// working folder, use dirname instead

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const productPage = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true)
  // home page aka overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type' : 'text/html'});
    const cardsHTML = dataObj.map(card => replaceTemplate(tempCard, card)).join('');
    const output = overview.replace('{%PRODUCT_CARDS%}', cardsHTML)
    res.end(output);

  // product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type' : 'text/html'});
    const product = dataObj[query.id]
    const output = replaceTemplate(productPage, product)
    res.end(output);

  // API
  } else if (pathname === '/api') {
    // res.end must send back a string (not an object)
    // better to send the original data, not the parsed data (parsed from string into an object)
    res.writeHead(200, { 'Content-type' : 'application/JSON'});
    res.end(data);

    // 404 NOT FOUND
  } else {
    res.writeHead(404, {
      // we can add headers to inform the browser about the response
      // e.g. 'content-type: 'text/html', or something unique
      // headers must always be defined before sending the response (res.end)
      'Content-type' : 'text/html',
      'my-own-header' : 'wooha'
    });
    res.end('<h1>Ooops, we cannot find that page</h1>')
  }
});

// listening to requests from client
server.listen(8000, undefined, () => {
  console.log('Listening on port 8000');
});
