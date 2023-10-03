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

const useFeatherIcons = (view) => {
  useEffect(() => {
    feather.replace();
  }, [view]);
};

const EnhancedCodeEditor = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [view, setView] = useState('code');
  const [textareaValue, setTextareaValue] = useState('');
  const textareaValueRef = useRef();

  useEffect(() => {
    textareaValueRef.current = textareaValue;
  }, [textareaValue]);

  const repos = useFetch(`${API_URL}github_repos_list`, 'get');
  const files = useFetch(`${API_URL}get_all_contents`, 'post', { repo_name: selectedRepo });

  useFeatherIcons(view);

  const handleRepoChange = (e) => setSelectedRepo(e.target.value);

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.value);
    const { data } = await axios.get(e.target.value);
    setCode(data || '');
    if (e.target.options[e.target.selectedIndex].text.endsWith('.html')) {
      setView('output');
      setOutput(data);
    } else {
      setView('code');
    }
  };

  const handleRunCode = async () => {
    const event_data = {
      fileName: selectedFile,
      code: code,
      request: textareaValueRef.current,
      repoName: selectedRepo,
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
      setCode(data.fileContents || '');
    } catch (error) {
      console.error('Error:', error);
      setCode('');
    }
  };

  const handleSaveCode = async () => {
    try {
      await axios.post(`${API_URL}update`, { code });
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
      textareaValue={textareaValue}
      setTextareaValue={setTextareaValue}
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
      handleRunCode={handleRunCode}
      handleSaveCode={handleSaveCode}
      handleViewChange={handleViewChange}
    />
  );
};

export default EnhancedCodeEditor;