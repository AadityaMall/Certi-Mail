import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
    <div class="flex-col gap-4 w-full flex items-center justify-center">
      <div class="w-32 h-32 border-8 text-teal-500 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-teal-500 rounded-full"></div>
    </div>
    </div>
  );
};

export default Loader;
