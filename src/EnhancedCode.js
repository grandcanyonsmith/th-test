import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'prismjs/themes/prism-okaidia.css';
import feather from 'feather-icons';
import CodeEditor from './CodeEditor';

const API_URL = 'https://flask-hello-world2-three.vercel.app/';

const useFetch = (url, method, body) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({ url, method, data: body });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [url, method, body]);
  return data;
};

const useFeatherIcons = (activeView) => {
  useEffect(() => {
    feather.replace();
  }, [activeView]);
};

const EnhancedCodeEditor = () => {
  const [isReferenceFileSelectorVisible, setReferenceFileSelectorVisible] = useState(false);
  const [selectedGithubRepo, setSelectedGithubRepo] = useState('');
  const [selectedGithubRepoFile, setSelectedGithubRepoFile] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [codePreview, setCodePreview] = useState('');
  const [activeView, setActiveView] = useState('code');
  const [userRequest, setUserRequest] = useState('');
  const userRequestRef = useRef();

  useEffect(() => {
    userRequestRef.current = userRequest;
  }, [userRequest]);

  const githubRepos = useFetch(`${API_URL}github_repos_list`, 'get');
  const githubRepoFiles = useFetch(`${API_URL}get_all_contents`, 'post', { repo_name: selectedGithubRepo });

  useFeatherIcons(activeView);

  const handleGithubRepoSelection = (e) => {
    setSelectedGithubRepo(e.target.value);
    setSelectedGithubRepoFile('');
  };

  const handleGithubRepoFileSelection = async (e) => {
    setSelectedGithubRepoFile(e.target.value);
    const { data } = await axios.get(e.target.value);
    setSourceCode(data || '');
    if (e.target.options[e.target.selectedIndex].text.endsWith('.html')) {
      setActiveView('output');
      setCodePreview(data);
    } else {
      setActiveView('code');
    }
  };

  const handleUserRequest = async () => {
    const event_data = {
      fileName: selectedGithubRepoFile,
      code: sourceCode,
      request: userRequestRef.current,
      repoName: selectedGithubRepo,
    };
    try {
      const response = await fetch('https://uslbd6l6ssolgomdrcdhnqa5me0rnsee.lambda-url.us-west-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event_data),
      });
      const data = await response.json();
      setSourceCode(data.fileContents || '');
    } catch (error) {
      console.error('Error:', error);
      setSourceCode('');
    }
  };

  const handleSaveSourceCode = async () => {
    try {
      await axios.post(`${API_URL}update`, { code: sourceCode });
      alert('Code saved successfully!');
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const handleActiveViewChange = (newView) => {
    setActiveView(newView);
    if (newView === 'output') {
      setCodePreview(sourceCode);
    }
  };

  return (
    <CodeEditor
      userRequest={userRequest}
      setUserRequest={setUserRequest}
      isReferenceFileSelectorOpen={isReferenceFileSelectorVisible}
      closeReferenceFileSelector={setReferenceFileSelectorVisible}
      githubRepos={githubRepos}
      selectedGithubRepo={selectedGithubRepo}
      handleGithubRepoSelection={handleGithubRepoSelection}
      githubRepoFiles={githubRepoFiles}
      selectedGithubRepoFile={selectedGithubRepoFile}
      handleGithubRepoFileSelection={handleGithubRepoFileSelection}
      sourceCode={sourceCode}
      setSourceCode={setSourceCode}
      codePreview={codePreview}
      activeView={activeView}
      handleUserRequest={handleUserRequest}
      handleSaveSourceCode={handleSaveSourceCode}
      handleActiveViewChange={handleActiveViewChange}
    />
  );
};

export default EnhancedCodeEditor;