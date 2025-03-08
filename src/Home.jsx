import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import { mdiRobotAngry, mdiRobotHappy, mdiNotebookEdit , mdiLogout } from '@mdi/js';
import Icon from '@mdi/react';
import ReactMarkdown from 'react-markdown';

function App() {
  const location = useLocation();
  const { username, age, gender } = location.state || {}; 

  const [dreams, setDreams] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userGender, setUserGender] = useState('');

  const [selectedDream, setSelectedDream] = useState(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isDevilMode, setIsDevilMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 


  // if local
  // const URL = 'http://localhost:8080';
  const URL = 'https://dre-ams.vercel.app';

  useEffect(() => {
    if (isNightMode) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }, [isNightMode]);

  const toggleNightMode = () => {
    setIsNightMode((prev) => !prev);
  };

  const toggleDevilMode = () => {
    setIsDevilMode((prev) => !prev);
  };

  const handleAddDream = async () => {
    if (userInput.trim() === '') return;
    setIsLoading(true); 
    try {

      const response = await fetch(URL + '/api/generate_llm_response', {        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "user_input": {
            "prompt": userInput,
            "age": userAge,
            "gender": userGender,
            "isDevilMode": isDevilMode
          }
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }
  
      const analysis = await response.json(); 
      const analysis_array = analysis['output'];
      const newDream = {
        date: new Date().toLocaleDateString(),
        dream: userInput,
        analysis: analysis_array.join('\n'),
      };
  
      setDreams([newDream, ...dreams]);
      setSelectedDream(newDream);
      setUserInput('');
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div>
      <div className="header">
        <h3>Welcome, <span class="username-display">{username}</span> </h3>
        <h4>{age != 'NA' ? 'Age: '+age : ''} {gender != 'NA' ? 'Gender: '+gender : ''}</h4>
      </div>
      <button className="theme-toggle-btn" onClick={toggleNightMode}>
        {isNightMode ? '☀️' : '🌙'}
      </button>
      
      <button
        className="prompt-toggle-btn"
        onClick={toggleDevilMode}
        title={isDevilMode ? "Devil Mode" : "Angel Mode"}
      >
        <Icon path={isDevilMode ? mdiRobotAngry : mdiRobotHappy} size={1.5} />
      </button>

      <button className="logout-btn" onClick={() => window.location.href = '/'}>
      <Icon path={mdiLogout} size={1.3} />
      </button>

      
      {isLoading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="app-container">
        <aside className="sidebar">
          <h2>Dream History</h2>
          {dreams.length === 0 ? (
            <p>No dreams yet...</p>
          ) : (
            dreams.map((d, index) => (
              <div
                key={index}
                className={`history-card ${selectedDream === d ? 'active' : ''}`}
                onClick={() => setSelectedDream(d)}
              >
                <strong>{d.date}</strong>
                <p>{d.dream.length > 30 ? d.dream.slice(0, 30) + '...' : d.dream}</p>
              </div>
            ))
          )}
        </aside>

        <main className="main-content">
          <h1 className="user-welcome">Welcome to Your Dream Journal ✨</h1>

          {!selectedDream ? (
            <div className="input-container">
              <textarea
                placeholder={isDevilMode ? "Why even bother dreaming?" : "What did you dream about?"}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button className="generate-btn" onClick={handleAddDream}>
                {isDevilMode ? 'Generate Mean Analysis' : 'Generate Analysis'}
              </button>
            </div>
          ) : (
            <button className="new-dream-btn" onClick={() => setSelectedDream(null)}>
              <Icon path={mdiNotebookEdit} size={1} />
            </button>
          )}

          {selectedDream && (
            <div className="dream-display">
              <div className="dream-input">
                <p className="dream-text"> 
                  <b>{selectedDream.date}</b> 
                    <br/>
                    {selectedDream.dream}
                  </p>
              </div>
              <div className="analysis-text">
                <ReactMarkdown>{selectedDream.analysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
