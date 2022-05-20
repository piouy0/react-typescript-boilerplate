import React from "react";

import temp from "assets/images/react-icon.png";

interface Props {}

const Test: React.FC<Props> = () => {
  return (
    <div>
      <div>Test</div>
      <img style={{ width: 200 }} src={temp} />
    </div>
  );
};

export default Test;
