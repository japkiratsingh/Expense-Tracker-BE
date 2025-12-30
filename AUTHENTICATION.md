# Authentication Guide

Complete guide to authentication in the Expense Tracker API. This document covers JWT-based authentication, token management, security best practices, and frontend integration.

## Table of Contents

- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [JWT Tokens](#jwt-tokens)
- [API Endpoints](#api-endpoints)
- [Frontend Integration](#frontend-integration)
- [Token Management](#token-management)
- [Security Best Practices](#security-best-practices)
- [Common Issues](#common-issues)
- [Examples](#examples)

---

## Overview

The Expense Tracker API uses **JWT (JSON Web Tokens)** for stateless authentication. This approach provides:

- **Stateless authentication**: No session storage on the server
- **Scalability**: Easy to scale horizontally
- **Security**: Tokens are cryptographically signed
- **Flexibility**: Tokens can be used across multiple services

### Key Features

- User registration and login
- Access tokens for API authentication
- Refresh tokens for obtaining new access tokens
- Secure password hashing with bcrypt
- Token expiration and rotation
- User profile retrieval
- Logout functionality

---

## Authentication Flow

### 1. Registration Flow

```
User -> Frontend: Enters registration details
Frontend -> API: POST /api/auth/register
API -> Database: Creates user account
API -> Frontend: Returns user + tokens
Frontend -> Storage: Stores tokens
Frontend -> User: Redirects to dashboard
```

### 2. Login Flow

```
User -> Frontend: Enters credentials
Frontend -> API: POST /api/auth/login
API -> Database: Validates credentials
API -> Frontend: Returns user + tokens
Frontend -> Storage: Stores tokens
Frontend -> User: Redirects to dashboard
```

### 3. Authenticated Request Flow

```
Frontend -> Storage: Retrieves access token
Frontend -> API: Sends request with Authorization header
API: Validates token
API: Processes request
API -> Frontend: Returns response
```

### 4. Token Refresh Flow

```
Frontend: Detects access token expired
Frontend -> Storage: Retrieves refresh token
Frontend -> API: POST /api/auth/refresh
API: Validates refresh token
API -> Frontend: Returns new tokens
Frontend -> Storage: Stores new tokens
Frontend: Retries original request
```

### 5. Logout Flow

```
User -> Frontend: Clicks logout
Frontend -> API: POST /api/auth/logout (optional)
Frontend -> Storage: Clears tokens
Frontend -> User: Redirects to login
```

---

## JWT Tokens

### Token Structure

A JWT token consists of three parts separated by dots:

```
header.payload.signature
```

Example token:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MWI1N2YyNi1hNTUwLTRkZTYtYjVhYS1kZGI2MWY5MTUxYmEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzU1NjAwMDAsImV4cCI6MTczNTU2MzYwMH0.mUt1jBNwan5G0AdL0OMutfqu39xXoNPpkHN_Tbbcv_Y
```

### Access Token

**Purpose**: Authenticate API requests

**Payload Structure**:
```json
{
  "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
  "email": "test@example.com",
  "iat": 1735560000,
  "exp": 1735563600
}
```

**Properties**:
- **Expiration**: 1 hour (default)
- **Use case**: Include in Authorization header for all protected endpoints
- **Storage**: Store in memory or sessionStorage (not localStorage)

### Refresh Token

**Purpose**: Obtain new access tokens

**Payload Structure**:
```json
{
  "userId": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
  "email": "test@example.com",
  "type": "refresh",
  "iat": 1735560000,
  "exp": 1736164800
}
```

**Properties**:
- **Expiration**: 7 days (default)
- **Use case**: Exchange for new access/refresh tokens
- **Storage**: Store in httpOnly cookie or secure storage (not accessible via JavaScript)

### Token Expiration

| Token Type | Default Expiration | Configurable Via |
|------------|-------------------|------------------|
| Access Token | 1 hour | `JWT_EXPIRES_IN` in .env |
| Refresh Token | 7 days | `JWT_REFRESH_EXPIRES_IN` in .env |

---

## API Endpoints

### 1. Register User

**Endpoint**: `POST /api/auth/register`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2025-12-30T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Refresh Token

**Endpoint**: `POST /api/auth/refresh`

**Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Get Current User

**Endpoint**: `GET /api/auth/me`

**Headers**:
```
Authorization: Bearer <access-token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "71b57f26-a550-4de6-b5aa-ddb61f9151ba",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2025-12-30T10:00:00.000Z",
      "updatedAt": "2025-12-30T10:00:00.000Z"
    }
  }
}
```

### 5. Logout

**Endpoint**: `POST /api/auth/logout`

**Headers**:
```
Authorization: Bearer <access-token>
```

**Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Frontend Integration

### React Example

#### 1. Authentication Context

```javascript
// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    const userData = sessionStorage.getItem('user');

    if (token && userData) {
      setAccessToken(token);
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    const data = await response.json();

    // Store tokens
    sessionStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    sessionStorage.setItem('user', JSON.stringify(data.data.user));

    setAccessToken(data.data.accessToken);
    setUser(data.data.user);

    return data.data.user;
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, firstName, lastName })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    const data = await response.json();

    // Store tokens
    sessionStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    sessionStorage.setItem('user', JSON.stringify(data.data.user));

    setAccessToken(data.data.accessToken);
    setUser(data.data.user);

    return data.data.user;
  };

  const logout = async () => {
    try {
      // Optional: Call logout endpoint
      if (accessToken) {
        await fetch('http://localhost:3000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user state
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setUser(null);
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      // Refresh token is invalid, log out user
      logout();
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();

    // Update tokens
    sessionStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    setAccessToken(data.data.accessToken);

    return data.data.accessToken;
  };

  const value = {
    user,
    accessToken,
    loading,
    login,
    register,
    logout,
    refreshAccessToken,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### 2. API Client with Auto Token Refresh

```javascript
// utils/apiClient.js
import { useAuth } from '../contexts/AuthContext';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.refreshTokenPromise = null;
  }

  setAuthContext(authContext) {
    this.authContext = authContext;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    // Add access token if available
    if (this.authContext?.accessToken) {
      config.headers['Authorization'] = `Bearer ${this.authContext.accessToken}`;
    }

    let response = await fetch(url, config);

    // Handle token expiration
    if (response.status === 401 && this.authContext?.refreshAccessToken) {
      try {
        // Prevent multiple simultaneous refresh requests
        if (!this.refreshTokenPromise) {
          this.refreshTokenPromise = this.authContext.refreshAccessToken();
        }

        const newToken = await this.refreshTokenPromise;
        this.refreshTokenPromise = null;

        // Retry original request with new token
        config.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, config);
      } catch (error) {
        // Refresh failed, user needs to login again
        this.refreshTokenPromise = null;
        throw error;
      }
    }

    return response;
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient('http://localhost:3000/api');

// Hook to use API client with auth context
export const useApiClient = () => {
  const auth = useAuth();
  apiClient.setAuthContext(auth);
  return apiClient;
};
```

#### 3. Protected Route Component

```javascript
// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

#### 4. Login Component

```javascript
// components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && <div className="error">{error}</div>}

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

#### 5. Using API Client in Components

```javascript
// components/ExpenseList.js
import React, { useState, useEffect } from 'react';
import { useApiClient } from '../utils/apiClient';

export const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiClient = useApiClient();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/expenses?page=1&limit=50');

      if (!response.ok) {
        throw new Error('Failed to load expenses');
      }

      const data = await response.json();
      setExpenses(data.data.expenses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Expenses</h2>
      <ul>
        {expenses.map(expense => (
          <li key={expense._id}>
            {expense.description} - ${expense.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

### Vanilla JavaScript Example

```javascript
// auth.js
class AuthManager {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.accessToken = sessionStorage.getItem('accessToken');
    this.refreshTokenPromise = null;
  }

  async login(email, password) {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    const data = await response.json();

    // Store tokens
    sessionStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    this.accessToken = data.data.accessToken;

    return data.data;
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await fetch(`${this.apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Session expired');
    }

    const data = await response.json();

    sessionStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    this.accessToken = data.data.accessToken;

    return data.data.accessToken;
  }

  async apiRequest(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    if (this.accessToken) {
      config.headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response = await fetch(url, config);

    // Handle token expiration
    if (response.status === 401) {
      try {
        if (!this.refreshTokenPromise) {
          this.refreshTokenPromise = this.refreshToken();
        }

        await this.refreshTokenPromise;
        this.refreshTokenPromise = null;

        // Retry with new token
        config.headers['Authorization'] = `Bearer ${this.accessToken}`;
        response = await fetch(url, config);
      } catch (error) {
        this.refreshTokenPromise = null;
        throw error;
      }
    }

    return response;
  }

  logout() {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.accessToken = null;
    window.location.href = '/login.html';
  }

  isAuthenticated() {
    return !!this.accessToken;
  }
}

// Usage
const auth = new AuthManager('http://localhost:3000/api');

// Login
try {
  const data = await auth.login('user@example.com', 'password123');
  console.log('Logged in:', data.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Make authenticated request
try {
  const response = await auth.apiRequest('/expenses');
  const data = await response.json();
  console.log('Expenses:', data);
} catch (error) {
  console.error('Request failed:', error);
}
```

---

## Token Management

### Best Practices

#### 1. Token Storage

**Access Token**:
- ✅ Store in memory (React state, Vue data)
- ✅ Store in sessionStorage (cleared when browser closes)
- ❌ Don't store in localStorage (persists across sessions)
- ❌ Don't store in cookies accessible via JavaScript

**Refresh Token**:
- ✅ Store in httpOnly cookie (not accessible via JavaScript)
- ✅ Store in secure localStorage with encryption
- ❌ Don't store in sessionStorage (lost on browser close)
- ❌ Don't expose to client-side JavaScript if possible

#### 2. Token Refresh Strategy

**Proactive Refresh** (Recommended):
```javascript
// Refresh token before it expires
const TOKEN_EXPIRY = 3600000; // 1 hour in ms
const REFRESH_BEFORE_EXPIRY = 300000; // 5 minutes in ms

setInterval(async () => {
  const tokenAge = Date.now() - tokenIssuedAt;

  if (tokenAge > TOKEN_EXPIRY - REFRESH_BEFORE_EXPIRY) {
    try {
      await refreshAccessToken();
    } catch (error) {
      // Handle refresh failure
      logout();
    }
  }
}, 60000); // Check every minute
```

**Reactive Refresh** (Fallback):
```javascript
// Refresh token when API returns 401
if (response.status === 401) {
  const newToken = await refreshAccessToken();
  // Retry request with new token
}
```

#### 3. Token Expiry Handling

```javascript
// Decode JWT to get expiration time
function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convert to milliseconds
  } catch (error) {
    return null;
  }
}

// Check if token is expired
function isTokenExpired(token) {
  const expiry = getTokenExpiry(token);
  return !expiry || Date.now() >= expiry;
}

// Get time until token expires
function getTimeUntilExpiry(token) {
  const expiry = getTokenExpiry(token);
  return expiry ? expiry - Date.now() : 0;
}
```

---

## Security Best Practices

### 1. Password Requirements

Enforce strong passwords on the frontend:

```javascript
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return 'Password must be at least 8 characters long';
  }
  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!hasNumbers) {
    return 'Password must contain at least one number';
  }

  return null; // Password is valid
}
```

### 2. HTTPS Only

Always use HTTPS in production:

```javascript
// Redirect HTTP to HTTPS
if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
  window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}
```

### 3. Secure Token Transmission

```javascript
// Always include credentials for CORS requests
fetch('https://api.example.com/auth/login', {
  method: 'POST',
  credentials: 'include', // Include cookies
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email, password })
});
```

### 4. XSS Protection

```javascript
// Sanitize user input before display
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Use textContent instead of innerHTML
element.textContent = userInput; // Safe
element.innerHTML = userInput;   // Unsafe
```

### 5. CSRF Protection

```javascript
// Include CSRF token in requests
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

fetch('/api/expenses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(expenseData)
});
```

### 6. Logout on Browser Close

```javascript
// Use sessionStorage for access token
// It's automatically cleared when browser closes
sessionStorage.setItem('accessToken', token);

// Optional: Clear tokens on window close
window.addEventListener('beforeunload', () => {
  if (shouldLogoutOnClose) {
    sessionStorage.clear();
  }
});
```

---

## Common Issues

### Issue 1: Token Expired During Request

**Problem**: Access token expires while user is filling out a form

**Solution**: Implement proactive token refresh

```javascript
// Refresh token 5 minutes before expiry
const refreshInterval = setInterval(async () => {
  const token = sessionStorage.getItem('accessToken');
  const timeUntilExpiry = getTimeUntilExpiry(token);

  if (timeUntilExpiry < 300000) { // 5 minutes
    await refreshAccessToken();
  }
}, 60000); // Check every minute

// Clear interval on logout
function logout() {
  clearInterval(refreshInterval);
  // ... rest of logout logic
}
```

### Issue 2: Multiple Concurrent Refresh Requests

**Problem**: Multiple API calls trigger multiple token refresh requests

**Solution**: Use a single shared promise for token refresh

```javascript
let refreshPromise = null;

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = fetch('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  })
    .then(res => res.json())
    .then(data => {
      sessionStorage.setItem('accessToken', data.data.accessToken);
      return data.data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}
```

### Issue 3: Refresh Token Expired

**Problem**: User hasn't used app for 7 days, refresh token expired

**Solution**: Gracefully handle and redirect to login

```javascript
async function refreshAccessToken() {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    sessionStorage.setItem('accessToken', data.data.accessToken);
    return data.data.accessToken;
  } catch (error) {
    // Refresh token expired, log out user
    logout();
    alert('Your session has expired. Please login again.');
    window.location.href = '/login';
    throw error;
  }
}
```

### Issue 4: Token Not Sent with Request

**Problem**: Forgot to include Authorization header

**Solution**: Create a wrapper function or use interceptors

```javascript
// Axios interceptor example
axios.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Fetch wrapper example
async function authenticatedFetch(url, options = {}) {
  const token = sessionStorage.getItem('accessToken');

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
}
```

---

## Examples

### Complete Login Form with Error Handling

```javascript
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        submit: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login to Expense Tracker</h2>

      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
          disabled={loading}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'error' : ''}
          disabled={loading}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="signup-link">
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </form>
  );
};
```

---

## Additional Resources

- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [MDN Web Docs: Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization)

---

## Support

For authentication-related issues or questions, please refer to the main [README.md](./README.md) or [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).
