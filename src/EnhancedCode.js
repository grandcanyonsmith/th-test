import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'prismjs/themes/prism-okaidia.css';
import feather from 'feather-icons';
import CodeEditor from './CodeEditor';

const API_URL = 'https://flask-hello-world2-three.vercel.app/';

const useFetchRepos = () => {
  const [repos, setRepos] = useState([]);
  useEffect(() => {
    axios.get(`${API_URL}github_repos_list`)
      .then(({ data }) => setRepos(data))
      .catch(console.error);
  }, []);
  return repos;
};


const useFetchFiles = (selectedRepo) => {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    if (selectedRepo) {
      axios.post(`${API_URL}get_all_contents`, { repo_name: selectedRepo })
        .then(({ data }) => setFiles(data))
        .catch(console.error);
    }
  }, [selectedRepo]);
  return files;
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
  

  // Update the ref whenever textareaValue changes
  useEffect(() => {
    textareaValueRef.current = textareaValue;
  }, [textareaValue]);

  const repos = useFetchRepos();
  const files = useFetchFiles(selectedRepo);
  
  useFeatherIcons(view);

  const handleRepoChange = (e) => setSelectedRepo(e.target.value);

  const handleFileChange = async (e) => {
    setSelectedFile(e.target.value);
    try {
      const { data } = await axios.get(e.target.value);
      setCode(data || ''); // set code to empty string if data is undefined
      if (e.target.options[e.target.selectedIndex].text.endsWith('.html')) {
        setView('output');
        setOutput(data);
      } else {
        setView('code');
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
      setCode(''); // set code to empty string if there's an error
    }
  };


  const handleRunCode = () => {
    const event_data = {
      fileName: selectedFile,
      code: code,
      request: textareaValueRef.current, // Use the ref instead of the state
      repoName: selectedRepo,
    };
  
    console.log('Sending POST request with data:', event_data);
  
    fetch('https://uslbd6l6ssolgomdrcdhnqa5me0rnsee.lambda-url.us-west-2.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event_data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setCode(data.fileContents || ''); // set code to empty string if fileContents is undefined
    })
    .catch((error) => {
      console.error('Error:', error);
      setCode(''); // set code to empty string if there's an error
    });
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




