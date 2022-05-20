const cors = require("cors");
const express = require("express");
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");

const fs = require("fs");

const config = require("./webpack.config").find(config => config.name === "devServer");

(() => {
  const app = express();
  const compiler = webpack(config);

  app.use(cors());

  app.use(
    middleware(compiler, {
      publicPath: config.output.publicPath,
      writeToDisk: true, // 웹팩에 지정된 대로 디스크의 구성된 위치에 파일을 쓰도록 모듈에 지시
    }),
  );

  app.use(require("webpack-hot-middleware")(compiler));
  app.use("/static", express.static("dist/static"));

  app.use("/", (req, res) => {
    fs.readFile("dist/static/html/index.html", (error, data) => {
      if (error) {
        console.log(error);
        return res.status(500).send(JSON.stringify(error));
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  });

  app.listen(3000, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Listening at http://localhost:3000");
  });
})();
