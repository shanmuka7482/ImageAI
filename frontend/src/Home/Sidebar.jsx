import React, { useState } from "react";

const Sidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isAPIVisible, setAPIVisible] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const toggleAPIKey = () => {
    setAPIVisible(!isAPIVisible);
  };

  const saveCred = () => {
    if (!apiKey) {
      alert("Enter Api Key");
      return;
    }

    sessionStorage.setItem("apiKey", apiKey);
    alert("Credentials saved successfully!");
  };



  return (
    <div className="bg-zinc-900 pt-2 pl-2 absolute">
      <svg
        width="2em"
        height="2em"
        fill="white"
        viewBox="0 0 24 24"
        onClick={toggleSidebar}
        className="cursor-pointer text-center"
      >
        <path d="M19 13H3v-2h16l-4-4 1.4-1.4 6.4 6.4-6.4 6.4L15 17l4-4M3 6h10v2H3V6m10 10v2H3v-2h10z" />
      </svg>

      <div
        id="drawer-navigation"
        className={`fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform bg-[#262626] ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } background`}
        tabIndex="1"
        aria-labelledby="drawer-navigation-label"
      >
        {/* Header */}
        <div className="flex flex-row items-center">
          <svg
            width="2em"
            height="2em"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="mr-4 text-emerald-500"
          >
            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
          </svg>
          <h5
            id="drawer-navigation-label"
            className="text-base font-semibold text-white"
          >
            ImageAI
          </h5>
        </div>

        {/* Close Button */}
        <button
          type="button"
          aria-controls="drawer-navigation"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={toggleSidebar}
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>

        {/* Content */}
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium flex flex-col">
            {/* API Key Input */}
            <li>
              <a
                href="#"
                className="flex items-center p-2 rounded-lg text-white group"
                onClick={toggleAPIKey}
              >
                <svg
                  className={`w-5 h-5 transition duration-75 text-gray-400 group-hover:text-emerald-500 ${
                    isAPIVisible ? "text-emerald-500" : ""
                  }`}
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2M2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                </svg>
                <span className="ms-3 text-gray-400 group-hover:text-emerald-500">
                  API Key
                </span>
              </a>
              <input
                type="text"
                className={`border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white ${
                  isAPIVisible ? "" : "hidden"
                }`}
                placeholder="Your HuggingFace API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </li>
          </ul>

          {/* Save Button */}
          <div className="grid">
            <button
              className="mt-6 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer"
              onClick={saveCred}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
