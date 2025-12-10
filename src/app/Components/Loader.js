import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-around h-screen">
      <ThreeDots
        visible={true}
        height="100"
        width="100"
        color="#2563eb"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;
