import React from "react";
import smil from "modernizr-esm/feature/svg/smil";
import { hot } from "react-hot-loader";

import Test from "components/test/Test";

const App = () => {
  console.log(process.env.NODE_ENV);

  if (smil) {
    return (
      <>
        <Test />
      </>
    );
  }
  return (
    <>
      <div>UnSupportPage</div>
    </>
  );
};

export default hot(module)(App);
