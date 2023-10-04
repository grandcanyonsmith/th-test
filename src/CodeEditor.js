import React from 'react';
import PropTypes from 'prop-types';
import ReferenceFileSelector from './ReferenceFileSelector';

const Button = ({ onClick, children, active }) => {
  const buttonClass = `px-4 py-2 font-bold text-white bg-gray-800 hover:bg-gray-700 rounded-t-lg ${active ? 'bg-gray-700' : ''}`;
  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

const Select = ({ value, onChange, options }) => {
  const selectOptions = options.map(option => <option key={option.value} value={option.value}>{option.label}</option>);
  return (
    <select className="w-full mr-2 py-2 px-4 rounded shadow-lg bg-gray-800 text-white" value={value} onChange={onChange}>
      {selectOptions}
    </select>
  );
};

const Dropdowns = ({ selectedGithubRepo, handleGithubRepoChange, repoOptions, selectedGithubRepoFile, handleGithubRepoFileChange, fileOptions }) => (
  <div className="flex justify-between mb-4">
    <Select value={selectedGithubRepo} onChange={handleGithubRepoChange} options={repoOptions} />
    <Select value={selectedGithubRepoFile} onChange={handleGithubRepoFileChange} options={fileOptions} />
  </div>
);

const ToggleCodeView = ({ activeView, sourceCode, codePreview }) => (
  <div className="flex-grow">
    {activeView === 'code' ? (
      <pre className="bg-gray-800 rounded shadow-lg p-4 language-html">{sourceCode}</pre>
    ) : (
      <iframe 
        title="Code Output"
        key={sourceCode} 
        className="bg-gray-800 rounded shadow-lg p-4" 
        srcDoc={codePreview} 
        style={{height: '100vh', width: '100%'}}
      />
    )}
  </div>
);

const UserRequestButtonsContainer = ({ setReferenceFileSelectorVisible, handleUserRequest, handleSaveSourceCode }) => (
  <div className="flex flex-col justify-between h-full">
    <Button onClick={() => setReferenceFileSelectorVisible(true)}><i data-feather="plus" className="h-4 w-4"></i></Button>
    <Button onClick={handleUserRequest}><i data-feather="send" className="h-4 w-4"></i></Button>
    <Button onClick={handleSaveSourceCode}><i data-feather="save" className="h-4 w-4"></i></Button>
  </div>
);

const UserRequestInputContainer = ({ userRequest, setUserRequest }) => (
  <textarea
    value={userRequest}
    onChange={e => setUserRequest(e.target.value)}
    className="bg-gray-800 text-white"
  />
);

const CodeEditor = (props) => {
  const {
    isReferenceFileSelectorVisible,
    setReferenceFileSelectorVisible,
    githubRepos,
    selectedGithubRepo,
    handleGithubRepoChange,
    githubRepoFiles,
    selectedGithubRepoFile,
    handleGithubRepoFileChange,
    sourceCode,
    codePreview,
    activeView,
    handleActiveViewChange,
    handleUserRequest,
    handleSaveSourceCode,
    userRequest,
    setUserRequest,
  } = props;

  const repoOptions = githubRepos.map(repo => ({ value: repo, label: repo }));
  const fileOptions = githubRepoFiles.map(file => ({ value: file.download_url, label: file.name }));

  return (
    <>
      <div className="container mx-auto p-4 bg-gray-900 text-white">
        <div className="flex justify-start mb-4">
          <Button onClick={() => handleActiveViewChange('output')} active={activeView === 'output'}><i data-feather="eye"></i></Button>
          <Button onClick={() => handleActiveViewChange('code')} active={activeView === 'code'}><i data-feather="code"></i></Button>
        </div>
        <Dropdowns 
          selectedGithubRepo={selectedGithubRepo} 
          handleGithubRepoChange={handleGithubRepoChange} 
          repoOptions={repoOptions} 
          selectedGithubRepoFile={selectedGithubRepoFile} 
          handleGithubRepoFileChange={handleGithubRepoFileChange} 
          fileOptions={fileOptions} 
        />
        <div className="flex flex-col h-screen">
          <ToggleCodeView activeView={activeView} sourceCode={sourceCode} codePreview={codePreview} />
          <UserRequestInputContainer userRequest={userRequest} setUserRequest={setUserRequest} />
        </div>
        <div className="flex justify-between mt-4">
          <UserRequestButtonsContainer 
            setReferenceFileSelectorVisible={setReferenceFileSelectorVisible} 
            handleUserRequest={handleUserRequest} 
            handleSaveSourceCode={handleSaveSourceCode} 
          />
        </div>
        {isReferenceFileSelectorVisible && (
          <ReferenceFileSelector 
            githubRepos={githubRepos} 
            selectedGithubRepo={selectedGithubRepo} 
            handleGithubRepoChange={handleGithubRepoChange} 
            githubRepoFiles={githubRepoFiles} 
            selectedGithubRepoFile={selectedGithubRepoFile}
            handleGithubRepoFileChange={handleGithubRepoFileChange} 
            closeReferenceFileSelector={() => setReferenceFileSelectorVisible(false)}
          />
        )}
      </div>
    </>
  );
};

CodeEditor.propTypes = {
  isReferenceFileSelectorVisible: PropTypes.bool.isRequired,
  setReferenceFileSelectorVisible: PropTypes.func.isRequired,
  githubRepos: PropTypes.array.isRequired,
  selectedGithubRepo: PropTypes.string.isRequired,
  handleGithubRepoChange: PropTypes.func.isRequired,
  githubRepoFiles: PropTypes.array.isRequired,
  selectedGithubRepoFile: PropTypes.string.isRequired,
  handleGithubRepoFileChange: PropTypes.func.isRequired,
  sourceCode: PropTypes.string.isRequired,
  codePreview: PropTypes.string.isRequired,
  activeView: PropTypes.string.isRequired,
  handleActiveViewChange: PropTypes.func.isRequired,
  handleUserRequest: PropTypes.func.isRequired,
  handleSaveSourceCode: PropTypes.func.isRequired,
  userRequest: PropTypes.string.isRequired,
  setUserRequest: PropTypes.func.isRequired,
};

export default CodeEditor;