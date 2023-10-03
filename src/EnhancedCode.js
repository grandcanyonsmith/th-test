import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'prismjs/themes/prism-okaidia.css';
import feather from 'feather-icons';

const API_URL = 'https://flask-hello-world2-three.vercel.app/';

const fetchRepos = () => axios.get(`${API_URL}github_repos_list`);
const fetchFiles = (repoName) => axios.post(`${API_URL}get_all_contents`, { repo_name: repoName });
const fetchFileContent = (fileUrl) => axios.get(fileUrl);
const runCode = (code) => axios.post('https://xhy5at2dbpxeys62rsx4f6lfay0yigqt.lambda-url.us-west-2.on.aws/', { code });
const saveCode = (code) => axios.post(`${API_URL}update`, { code });

const EnhancedCodeEditor = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [view, setView] = useState('code');

  useEffect(() => {
    fetchRepos()
      .then(({ data }) => setRepos(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedRepo) {
      fetchFiles(selectedRepo)
        .then(({ data }) => setFiles(data))
        .catch(console.error);
    }
  }, [selectedRepo]);

  useEffect(() => {
    feather.replace();
  }, [view]);

  useEffect(() => {
    if (selectedFile.endsWith('.html')) {
      setView('output');
    } else {
      setView('code');
    }
  }, [code, selectedFile]);

  const handleRepoChange = (e) => setSelectedRepo(e.target.value);

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.value);
    try {
      const { data } = await fetchFileContent(e.target.value);
      setCode(data);
      if (e.target.options[e.target.selectedIndex].text.endsWith('.html')) {
        setView('output');
        setOutput(data);
      } else {
        setView('code');
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
    }
  };

  const handleRunCode = async () => {
    try {
      const { data } = await runCode(code);
      setOutput(data);
    } catch (error) {
      console.error('Error running code:', error);
    }
  };

  const handleSaveCode = async () => {
    try {
      await saveCode(code);
      alert('Code saved successfully!');
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'output') {
      setOutput(code);
    }
  };

  return (
    <CodeEditor
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      repos={repos}
      selectedRepo={selectedRepo}
      handleRepoChange={handleRepoChange}
      files={files}
      selectedFile={selectedFile}
      handleFileChange={handleFileChange}
      code={code}
      setCode={setCode}
      output={output}
      view={view}
      handleViewChange={handleViewChange}
      handleRunCode={handleRunCode}
      handleSaveCode={handleSaveCode}
    />
  );
};

const CodeEditor = ({
  modalVisible,
  setModalVisible,
  repos,
  selectedRepo,
  handleRepoChange,
  files,
  selectedFile,
  handleFileChange,
  code,
  setCode,
  output,
  view,
  handleViewChange,
  handleRunCode,
  handleSaveCode,
}) => {
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
        <select className="w-full mr-2 py-2 px-4 rounded shadow-lg" value={selectedRepo} onChange={handleRepoChange}>
          {repos.map(repo => <option key={repo} value={repo}>{repo}</option>)}
        </select>
        <select className="w-full mr-2 py-2 px-4 rounded shadow-lg" value={selectedFile} onChange={handleFileChange}>
          {files.map(file => <option key={file.download_url} value={file.download_url}>{file.name}</option>)}
        </select>
      </div>
      <div className="flex flex-col h-screen">
        <div className="flex-grow">
          {view === 'code' ? (
            <pre className="bg-white rounded shadow-lg p-4 language-html">{code}</pre>
          ) : (
            <iframe 
              key={code} 
              className="bg-white rounded shadow-lg p-4" 
              srcDoc={output} 
              style={{height: '100vh', width: '100%'}}
            />
          )}
        </div>
        <textarea className="border-2 border-blue-500 p-2 w-full" onChange={(e) => setCode(e.target.value)}></textarea>
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex flex-col justify-between h-full">
          <button onClick={() => setModalVisible(true)} className="p-1">
            <i data-feather="plus" className="h-4 w-4"></i>
          </button>
          <button className="p-1" onClick={handleRunCode}>
            <i data-feather="send" className="h-4 w-4"></i>
          </button>
          <button className="p-1" onClick={handleSaveCode}>
            <i data-feather="save" className="h-4 w-4"></i>
          </button>
        </div>
      </div>
      {modalVisible && (
        <Modal 
          repos={repos} 
          selectedRepo={selectedRepo} 
          handleRepoChange={handleRepoChange} 
          files={files} 
          selectedFile={selectedFile} 
          handleFileChange={handleFileChange} 
          closeModal={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

const Modal = ({ repos, selectedRepo, handleRepoChange, files, selectedFile, handleFileChange, closeModal }) => {
  
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
                    {repos.map(repo => <option key={repo} value={repo}>{repo}</option>)}
                  </select>
                  <select className="w-full mt-2 py-2 px-4 rounded shadow-lg" value={selectedFile} onChange={handleFileChange}>
                    {files.map(file => <option key={file.download_url} value={file.download_url}>{file.name}</option>)}
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

export default EnhancedCodeEditor;