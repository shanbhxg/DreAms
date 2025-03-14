import React, { useState } from 'react';
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

    const URL = 'https://dre-ams.vercel.app/api';

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        if (!isLogin && (!age || !gender)) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }
    
        try {
            const endpoint = isLogin ? '/login' : '/signup';
            const userData = {
                user_name: username,
                password
            };
    
            if (!isLogin) {
                userData.age = age || '';
                userData.gender = gender || '';
            }
    
            const response = await fetch(`${URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
    
            const data = await response.json();
    
            if (response.ok && data.status.startsWith('200')) {
                navigate('/home', {
                    state: { username, age: age || 'NA', gender: gender || 'NA' }
                });
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    

    return (
        <div className="auth-container">
            <div className="form-container">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
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
                <p onClick={toggleForm}>{isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}</p>
            </div>
        </div>
    );
};

export default Login;
