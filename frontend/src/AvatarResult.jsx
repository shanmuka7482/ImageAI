import React from "react";
import { useNavigate } from "react-router-dom";

const GeneratedAvatar = () => {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/");
  };
  return (
    <div className="flex items-center justify-center h-screen bg-zinc-900">
      <svg
        width="2em"
        height="2em"
        fill="white"
        viewBox="0 0 470 1000"
        className="cursor-pointer absolute top-4 right-4"
        onClick={handleCancel}
      >
        <path d="M452 656c12 12 18 26.333 18 43s-6 31-18 43c-12 10.667-26.333 16-43 16s-31-5.333-43-16L234 590 102 742c-12 10.667-26.333 16-43 16s-31-5.333-43-16C5.333 730 0 715.667 0 699s5.333-31 16-43l138-156L16 342C5.333 330 0 315.667 0 299s5.333-31 16-43c12-10.667 26.333-16 43-16s31 5.333 43 16l132 152 132-152c12-10.667 26.333-16 43-16s31 5.333 43 16c12 12 18 26.333 18 43s-6 31-18 43L314 500l138 156" />
      </svg>
      <div className="bg-zinc-900 rounded-lg p-10 text-center w-7/12 h-6/12">
        <h2 className="text-white text-5xl font-semibold mb-12">
          Generated Avatar
        </h2>
        <div className="border-x border-y border-neutral-500 rounded-lg p-10 background">
          <div className="flex justify-between items-center mb-4">
            <a href="/" className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H12m-1.1-2.6L16 4l-4.5 10.5 5.88-1.74m-5.88 1.74H16m-1.75 1.1H16M16 18l-3.14 2.14M16 18l3.14-2.14"
                />
              </svg>
            </a>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="border-dashed border-2 border-neutral-500 rounded-lg p-6 flex-1 flex items-center justify-center">
              <span className="text-gray-500">Original image</span>
            </div>
            <div className="border-dashed border-2 border-neutral-500 rounded-lg p-6 flex-1 flex items-center justify-center">
              <span className="text-gray-500">Generated avatar</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Style: Cartoon</span>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
              Generate New Style
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedAvatar;
