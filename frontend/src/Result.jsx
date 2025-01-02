import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Access file and Base64 string from state
  const { selectedFile, basestring } = location.state || {};

  // State variables
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uploadFile = async () => {
      if (basestring) {
        try {
          setLoading(true);

          // Retrieve values from session storage
          const apiKey = sessionStorage.getItem('apiKey');
          const modelName = sessionStorage.getItem('modelName');

          // Construct request body
          const requestBody = {
            basestring,
            ...(apiKey && { apiKey }),
            ...(modelName && { modelName }),
          };

          // API request
          const response = await fetch('http://127.0.0.1:8000/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          setApiResponse(result);
          console.log('API Response:', result);
        } catch (err) {
          console.error('Error uploading the file:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    uploadFile();
  }, [basestring]);

  const handleCancel = () => {
    navigate('/');
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
      <div className="bg-zinc-900 rounded-lg p-10 text-center">
        <h1 className="text-white text-5xl font-semibold mb-12">
          Image Uploaded
        </h1>

        {selectedFile ? (
          <>
            <p className="text-gray-400 mb-4">
              Uploaded File: {selectedFile.name}
            </p>
            <p className="text-gray-400 mb-4">
              File Type: {selectedFile.type}
            </p>
            <div className="flex items-center justify-center">
              <img
                src={`data:${selectedFile.type};base64,${basestring}`}
                alt="Uploaded preview"
                className="w-64 h-64 object-contain"
              />
            </div>
          </>
        ) : (
          <p className="text-gray-400">No file uploaded</p>
        )}

        {error && (
          <p className="text-red-500 mt-4">Error: {error}</p>
        )}

        {loading && (
          <button className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg border border-stroke bg-transparent px-6 py-3 text-base font-medium text-dark dark:border-dark-3 dark:text-white">
            <span>
              <svg
                className="animate-spin"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="9" stroke="#E5E7EB" strokeWidth="2" />
                <path
                  d="M18.4736 13.0353C18.9931 13.2214 19.5703 12.9518 19.7037 12.4163..."
                  stroke="#3758F9"
                  strokeWidth="4"
                />
              </svg>
            </span>
            Loading...
          </button>
        )}

        {apiResponse && (
          <>
            <p className="text-green-500 mt-4 text-2xl">
              Response: {apiResponse.Output}
            </p>
            <p className="text-green-500 mt-4 text-2xl">
              Response: {apiResponse.Extended_text}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
