import React from "react";

const Loader = () => {
  return (
    <div class="flex-col gap-4 w-full flex items-center justify-center">
      <div class="w-28 h-28 border-8 text-teal-500 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-teal-500 rounded-full"></div>
    </div>
  );
};

export default Loader;
