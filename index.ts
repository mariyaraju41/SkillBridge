/** @jsxImportSource https://esm.sh/react@18.2.0 */
import React, { useState, useEffect, useCallback } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [skills, setSkills] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [error, setError] = useState('');

  // Enhanced Signup Data with validation
  const [signupData, setSignupData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'student',
    skills: [],
    interests: [],
    linkedinProfile: '',
    githubProfile: ''
  });

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  // Enhanced input change handler with validation
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    
    // Prevent single character inputs
    if (value.length === 1 && !/\w/.test(value)) {
      return;
    }

    // Field-specific validations
    switch(field) {
      case 'username':
        // Allow only alphanumeric characters and underscores
        if (value === '' || /^[a-zA-Z0-9_]+$/.test(value)) {
          setSignupData(prev => ({ ...prev, [field]: value }));
        }
        break;
      case 'firstName':
      case 'lastName':
        // Allow only letters and spaces
        if (value === '' || /^[a-zA-Z\s]+$/.test(value)) {
          setSignupData(prev => ({ ...prev, [field]: value }));
        }
        break;
      case 'email':
        setSignupData(prev => ({ ...prev, [field]: value }));
        break;
      case 'password':
      case 'confirmPassword':
        setSignupData(prev => ({ ...prev, [field]: value }));
        break;
      default:
        setSignupData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Login Handler with Enhanced Error Handling
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const username = e.target.username.value;
    const password = e.target.password.value;

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();
      
      if (result.success) {
        setUser(result.user);
        setView('dashboard');
        fetchRecommendedMentors();
        fetchJobRecommendations();
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection.');
    }
  };

  // Signup Handler with Enhanced Validation
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Comprehensive Signup Validation
    if (!signupData.username || signupData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!validateEmail(signupData.email)) {
      setError('Invalid email format');
      return;
    }

    if (!signupData.firstName || signupData.firstName.length < 2) {
      setError('First name is required and must be at least 2 characters');
      return;
    }

    if (!signupData.lastName || signupData.lastName.length < 2) {
      setError('Last name is required and must be at least 2 characters');
      return;
    }

    if (!validatePassword(signupData.password)) {
      setError('Password must be at least 8 characters, include uppercase, lowercase, and number');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...signupData,
          skills: JSON.stringify(signupData.skills)
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setUser(result.user);
        setView('dashboard');
        fetchRecommendedMentors();
        fetchJobRecommendations();
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please try again.');
    }
  };

  // Fetch Recommended Mentors
  const fetchRecommendedMentors = async () => {
    try {
      const response = await fetch('/mentors');
      const mentors = await response.json();
      setRecommendedMentors(mentors);
    } catch (error) {
      console.error('Mentor fetch error:', error);
    }
  };

  // Fetch Job Recommendations
  const fetchJobRecommendations = async () => {
    try {
      const response = await fetch('/jobs');
      const jobs = await response.json();
      setJobRecommendations(jobs);
    } catch (error) {
      console.error('Job recommendations error:', error);
    }
  };

  // LoginPage Component
  const LoginPage = () => (
    <div className="container-fluid vh-100 bg-primary">
      <div className="row h-100 align-items-center justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="card-title">Skill Bridge 🌉</h2>
                <p className="text-muted">Connect, Learn, Grow</p>
              </div>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="username" 
                    required 
                    placeholder="Enter your username"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="password" 
                    required 
                    placeholder="Enter your password"
                  />
                </div>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
                <div className="text-center mt-3">
                  <p>
                    New here? 
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setView('signup');
                      }} 
                      className="ms-2"
                    >
                      Sign Up
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // SignupPage Component
  const SignupPage = () => {
    const [newSkill, setNewSkill] = useState('');
    const predefinedSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 
      'Data Science', 'Cloud Computing', 'Cybersecurity', 'DevOps'
    ];

    const addSkill = () => {
      if (newSkill && !signupData.skills.includes(newSkill)) {
        setSignupData(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill]
        }));
        setNewSkill('');
      }
    };

    const removeSkill = (skillToRemove) => {
      setSignupData(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
    };

    return (
      <div className="container-fluid vh-100 bg-primary">
        <div className="row h-100 align-items-center justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="card-title">Join Skill Bridge</h2>
                  <p className="text-muted">Create your professional profile</p>
                </div>
                <form onSubmit={handleSignup}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={signupData.firstName}
                        onChange={handleInputChange('firstName')}
                        required 
                        placeholder="Enter first name"
                        minLength={2}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={signupData.lastName}
                        onChange={handleInputChange('lastName')}
                        required 
                        placeholder="Enter last name"
                        minLength={2}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={signupData.email}
                      onChange={handleInputChange('email')}
                      required 
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={signupData.username}
                      onChange={handleInputChange('username')}
                      required 
                      placeholder="Choose a username"
                      minLength={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={signupData.password}
                      onChange={handleInputChange('password')}
                      required 
                      placeholder="Create a strong password"
                      minLength={8}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={signupData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      required 
                      placeholder="Confirm your password"
                      minLength={8}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Skills</label>
                    <div className="input-group mb-2">
                      <select 
                        className="form-select" 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                      >
                        <option value="">Select a skill</option>
                        {predefinedSkills
                          .filter(skill => !signupData.skills.includes(skill))
                          .map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                          ))
                        }
                      </select>
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={addSkill}
                      >
                        Add Skill
                      </button>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {signupData.skills.map(skill => (
                        <span 
                          key={skill} 
                          className="badge bg-primary d-flex align-items-center"
                        >
                          {skill}
                          <button 
                            type="button" 
                            className="btn-close btn-close-white ms-2" 
                            onClick={() => removeSkill(skill)}
                            style={{fontSize: '0.5rem'}}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Create Account
                    </button>
                  </div>
                  <div className="text-center mt-3">
                    <p>
                      Already have an account? 
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setView('login');
                        }} 
                        className="ms-2"
                      >
                        Login
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render appropriate view
  return (
    <div>
      {view === 'login' && <LoginPage />}
      {view === 'signup' && <SignupPage />}
    </div>
  );
}

function client() {
  createRoot(document.getElementById("root")).render(<App />);
}
if (typeof document !== "undefined") { client(); }

export default async function server(request: Request): Promise<Response> {
  const { sqlite } = await import("https://esm.town/v/stevekrouse/sqlite");
  const KEY = new URL(import.meta.url).pathname.split("/").at(-1);
  const SCHEMA_VERSION = 11; // Incremented schema version

  // Create tables with more robust schema
  await sqlite.execute(`
    CREATE TABLE IF NOT EXISTS ${KEY}_users_${SCHEMA_VERSION} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'student',
      skills TEXT,
      interests TEXT,
      linkedinProfile TEXT,
      githubProfile TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Login Route
  if (request.method === 'POST' && new URL(request.url).pathname === '/login') {
    const { username, password } = await request.json();
    
    try {
      const userResult = await sqlite.execute(
        `SELECT * FROM ${KEY}_users_${SCHEMA_VERSION} WHERE username = ? AND password = ?`,
        [username, password]
      );

      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        return new Response(JSON.stringify({ 
          success: true, 
          user: {
            ...user,
            skills: user.skills ? JSON.parse(user.skills) : []
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Invalid username or password' 
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Login error' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Signup Route
  if (request.method === 'POST' && new URL(request.url).pathname === '/signup') {
    const { 
      username, 
      password, 
      firstName, 
      lastName, 
      email, 
      role,
      skills,
      linkedinProfile,
      githubProfile
    } = await request.json();
    
    try {
      // Check if username or email already exists
      const existingUser = await sqlite.execute(
        `SELECT * FROM ${KEY}_users_${SCHEMA_VERSION} 
         WHERE username = ? OR email = ?`,
        [username, email]
      );

      if (existingUser.rows.length > 0) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Username or email already exists' 
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Insert new user
      const userResult = await sqlite.execute(
        `INSERT INTO ${KEY}_users_${SCHEMA_VERSION} 
        (username, password, firstName, lastName, email, role, skills, linkedinProfile, githubProfile) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          username, 
          password, 
          firstName, 
          lastName, 
          email, 
          role,
          skills, 
          linkedinProfile,
          githubProfile
        ]
      );

      // Fetch the newly created user
      const newUserResult = await sqlite.execute(
        `SELECT * FROM ${KEY}_users_${SCHEMA_VERSION} WHERE id = ?`,
        [userResult.lastInsertRowid]
      );

      return new Response(JSON.stringify({ 
        success: true, 
        user: {
          ...newUserResult.rows[0],
          skills: JSON.parse(newUserResult.rows[0].skills || '[]')
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Error during signup' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Main HTML Response
  return new Response(`
    <html>
      <head>
        <title>Skill Bridge 🌉</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        
        <!-- Bootstrap Icons -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
        
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        
        <!-- Bootstrap JS Bundle with Popper -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script src="https://esm.town/v/std/catch"></script>
        <script type="module" src="${import.meta.url}"></script>
      </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}
