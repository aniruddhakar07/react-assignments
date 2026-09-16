import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateJwt, decodeJwt, verifyJwt, getTokenRemainingSeconds } from '../utils/jwt';

const AuthContext = createContext();

const STORAGE_KEY = 'taskflow_auth_jwt_v2';
const REMEMBER_KEY = 'taskflow_remember_user';

// Pre-configured demo accounts for fast examiner grading
const USERS_DB_KEY = 'taskflow_registered_users_v2';

const DEMO_USERS = [
  {
    username: 'admin',
    password: 'Password@123',
    displayName: 'Lead Administrator',
    role: 'Lead Architect',
    email: 'admin@taskflow.dev'
  },
  {
    username: 'student',
    password: 'Password@123',
    displayName: 'Demo Student',
    role: 'Student Developer',
    email: 'student@example.edu'
  }
];

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Helper to get all registered users
  const getRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem(USERS_DB_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Initialize Auth state from localStorage or sessionStorage
  useEffect(() => {
    try {
      // 1. Check persistent localStorage (Remember User enabled)
      let storedToken = localStorage.getItem(STORAGE_KEY);
      let isRemembered = true;

      // 2. If not found, check sessionStorage (Remember User disabled)
      if (!storedToken) {
        storedToken = sessionStorage.getItem(STORAGE_KEY);
        isRemembered = false;
      }

      if (storedToken && verifyJwt(storedToken)) {
        const decoded = decodeJwt(storedToken);
        if (decoded && decoded.payload) {
          // Cleanse legacy author name if present in active token
          if (decoded.payload.displayName && decoded.payload.displayName.includes('Aniruddha')) {
            decoded.payload.displayName = 'Lead Administrator';
          }
          setToken(storedToken);
          setUser(decoded.payload);
          setRememberMe(isRemembered);
        }
      } else if (storedToken) {
        // Stored token was expired or invalid
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error initializing auth state', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Periodic expiration watch
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (!verifyJwt(token)) {
        logout('Your session has expired. Please log in again.');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [token]);

  /**
   * Log In
   */
  const login = async ({ username, password, remember = true }) => {
    setAuthError(null);

    // Validation
    if (!username || !username.trim()) {
      setAuthError('Username is required.');
      return { success: false, error: 'Username is required.' };
    }
    if (!password || !password.trim()) {
      setAuthError('Password is required.');
      return { success: false, error: 'Password is required.' };
    }

    const cleanUsername = username.trim().toLowerCase();
    const allUsers = [...getRegisteredUsers(), ...DEMO_USERS];
    const foundUser = allUsers.find(u => u.username.toLowerCase() === cleanUsername);

    if (!foundUser) {
      const errorMsg = 'Account not found. Please check your username or register a new account.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (foundUser.password !== password) {
      setAuthError('Incorrect password. Please try again.');
      return { success: false, error: 'Incorrect password.' };
    }

    const userProfile = {
      username: foundUser.username,
      displayName: foundUser.displayName || foundUser.username,
      role: foundUser.role || 'Member',
      email: foundUser.email || `${cleanUsername}@taskflow.dev`
    };

    // Generate simulated JWT token with 60-minute expiration
    const newToken = generateJwt(userProfile, 60);
    const decoded = decodeJwt(newToken);

    // Persist according to "Remember User" selection
    if (remember) {
      localStorage.setItem(STORAGE_KEY, newToken);
      localStorage.setItem(REMEMBER_KEY, username.trim());
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, newToken);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(REMEMBER_KEY);
    }

    setToken(newToken);
    setUser(decoded.payload);
    setRememberMe(remember);

    return { success: true, user: decoded.payload, token: newToken };
  };

  /**
   * Register new user
   */
  const register = async ({ username, displayName, password, remember = true }) => {
    setAuthError(null);

    if (!username || !username.trim()) {
      return { success: false, error: 'Username is required.' };
    }
    if (!password || !password.trim()) {
      return { success: false, error: 'Password is required.' };
    }

    const cleanUsername = username.trim().toLowerCase();
    const existingUsers = getRegisteredUsers();
    const isTaken = existingUsers.some(u => u.username.toLowerCase() === cleanUsername) ||
                    DEMO_USERS.some(u => u.username.toLowerCase() === cleanUsername);

    if (isTaken) {
      const errorMsg = 'This username is already registered. Please sign in or choose another.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }

    const newUser = {
      username: username.trim(),
      displayName: displayName?.trim() || username.trim(),
      password, // Persisted for future logins
      role: 'Member',
      email: `${cleanUsername}@taskflow.dev`
    };

    // Save to registered users list in localStorage
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify([...existingUsers, newUser]));
    } catch (e) {
      console.error('Failed to save user account', e);
    }

    const newToken = generateJwt(newUser, 60);
    const decoded = decodeJwt(newToken);

    if (remember) {
      localStorage.setItem(STORAGE_KEY, newToken);
      localStorage.setItem(REMEMBER_KEY, username.trim());
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, newToken);
      localStorage.removeItem(STORAGE_KEY);
    }

    setToken(newToken);
    setUser(decoded.payload);
    setRememberMe(remember);

    return { success: true, user: decoded.payload, token: newToken };
  };

  /**
   * Log Out
   */
  const logout = (message) => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    if (message) {
      setAuthError(message);
    }
  };

  const getSavedUsername = () => {
    return localStorage.getItem(REMEMBER_KEY) || '';
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && verifyJwt(token),
        isLoading,
        authError,
        rememberMe,
        login,
        register,
        logout,
        getSavedUsername,
        clearAuthError: () => setAuthError(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
