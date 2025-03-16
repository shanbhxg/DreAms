import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isNightMode, setIsNightMode] = useState(() => {
        const savedMode = localStorage.getItem('isNightMode');
        return savedMode === 'true'; 
    });

    const URL = 'https://dre-ams.vercel.app/api';
    useEffect(() => {
        if (isNightMode) {
        document.body.classList.add('night-mode');
        } else {
        document.body.classList.remove('night-mode');
        }
        localStorage.setItem('isNightMode', isNightMode);
    }, [isNightMode]);

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        try {
            const endpoint = isLogin ? '/login' : '/signup';
            const userData = {
                user_name: username,
                password,
                age: age || null,
                gender: gender || null
            };
    
            const response = await fetch(`${URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
    
            const data = await response.json();
    
            if (response.ok && data.status.startsWith('200')) {
                localStorage.setItem('username', username);
                navigate('/home', {
                    state: { username, age: age || 'NA', gender: gender || 'NA' }
                });
            } else {
                if (data.status.startsWith('4')) {
                    setError(data.message);
                }
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    

    return (
        <div className="form-container">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {!isLogin && (
                        <>
                            <label>Age:</label>
                            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                            <label>Gender:</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                            </select>
                        </>
                    )}
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}</button>
                </form>
                <a onClick={toggleForm}>{isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}</a>
        </div>
    );
};

export default Login;
