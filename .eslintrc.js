module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "airbnb-base", // eslint-config-airbnb-base
    "plugin:react/recommended", // eslint-plugin-react
    "plugin:react-hooks/recommended", // eslint-plugin-react-hooks
    "plugin:@typescript-eslint/recommended", // @typescript-eslint/eslint-plugin
    // for eslint prettier error
    "plugin:prettier/recommended", // eslint-plugin-prettier
    "prettier/@typescript-eslint",
    "prettier/react",
    "prettier/standard",
    "prettier/unicorn",
  ],
  // parser를 사용하여 작성된 rule을 포함, packages에 eslint-plugin 접두사 생략 후 작성
  plugins: [
    "import", // import/export 구문의 린트를 지원하고 파일 경로 및 가져오기 이름의 철자 오류 문제를 방지
  ],
  env: {
    es6: true, // 모듈을 제외한 모든 ECMAScript 6 기능을 활성화
    browser: true,
  },
  // ESLint 사용을 위해 지원하려는 Javascript 언어 옵션을 지정
  parserOptions: {
    ecmaVersion: 2020, // 사용할 ECMAScript 버전을 설정
    sourceType: "module", // parser의 export 형태를 설정
  },
  settings: {
    "import/resolver": {
      // import 별칭 에러 관리
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    /** ******** GENERAL ********* */
    camelcase: "off", // 변수이름 camelcase로 고정할 것인가
    "default-case": "off", // switch 문 마지막에 default가 필수인가
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }], // Class의 각 변수마다 띄어쓰기를 어떻게 제한할 것 인가
    "no-plusplus": "off", // ++를 제한할 것인가
    "no-underscore-dangle": "off", // 변수 이름 맨 앞에 _f를 제한할 것인가
    "no-param-reassign": "off", // 재할당을 제한할 것인가
    "no-shadow": "off", // 섀도우 변수 선언을 제한할 것인가
    "no-unused-vars": "warn", // var 선언문을 에러 처리 할 것인가
    "no-use-before-define": "off", // 변수 정의 전 사용을 에러처리 할 것인가
    "operator-linebreak": "off", // 연산이 들어간 값에 줄 바꿈이 있을 경우 연산자를 줄바뀜 줄 맨 앞 부분에 선언하도록 할 것인가
    quotes: ["warn", "double"], // 따옴표가 " 가 아닐 경우 에러처리

    curly: ["error", "all"], // if내에 return이 아닌 식이 {}안에 없으면 에러 처리 할 것인가

    "class-methods-use-this": "off", // class 문에 this 사용을 필수로 할 것인가

    "dot-notation": "warn", // temp["test"]와 같은 표현을 제한할 것인가

    eqeqeq: ["error", "always", { null: "ignore" }], // === 와 !==이 아닌 다른 값 비교 연산자를 어떻게 처리할 것인가

    "guard-for-in": "off", // for in문을 제한할 것인가

    "max-classes-per-file": ["warn", 1], // 파일당 최대 Class 수를 정의

    /** ******** IMPORT ********* */

    // import를 알파벳 순으로 선언하게 제한
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-named-as-default": "off", // export한 변수를 다른 이름으로 가져오는 걸 제한
    // import문이 require문이나 선언문보다 위로 제한
    "import/no-extraneous-dependencies": [
      2,
      {
        devDependencies: true,
      },
    ],
    "import/no-unresolved": "off", // 경로의 파일이 unresolved하는 일이 없도록 하는 옵션, 정확히는 import로 가져온 파일 혹은 모듈이 unresolved가 되지 않도록 하는 옵션

    "import/prefer-default-export": "warn", // 한 파일에 export default문 없이 export문이 하나 일 경우 제한

    /** ******** REACT ********* */

    "react/jsx-boolean-value": "off", // <Hello personal={true} /> === <Hello personal /> 를 에러처리 할 것인가

    "react/jsx-filename-extension": [
      // 예를들어 .js파일에 jsx문법을 사용할 경우 에러처리를 해줄 것 인가
      "warn",
      {
        extensions: [".jsx", ".tsx"],
      },
    ],

    "react/jsx-sort-props": "off", // component에 props를 정렬하지 않을 경우 에러처리를 할 것인가

    "react/no-access-state-in-setstate": "error", // setState내에 this.state나 state 사용을 에러처리 할 것인가

    "react/no-did-mount-set-state": "error", // componentDidMount내에 바로 setState하는 걸 에러처리 할 것인가

    "react/no-did-update-set-state": "error", // componentDidUpdate내에 바로 setState하는 걸 에러처리 할 것인가

    "react/no-multi-comp": "off", // 파일 하나에 component를 하나로 제한할 것인가

    "react/no-unescaped-entities": [
      // markup에 잘못된 문자처리가 된 것을 방지할 것인가
      "error",
      {
        forbid: [">", "}"],
      },
    ],

    "react/no-unknown-property": "error", // html attr를 camel case로 작성하지 않았을 경우 에러처리 여부

    "react/prefer-stateless-function": "off", // createReactClass 사용을 제한할 것인지

    "react/prop-types": "off", // propsTypes를 에러처리 할 것인지

    "react/self-closing-comp": [
      // 내용없는 태그 처리 제한 ex) <Hello></Hello> => <Hello />
      "error",
      {
        component: true,
        html: true,
      },
    ],

    /** ******** REACT HOOKS ********* */

    "react-hooks/exhaustive-deps": "off", // useEffect내에 사용하고 있는 state를 배열안에 추가시킬 것인가
    "react-hooks/rules-of-hooks": "off", // 컴포넌트 앞 글자를 대문자로 네이밍 하는게 필수인가
  },
};
