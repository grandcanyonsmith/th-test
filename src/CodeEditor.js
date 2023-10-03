import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

const Button = ({ onClick, children, active }) => (
  <button 
    onClick={onClick} 
    className={`px-4 py-2 font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-t-lg ${active ? 'bg-gray-300' : ''}`}
  >
    {children}
  </button>
);

const Select = ({ value, onChange, options }) => (
  <select className="w-full mr-2 py-2 px-4 rounded shadow-lg" value={value} onChange={onChange}>
    {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
  </select>
);

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
  output,
  view,
  handleViewChange,
  handleRunCode,
  handleSaveCode,
  textareaValue,
  setTextareaValue,
}) => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-start mb-4">
        <Button onClick={() => handleViewChange('output')} active={view === 'output'}><i data-feather="eye"></i></Button>
        <Button onClick={() => handleViewChange('code')} active={view === 'code'}><i data-feather="code"></i></Button>
      </div>
      <div className="flex justify-between mb-4">
        <Select value={selectedRepo} onChange={handleRepoChange} options={repos.map(repo => ({ value: repo, label: repo }))} />
        <Select value={selectedFile} onChange={handleFileChange} options={files.map(file => ({ value: file.download_url, label: file.name }))} />
      </div>
      <div className="flex flex-col h-screen">
        <div className="flex-grow">
          {view === 'code' ? (
            <pre className="bg-white rounded shadow-lg p-4 language-html">{code}</pre>
          ) : (
            <iframe 
              title="Code Output"
              key={code} 
              className="bg-white rounded shadow-lg p-4" 
              srcDoc={output} 
              style={{height: '100vh', width: '100%'}}
            />
          )}
        </div>
        <textarea
          value={textareaValue}
          onChange={e => setTextareaValue(e.target.value)}
        />
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex flex-col justify-between h-full">
          <Button onClick={() => setModalVisible(true)}><i data-feather="plus" className="h-4 w-4"></i></Button>
          <Button onClick={handleRunCode}><i data-feather="send" className="h-4 w-4"></i></Button>
          <Button onClick={handleSaveCode}><i data-feather="save" className="h-4 w-4"></i></Button>
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

CodeEditor.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  selectedRepo: PropTypes.string.isRequired,
  handleRepoChange: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
  selectedFile: PropTypes.string.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
  output: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  handleViewChange: PropTypes.func.isRequired,
  handleRunCode: PropTypes.func.isRequired,
  handleSaveCode: PropTypes.func.isRequired,
  textareaValue: PropTypes.string.isRequired,
  setTextareaValue: PropTypes.func.isRequired,
};

export default CodeEditor;