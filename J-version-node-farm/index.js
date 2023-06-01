// コアモジュール
const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
// カスタムモジュール
const replaceTemplate = require("./modules/replaceTemplate");

/////////////////サーバー/////////////////////

// データ
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// 要素
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const productPage = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const slugs = dataObj.map((obj) => slugify(obj.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // ホームページ
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHTML = dataObj
      .map((card) => replaceTemplate(tempCard, card))
      .join("");
    const output = overview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);

    // プロダクトページ
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(productPage, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/JSON" });
    res.end(data);

    // 404
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>すみません、ページが見つかりません。</h1>");
  }
});

// クライエントからのリクエストをモニタリング
server.listen(8000, undefined, () => {
  console.log("Listening on port 8000");
});
