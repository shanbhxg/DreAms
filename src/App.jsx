import { useState, useEffect } from 'react';
import './App.css';
import { mdiRobotAngry, mdiRobotHappy } from '@mdi/js';
import Icon from '@mdi/react';

function App() {
  const [dreams, setDreams] = useState([]);
  const [dreamInput, setDreamInput] = useState('');
  const [selectedDream, setSelectedDream] = useState(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isDevilMode, setIsDevilMode] = useState(false);
  // const goodAnalysis = ["This is multiple paragraphs of analysis.", "This is another paragraph of analysis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nisi ultricies tincidunt. Donec nec nunc nec nisi ultricies tincidunt. Donec nec nunc nec nisi ultricies tincidunt. Donec nec nunc nec nisi ultricies tincidunt."];
  // const meanAnalysis = ["Why even bother dreaming? It's all pointless. Why even do anything? It's all pointless. Why even bother dreaming? It's all pointless. Why even do anything? It's all pointless. Why even bother dreaming? It's all pointless. Why even do anything? It's all pointless."];
  const goodAnalysis = ["This is a short analysis.", "This is another short analysis."];
  const meanAnalysis = ["This is a short analysis.", "This is another short analysis."];
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

  const handleAddDream = () => {
    if (dreamInput.trim() === '') return;

    const newDream = {
      date: new Date().toLocaleDateString(),
      dream: dreamInput,
      analysis: isDevilMode
        ? meanAnalysis.join(' ')
        : goodAnalysis.join(' '),
    };

    setDreams([newDream, ...dreams]);
    setSelectedDream(newDream);
    setDreamInput('');
  };

  return (
    <div>
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
                value={dreamInput}
                onChange={(e) => setDreamInput(e.target.value)}
              />
              <button className="generate-btn" onClick={handleAddDream}>
                {isDevilMode ? 'Generate MEAN Analysis' : 'Generate Analysis'}
              </button>
            </div>
          ) : (
            <button className="new-dream-btn" onClick={() => setSelectedDream(null)}>
              + New Dream
            </button>
          )}

          {selectedDream && (
            <div className="dream-display">
              <h3>{selectedDream.date}</h3>
              <p className="dream-text">💬{selectedDream.dream}</p>
              <p className="analysis-text">🧠 {selectedDream.analysis}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
