module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver", // 파일에 액세스하기 전에 올라가야 하는 디렉토리 수준을 계산할 필요가 없게 하기 위해 정의
      {
        extensions: ["*", ".ts", ".js", ".tsx", ".jsx"],
        root: ["./src"],
        alias: {},
      },
    ],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
  ],
};
