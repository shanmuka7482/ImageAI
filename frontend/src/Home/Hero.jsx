import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GenerateAltText = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [basestring, setBasestring] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("alt-text"); // Default to 'alt-text'

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB. Please upload a smaller file.");
        return;
      }

      const reader = new FileReader();
      setLoading(true);

      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setBasestring(base64String);
        setSelectedFile(file);
        setLoading(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (!sessionStorage.getItem("apiKey")) {
      alert("Enter The API Key");
    } else {
      if (selectedFile && basestring) {
        if (selectedOption === "alt-text") {
          navigate("/alt-result", {
            state: {
              selectedFile,
              basestring,
            },
          });
        } else {
          navigate("/Avatar-result", {
            state: {
              selectedFile,
              basestring,
            },
          });
        }
      } else {
        alert("Please upload a file before continuing.");
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setBasestring(null);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-900">
      <div className="bg-zinc-900 rounded-lg p-10 text-center w-7/12">
        <h1 className="text-white text-5xl font-semibold mb-12">ImageAI</h1>

        <div className="border-x border-y border-neutral-500 rounded-lg p-10 background">
          {loading && <p className="text-white">Loading...</p>}

          {selectedFile ? (
            <div className="border-dashed border-2 border-neutral-500 rounded-lg p-10 background">
              <div className="flex flex-col items-center">
                <div className="flex justify-end w-full pb-3">
                  <svg
                    width="2em"
                    height="2em"
                    fill="white"
                    viewBox="0 0 470 1000"
                    className="cursor-pointer"
                    onClick={handleCancel}
                  >
                    <path d="M452 656c12 12 18 26.333 18 43s-6 31-18 43c-12 10.667-26.333 16-43 16s-31-5.333-43-16L234 590 102 742c-12 10.667-26.333 16-43 16s-31-5.333-43-16C5.333 730 0 715.667 0 699s5.333-31 16-43l138-156L16 342C5.333 330 0 315.667 0 299s5.333-31 16-43c12-10.667 26.333-16 43-16s31 5.333 43 16l132 152 132-152c12-10.667 26.333-16 43-16s31 5.333 43 16c12 12 18 26.333 18 43s-6 31-18 43L314 500l138 156" />
                  </svg>
                </div>

                <img
                  src={`data:${selectedFile.type};base64,${basestring}`}
                  alt="data"
                  className="h-64"
                />

                <button
                  className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer"
                  onClick={handleContinue}
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="border-dashed border-2 border-neutral-500 rounded-lg p-10 background">
              <div className="flex flex-col items-center">
                <p className="text-gray-400 mb-2">
                  Drag and drop your image here
                </p>
                <p className="text-gray-400">or</p>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="fileInput"
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
                >
                  Browse Files
                </label>
                <p className="text-gray-500 text-sm mt-4">
                  Supported formats: JPG, PNG, GIF (max 5MB)
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 pt-5">
            <div className="border border-neutral-500 rounded-md p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="image-option"
                  value="alt-text"
                  checked={selectedOption === "alt-text"} // checked based on state
                  onChange={handleOptionChange} // call the change handler
                  className="h-4 w-4 accent-green-600 border-gray-300 rounded-full focus:ring-0 outline-none hover:accent-green-600"
                />

                <span className="flex flex-col items-start pl-4">
                  <span className="font-semibold text-sm text-gray-500">
                    Generate Alt Text
                  </span>
                  <span className="text-gray-600 text-xs">
                    Create accessible image descriptions
                  </span>
                </span>
              </label>
            </div>
            <div className="border border-neutral-500 rounded-md p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="image-option"
                  value="avatar"
                  checked={selectedOption === "avatar"} // checked based on state
                  onChange={handleOptionChange} // call the change handler
                  className="h-4 w-4 accent-green-600 border-gray-300 rounded-full focus:ring-0 outline-none"
                />
                <span className="flex flex-col items-start pl-4">
                  <span className="font-semibold text-sm text-gray-500">
                    Generate Avatar
                  </span>
                  <span className="text-gray-600 text-xs">
                    Create a stylized avatar from your image
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateAltText;
