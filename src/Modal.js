import React from 'react';

const Modal = ({ repos, files, isOpen, closeModal }) => {
  console.log(files); // This will log the files prop to the console

  const [selectedRepo, setSelectedRepo] = React.useState(repos && repos.length > 0 ? repos[0] : '');
  const [selectedFile, setSelectedFile] = React.useState(files && files.length > 0 ? files[0] : null);

  const handleRepoChange = (e) => {
    setSelectedRepo(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = files.find(file => file.download_url === e.target.value);
    setSelectedFile(file);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Select a Repository and a File
                </h3>
                <div className="mt-2">
                  <select className="w-full py-2 px-4 rounded shadow-lg" value={selectedRepo} onChange={handleRepoChange}>
                    {repos && repos.map(repo => <option key={repo} value={repo}>{repo}</option>)}
                  </select>
                  <select className="w-full mt-2 py-2 px-4 rounded shadow-lg" value={selectedFile ? selectedFile.download_url : ''} onChange={handleFileChange}>
                    {files && files.map(file => <option key={file.download_url} value={file.download_url}>{file.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;