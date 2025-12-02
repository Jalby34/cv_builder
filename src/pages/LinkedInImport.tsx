import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Linkedin, AlertCircle } from 'lucide-react';

const LinkedInImport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Linkedin className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">LinkedIn Import</h1>
          </div>

          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">How to export your LinkedIn data:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Go to LinkedIn Settings & Privacy</li>
              <li>Select "Data Privacy" → "Get a copy of your data"</li>
              <li>Request "Profile" data</li>
              <li>Download and upload the ZIP file here</li>
            </ol>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload LinkedIn Data Export
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your LinkedIn data file here, or click to browse
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              accept=".zip,.json"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer font-semibold"
            >
              Choose File
            </label>
            {file && (
              <p className="mt-4 text-sm text-gray-600">Selected: {file.name}</p>
            )}
          </div>

          <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Privacy Notice</h4>
                <p className="text-sm text-amber-800">
                  Your LinkedIn data is processed locally and never stored on our servers. We only
                  extract information to create your CV, which you have full control over.
                </p>
              </div>
            </div>
          </div>

          <button
            disabled={!file}
            className="w-full mt-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Import & Generate CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInImport;
