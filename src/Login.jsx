import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const userAge = age || 'NA';  
        const userGender = gender || 'NA';  

        const userData = { username, age: userAge, gender: userGender };

        navigate('/home', { state: userData });
    };

    return (
        <div className="auth-container">
            <div className="form-container">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form onSubmit={handleSubmit}>
                    {isLogin ? (
                        <>
                            <label htmlFor="login-username">Email:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="login-password">Password:</label>
                            <input
                                type="password"
                                id="login-password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </>
                    ) : (
                        <>
                            <label htmlFor="signup-username">Username:</label>
                            <input
                                type="text"
                                id="signup-username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="signup-password">Password:</label>
                            <input
                                type="password"
                                id="signup-password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label htmlFor="signup-age" className="optionalLabels">
                                Age: <a className="optional">(optional)</a>
                            </label>
                            <input
                                type="number"
                                id="signup-age"
                                name="age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                            <label htmlFor="signup-gender" className="optionalLabels">
                                Gender: <a className="optional">(optional)</a>
                            </label>
                            <select
                                id="signup-gender"
                                name="gender"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Other</option>
                            </select>
                        </>
                    )}
                    <button className="login-button" type="submit">
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <p onClick={toggleForm} className="toggle-link">
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                </p>
            </div>
        </div>
    );
};

export default Login;
