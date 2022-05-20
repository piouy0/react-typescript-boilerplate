const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const Dotenv = require("dotenv-webpack");
const path = require("path");
const fs = require("fs");

const { NODE_ENV, APP_ENV, API_ROOT, PUBLIC_PATH } = process.env;

const isStagingOrProduction = NODE_ENV === "production";

const entries = ["./src/index.js"];

const output = {
  path: path.resolve("dist", "static"),
  filename: "js/[name]-[contenthash].js", // 번들 이름
  chunkFilename: "js/[name]-[chunkhash].js", // 청크 파일 이름
  publicPath: `${PUBLIC_PATH}/static/`, // 브라우저 리소스 경로
};

const templates = JSON.parse(fs.readFileSync("src/html/templates.json").toString("utf-8"));

const devBabelPlugins = [
  "react-hot-loader/babel", // 소스 코드 수정 시, react에서 변경된 부분을 새로 렌더링 하며 state 유지를 위한 플러그인
];

const prodBabelPlugins = [
  "transform-remove-console", // console 제거 플러그인
];

const babelConfig = {
  test: /\.(jsx?|tsx?)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader", // compile js to ts
      options: {
        plugins: isStagingOrProduction ? prodBabelPlugins : devBabelPlugins,
      },
    },
  ],
};

const defaultPlugins = [
  new Dotenv({
    // 환경변수를 지원하고 사용자가 사용하는 것만 노출하는 보안 플러그인
    path: "./.env",
  }),
  new webpack.DefinePlugin({
    // 전역변수 사용 플러그인
    "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
    "process.env.APP_ENV": JSON.stringify(APP_ENV),
    "process.env.API_ROOT": JSON.stringify(API_ROOT),
    "process.env.PUBLIC_PATH": JSON.stringify(PUBLIC_PATH),
  }),
  ...Object.entries(templates).map(values => {
    const [, data] = values;

    return new HtmlWebpackPlugin({
      // 웹팩 번들 제공 html 생성
      publicPath: output.publicPath,
      ...data,
    });
  }),
];

const devPlugins = [
  // 소스 코드에서 css, js가 런타임 시점에 업데이트
  new webpack.HotModuleReplacementPlugin(),
];

const prodPlugins = [
  new CleanWebpackPlugin({
    // 빌드 될 때마다 빌드 폴더 비움
    verbose: true,
  }),
  new ImageminWebpWebpackPlugin({
    config: [
      {
        test: /\.(jpe?g|png)/,
        options: {
          quality: 75,
        },
      },
    ],
    overrideExtension: true,
    detailedLogs: false,
    silent: false,
    strict: true,
  }),
  new CompressionPlugin({
    // 번들을 한 번 더 압축
    test: /\.js$/i,
  }),
];

const pluginList = isStagingOrProduction ? [...defaultPlugins, ...prodPlugins] : [...defaultPlugins, ...devPlugins];

const setFileLoaderOptions = fileCategory => ({
  name: resourcePath => {
    if (resourcePath.includes("fonts")) {
      return "[name].[ext]";
    }
    return "[contenthash].[ext]";
  },
  publicPath: filename => `${output.publicPath}${fileCategory}/${filename}`,
  outputPath: url => path.join(fileCategory, url),
});

const buildConfig = {
  context: __dirname, // 기본 디렉토리, 절대 경로 디렉토리
  mode: NODE_ENV,
  entry: entries,
  output,
  // 소스 맵이 생성되는지 여부와 생성 방법을 제어
  devtool: "hidden-source-map", // 오류 보고 목적으로 SourceMap 사용
  module: {
    rules: [
      babelConfig,
      {
        test: /\.js$/,
        include: /node_modules\/(react-select|strict-uri-encode|query-string|split-on-first)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(jsx?|tsx?)$/,
        include: /node_modules/,
        use: ["react-hot-loader/webpack"],
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // eslint-disable-next-line global-require
              implementation: require("node-sass"),
            },
          },
        ],
      },
      {
        test: /\.(webp|jpg|png|jpeg)$/,
        loader: "url-loader",
        options: {
          ...setFileLoaderOptions("images"),
          limit: 5000,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: setFileLoaderOptions("fonts"),
          },
        ],
      },
      {
        loader: "webpack-modernizr-loader",
        test: /\.modernizrrc\.js$/,
      },
    ],
  },
  plugins: pluginList, // 번들파일 관련 설정
  optimization: {
    // 최적화 관련
    minimize: true, // minimizer에 지정된 플러그인을 사용하여 번들을 최소화
    minimizer: [new TerserPlugin()],
    splitChunks: {
      // 청크를 어떻게 세팅할지
      chunks: "all", // 최적화할 청크
      maxInitialRequests: 20, // 엔트리 포인트의 최대 병렬 요청 수 for HTTP2
      maxAsyncRequests: 20, // on-demand 로드 시의 최대 병렬 요청 수 for HTTP2
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/, // 캐시 그룹에 의해 선택되는 모듈을 제어
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
  devServer: {
    allowedHosts: "all", // 개발 서버에 접근할 수 있는 서비스를 화이트리스트에 추가
    historyApiFallback: true, // 새로고침이나 url로 페이지 접근 시, Route Link없이 route로 제대로 이동 시켜줌
    hot: true, // HotModuleReplacement를 사용하기 위해 세팅
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts", ".css"],
    // import또는 require특정 모듈 에 대한 별칭 정의
    alias: {},
  },
};

module.exports = [
  {
    name: "build",
    ...buildConfig,
  },
  {
    name: "devServer",
    ...buildConfig,
    entry: [
      "webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr&reload=true",
      "webpack/hot/only-dev-server", // script 에러시 리로드를 방지
      "react-hot-loader/patch", // react-hot-loader를 위한 entry
      ...entries,
    ],
    devtool: "source-map",
    optimization: {
      removeAvailableModules: false, // 모듈이 이미 모든 상위에 포함되어있는 경우 청크에서 해당 모듈을 감지하고 제거
      removeEmptyChunks: false, // 빈 청크를 감지하고 제거
      splitChunks: false,
    },
    output: {
      ...buildConfig.output,
      publicPath: `http://localhost:3000/__webpack_hmr`,
    },
  },
];
