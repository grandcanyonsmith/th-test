import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'prismjs/themes/prism-okaidia.css';
import 'feather-icons';

const EnhancedCodeEditor = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [view, setView] = useState('code'); // 'code' or 'output'

  useEffect(() => {
    axios.get('https://flask-hello-world2-three.vercel.app/github_repos_list')
      .then(({ data }) => setRepos(data))
      .catch(error => console.error('Error fetching repos:', error));
  }, []);

  useEffect(() => {
    if (selectedRepo) {
      axios.post('https://flask-hello-world2-git-main-grandcanyonsmith.vercel.app/get_all_contents', { repo_name: selectedRepo })
        .then(({ data }) => setFiles(data))
        .catch(error => console.error('Error fetching files:', error));
    }
  }, [selectedRepo]);

  const handleRepoChange = async (e) => {
    setSelectedRepo(e.target.value);
    try {
      const { data } = await axios.post('https://flask-hello-world2-git-main-grandcanyonsmith.vercel.app/get_all_contents', { repo_name: e.target.value });
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };
  
  const handleFileChange = async (e) => {
    setSelectedFile(e.target.value);
    try {
      const { data } = await axios.get(e.target.value);
      setCode(data);
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };

  const handleRunCode = async () => {
    try {
      const { data } = await axios.post('https://xhy5at2dbpxeys62rsx4f6lfay0yigqt.lambda-url.us-west-2.on.aws/', { code });
      setOutput(data);
    } catch (error) {
      console.error('Error running code:', error);
    }
  };
  
  const handleSaveCode = async () => {
    try {
      await axios.post('https://flask-hello-world2-three.vercel.app/update', { code });
      alert('Code saved successfully!');
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-start mb-4">
        <button onClick={() => handleViewChange('output')} className={`px-4 py-2 font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-t-lg border-r-0 ${view === 'output' ? 'bg-gray-300' : ''}`}>
          <i data-feather="eye"></i>
        </button>
        <button onClick={() => handleViewChange('code')} className={`px-4 py-2 font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-t-lg ${view === 'code' ? 'bg-gray-300' : ''}`}>
          <i data-feather="code"></i>
        </button>
      </div>    
      <div className="flex justify-between mb-4">
        <select id="repoDropdown" className="w-full mr-2 py-2 px-4 rounded shadow-lg" value={selectedRepo} onChange={handleRepoChange}>
          {repos.map(repo => <option key={repo} value={repo}>{repo}</option>)}
        </select>
        <select id="fileDropdown" className="w-full mr-2 py-2 px-4 rounded shadow-lg" value={selectedFile} onChange={handleFileChange}>
          {files.map(file => <option key={file.download_url} value={file.download_url}>{file.name}</option>)}
        </select>
      </div>
      <div id="tabs" className="flex overflow-x-auto mb-4"></div>
      <pre id="codeBox" className="w-full h-screen bg-white rounded shadow-lg p-4 language-html">{code}</pre>
      <div id="outputBox" className="w-full h-screen bg-white rounded shadow-lg p-4 hidden">{output}</div>
      <div className="flex justify-between mt-4">
        <textarea id="textBox" className="border-2 border-blue-500 p-2 inline-block mt-4 mr-2 w-full" value={code} onChange={(e) => setCode(e.target.value)}></textarea>
        <div className="flex flex-col justify-between h-full">
          <button onClick={openModal} className="p-1">
            <i data-feather="plus" className="h-4 w-4"></i>
          </button>
          <button id="submitBtn" className="p-1" onClick={handleRunCode}>
            <i data-feather="send" className="h-4 w-4"></i>
          </button>
          <button id="saveBtn" className="p-1" onClick={handleSaveCode}>
            <i data-feather="save" className="h-4 w-4"></i>
          </button>
        </div>
        <button id="runBtn" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded float-right hidden">
          Run
        </button>
        <div id="loader" className="hidden absolute h-5 w-5 border-t-2 border-white rounded-full animate-spin"></div>
      </div>
      {modalVisible && (
        <div id="myModal" className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Select a reference file
                    </h3>
                    <div className="mt-2">
                      <div>
                        <label id="listbox-label" className="block text-sm font-medium leading-6 text-gray-900">Select a Repo</label>
                        <div className="relative mt-2">
                          <select id="repoOptions" className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6" value={selectedRepo} onChange={handleRepoChange}>
                            {repos.map(repo => <option key={repo} value={repo}>{repo}</option>)}
                          </select>
                        </div>
                        <label id="listbox-label" className="block text-sm font-medium leading-6 text-gray-900">Select a File</label>
                        <div className="relative mt-2">
                          <select id="options" className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6" value={selectedFile} onChange={handleFileChange}>
                            {files.map(file => <option key={file.download_url} value={file.download_url}>{file.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" onClick={closeModal} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCodeEditor;