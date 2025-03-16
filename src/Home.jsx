import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import { mdiRobotAngry, mdiRobotHappy, mdiNotebookEdit, mdiLogout, mdiTrashCan } from '@mdi/js';
import Icon from '@mdi/react';
import ReactMarkdown from 'react-markdown';

function App() {
  const location = useLocation();
  const { username } = location.state || {};
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [dreams, setDreams] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [selectedDream, setSelectedDream] = useState(null);
  const buttons_with_devil = document.getElementsByClassName('can-be-devil');

  const [isNightMode, setIsNightMode] = useState(() => {
    const savedMode = localStorage.getItem('isNightMode');
    return savedMode === 'true';
  });
  
  const [isDevilMode, setIsDevilMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const URL = 'https://dre-ams.vercel.app/api';

  useEffect(() => {
    if (username) {
      fetchUserData(username);
    }
  }, [username]);

  useEffect(() => {
    if (isNightMode) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
    localStorage.setItem('isNightMode', isNightMode);
  }, [isNightMode]);

  useEffect(() => {

    if (isDevilMode) {
      for (let i = 0; i < buttons_with_devil.length; i++) {
        buttons_with_devil[i].classList.add('devil-mode');
      }
    } else {
      for (let i = 0; i < buttons_with_devil.length; i++) {
        buttons_with_devil[i].classList.remove('devil-mode');
      }
    }
  }, [isDevilMode]);

  const fetchUserData = async (username) => {
    try {
      const response = await fetch(`${URL}/get_user_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: username })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();

      const processedDreams = [];

      if (userData.Dreams) {
        Object.entries(userData.Dreams).forEach(([dreamText, dreamEntries]) => {
          dreamEntries.forEach((entry) => {
            processedDreams.push({
              date: entry.date,
              dream: dreamText,
              analysis: Array.isArray(entry.llm_response) 
                ? entry.llm_response.join('\n') 
                : entry.llm_response
            });
          });
        });
      }

      processedDreams.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDreams(processedDreams);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleDeleteDream = async (dreamText) => {
    try {
      const response = await fetch(`${URL}/delete_dream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: username, dream_text: dreamText }),
      });
  
      const result = await response.json();
      if (response.ok) {
        setDreams(dreams.filter(d => !(d.dream === dreamText)));
        setSelectedDream(null);
      } else {
        console.error('Error deleting dream:', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddDream = async () => {
    if (userInput.trim() === '') return;
    setIsLoading(true);

    try {
      const response = await fetch(`${URL}/generate_llm_response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_input: {
            prompt: userInput,
            age: age || 'Unknown',
            gender: gender || 'Undefined',
            isDevilMode: isDevilMode,
            user_name: username
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }

      const analysis = await response.json();
      const analysis_array = Array.isArray(analysis.output) ? analysis.output : [];

      const newDream = {
        date: new Date().toLocaleDateString(),
        dream: userInput,
        analysis: analysis_array.join('\n')
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
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <div className="header">
        <h3>Welcome, <span className="username-display">{username}</span></h3>
      </div>
      <div 
        className={`hamburger-menu ${isSidebarOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
      >
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <button className="theme-toggle-btn btn" onClick={() => setIsNightMode(prev => !prev)}>
        {isNightMode ? '☀️' : '🌙'}
      </button>


      <button className="prompt-toggle-btn btn can-be-devil" onClick={() => setIsDevilMode(!isDevilMode)}>
        <Icon path={isDevilMode ? mdiRobotAngry : mdiRobotHappy} size={1.5} />
      </button>

      <button className="logout-btn btn" onClick={() => window.location.href = '/'}>
        <Icon path={mdiLogout} size={1.3} />
      </button>

      {isLoading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}

      {selectedDream && (
        <button className="new-dream-btn" onClick={() => setSelectedDream(null)}>
          <Icon path={mdiNotebookEdit} size={1.5} />
        </button>
      )}

      <div className="app-container">
      <aside className={`sidebar ${isSidebarOpen ? 'active' : ''}`}>
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
                <button class="delete-dream-btn" onClick={() => handleDeleteDream(selectedDream.dream)}>
                  <Icon path={mdiTrashCan} size={1} />
                </button>
                <strong>{d.date}</strong>
                <p>{d.dream.length > 30 ? d.dream.slice(0, 30) + '...' : d.dream}</p>
              </div>
            ))
          )}
        </aside>

        <main className="main-content">
          {!selectedDream ? (
            <div className="new-dream-container">
              <h1 className="user-welcome">Welcome to Your Dream Journal ✨</h1>
              <div className="input-container">
                <textarea
                  placeholder={isDevilMode ? "Why even bother dreaming?" : "What did you dream about?"}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <button className="generate-btn can-be-devil" onClick={handleAddDream}>
                  {isDevilMode ? 'Generate Mean Analysis' : 'Generate Analysis'}
                </button>
              </div>
            </div>
          ) : null}


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
